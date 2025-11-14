// src/components/AudioRecorder.jsx
import React, {useState, useRef, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {
    Mic, Square, Play, Pause, Upload, Trash2, CheckCircle,
    AlertCircle, FileText, Copy, Edit3, Download, Stethoscope,
    Pill, User, Calendar, Clock, FileDown, Radiation, X,
    Shield, Brain, Database, Cloud, Sparkles, FileCheck,
    RotateCcw, FileSignature, ClipboardList, Save, Scan, Building
} from 'lucide-react';
import {storageService} from '../services/storage';
import {recordingService} from '../services/recordings';
import {transcriptionService} from '../services/transcription';
import {clinicalService} from '../services/clinical';

const DOCUMENT_TYPES_CONFIG = {
    clinical_history: {
        value: 'clinical_history',
        label: 'Historia Clínica',
        description: 'Documento completo de historia clínica',
        icon: Stethoscope,
        color: 'blue',
        gradient: 'from-blue-500 to-cyan-500',
        lightGradient: 'from-blue-50 to-cyan-50',
        borderGradient: 'from-blue-200 to-cyan-200',
        textGradient: 'from-blue-600 to-cyan-600',
        shadow: 'shadow-blue-500/25'
    },
    radiology_report: {
        value: 'radiology_report',
        label: 'Informe Radiológico',
        description: 'Reporte de estudios de imagen',
        icon: Radiation, // REGLA: Usar Radiation para radiológico
        color: 'amber',
        gradient: 'from-amber-500 to-orange-500',
        lightGradient: 'from-amber-50 to-amber-50',
        borderGradient: 'from-amber-200 to-orange-200',
        textGradient: 'from-amber-600 to-orange-600',
        shadow: 'shadow-amber-500/25'
    },
    medical_prescription: {
        value: 'medical_prescription',
        label: 'Formula Médica',
        description: 'Prescripción de medicamentos',
        icon: Pill,
        color: 'emerald',
        gradient: 'from-emerald-500 to-green-500',
        lightGradient: 'from-emerald-50 to-green-50',
        borderGradient: 'from-emerald-200 to-green-200',
        textGradient: 'from-emerald-600 to-green-600',
        shadow: 'shadow-emerald-500/25'
    },
    medical_certificate: {
        value: 'medical_certificate',
        label: 'Certificado Médico',
        description: 'Certificado de atención médica',
        icon: FileText,
        color: 'purple',
        gradient: 'from-purple-500 to-pink-500',
        lightGradient: 'from-purple-50 to-pink-50',
        borderGradient: 'from-purple-200 to-pink-200',
        textGradient: 'from-purple-600 to-pink-600',
        shadow: 'shadow-purple-500/25'
    },
    incapacity: {
        value: 'incapacity',
        label: 'Incapacidad',
        description: 'Documento de incapacidad laboral',
        icon: User,
        color: 'indigo',
        gradient: 'from-indigo-500 to-blue-500',
        lightGradient: 'from-indigo-50 to-blue-50',
        borderGradient: 'from-indigo-200 to-blue-200',
        textGradient: 'from-indigo-600 to-blue-600',
        shadow: 'shadow-indigo-500/25'
    }
};


// -------------------------------------------------------------------
// Componente Modal de Contexto Clínico (NUEVO)
// -------------------------------------------------------------------

const ClinicalContextModal = ({docType, docConfig, onConfirm, onCancel}) => {
    const [patientId, setPatientId] = useState('');
    const [subject, setSubject] = useState('');
    const [error, setError] = useState('');

    const handleConfirm = () => {
        if (!patientId.trim() || !subject.trim()) {
            setError('Debe ingresar un identificador de paciente y el foco clínico.');
            return;
        }
        onConfirm({patientId, subject});
    };

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{scale: 0.9, opacity: 0, y: 20}}
                animate={{scale: 1, opacity: 1, y: 0}}
                exit={{scale: 0.9, opacity: 0, y: 20}}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-gray-200/50"
            >
                <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-200">
                    <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${docConfig.gradient} flex items-center justify-center shadow-lg`}>
                        <docConfig.icon className="w-6 h-6 text-white"/>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Contexto Clínico - {docConfig.label}
                        </h3>
                        <p className="text-sm text-gray-600">Asocie este dictado a un paciente y tema.</p>
                    </div>
                </div>

                {error && (
                    <p className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2"/>
                        {error}
                    </p>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Identificador de Paciente (Cédula/Historia) *
                        </label>
                        <input
                            type="text"
                            value={patientId}
                            onChange={(e) => {
                                setPatientId(e.target.value);
                                setError('');
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                            placeholder="Ej: HC-123456 / Juan Pérez"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Foco Clínico del Dictado (Asunto) *
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => {
                                setSubject(e.target.value);
                                setError('');
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                            placeholder="Ej: Hallazgos de TAC abdominal / Evolución post-operatoria"
                            required
                        />
                    </div>
                </div>

                <div className="flex space-x-3 justify-end mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-all duration-200 font-semibold rounded-lg hover:bg-gray-100 text-sm"
                    >
                        Cancelar
                    </button>
                    <motion.button
                        onClick={handleConfirm}
                        className={`flex items-center space-x-2 px-6 py-2 bg-gradient-to-r ${docConfig.gradient} hover:brightness-110 text-white rounded-xl font-bold shadow-lg ${docConfig.shadow} transition-all duration-300`}
                        whileTap={{scale: 0.98}}
                    >
                        <Mic className="w-4 h-4"/>
                        <span>Iniciar Grabación</span>
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};


// -------------------------------------------------------------------
// Componente AudioRecorder Principal
// -------------------------------------------------------------------

const AudioRecorder = () => {
    const [recordingState, setRecordingState] = useState('idle');
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [transcript, setTranscript] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [documentType, setDocumentType] = useState('clinical_history');
    const [documentMetadata, setDocumentMetadata] = useState({}); // {patientId, subject, ...}
    const [generatedDocument, setGeneratedDocument] = useState(null); // {document_id, content, ...}
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [processingSteps, setProcessingSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(null);
    const [showFinalSuccess, setShowFinalSuccess] = useState(false);
    const [showNewDictationOptions, setShowNewDictationOptions] = useState(false);
    const [isEditingDocument, setIsEditingDocument] = useState(false);
    const [editedDocumentContent, setEditedDocumentContent] = useState('');

    const [recordingId, setRecordingId] = useState(null);
    const [documentId, setDocumentId] = useState(null);

    // NUEVO ESTADO: Controla la aparición del modal de metadatos
    const [showContextModal, setShowContextModal] = useState(false);


    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const audioRef = useRef(null);
    const streamRef = useRef(null);

    const currentDocConfig = DOCUMENT_TYPES_CONFIG[documentType];

    const processingStepsConfig = {
        uploading: {
            icon: Cloud,
            title: 'Subiendo Audio',
            description: 'Guardando en almacenamiento seguro',
            gradient: 'from-blue-500 to-cyan-500',
            lightGradient: 'from-blue-50 to-cyan-50',
            pulseColor: 'bg-gradient-to-r from-blue-500 to-cyan-500'
        },
        registering: {
            icon: Database,
            title: 'Registrando en Sistema',
            description: 'Creando registro médico',
            gradient: 'from-indigo-500 to-purple-500',
            lightGradient: 'from-indigo-50 to-purple-50',
            pulseColor: 'bg-gradient-to-r from-indigo-500 to-purple-500'
        },
        transcribing: {
            icon: Brain,
            title: 'Procesando con IA',
            description: 'Transcribiendo dictado médico',
            gradient: 'from-emerald-500 to-green-500',
            lightGradient: 'from-emerald-50 to-green-50',
            pulseColor: 'bg-gradient-to-r from-emerald-500 to-green-500'
        },
        generating: {
            icon: Sparkles,
            title: 'Generando Documento',
            description: 'Creando documento médico estructurado',
            gradient: 'from-amber-500 to-orange-500',
            lightGradient: 'from-amber-50 to-orange-50',
            pulseColor: 'bg-gradient-to-r from-amber-500 to-orange-500'
        },
        completed: {
            icon: FileCheck,
            title: 'Proceso Completado',
            description: 'Documento listo para uso',
            gradient: 'from-green-500 to-emerald-500',
            lightGradient: 'from-green-50 to-emerald-50',
            pulseColor: 'bg-gradient-to-r from-green-500 to-emerald-500'
        }
    };

    const getDocColorClasses = (type, isSelected = false) => {
        const config = DOCUMENT_TYPES_CONFIG[type];
        if (!config) return DOCUMENT_TYPES_CONFIG.clinical_history;

        if (isSelected) {
            return {
                bg: `bg-gradient-to-br ${config.lightGradient}`,
                border: `border-transparent bg-gradient-to-br ${config.borderGradient} bg-origin-border`,
                text: `bg-gradient-to-r ${config.textGradient} bg-clip-text text-transparent`,
                icon: `bg-gradient-to-r ${config.textGradient} bg-clip-text text-transparent`,
                shadow: `shadow-lg ${config.shadow}`
            };
        }

        return {
            bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
            border: 'border-gray-200',
            text: 'text-gray-600',
            icon: 'text-gray-400',
            shadow: 'shadow-sm'
        };
    };

    const setupRecorder = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    channelCount: 1,
                    sampleRate: 44100,
                    sampleSize: 16
                }
            });

            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus',
                audioBitsPerSecond: 128000
            });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, {
                    type: 'audio/webm;codecs=opus'
                });
                const audioUrl = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setRecordedAudio(audioUrl);
                setRecordingState('recorded');
            };

            mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event.error);
                showStatus('error', 'Error en la grabación de audio');
            };

        } catch (error) {
            console.error('Error accessing microphone:', error);
            if (error.name === 'NotAllowedError') {
                showStatus('error', 'Permiso de micrófono denegado. Por favor permita el acceso al micrófono.');
            } else if (error.name === 'NotFoundError') {
                showStatus('error', 'No se encontró ningún dispositivo de micrófono.');
            } else {
                showStatus('error', `Error al acceder al micrófono: ${error.message}`);
            }
        }
    };

    const showStatus = (status, message, persistent = false) => {
        setUploadStatus(status);
        setStatusMessage(message);

        if ((status === 'success' || status === 'error') && !persistent) {
            setTimeout(() => {
                setUploadStatus('');
                setStatusMessage('');
            }, 5000);
        }
    };

    const updateProcessingStep = (step, status = 'active') => {
        setProcessingSteps(prev => {
            const newSteps = [...prev];
            const stepIndex = newSteps.findIndex(s => s.key === step);

            if (stepIndex !== -1) {
                newSteps[stepIndex] = {...newSteps[stepIndex], status};
            } else {
                newSteps.push({
                    key: step,
                    ...processingStepsConfig[step],
                    status
                });
            }

            return newSteps;
        });
        setCurrentStep(step);
    };

    const cleanupResources = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            streamRef.current = null;
        }

        if (recordedAudio) {
            URL.revokeObjectURL(recordedAudio);
        }

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    // NUEVA FUNCIÓN: Inicia la grabación DESPUÉS de obtener el contexto
    const initiateRecordingAfterContext = async (context) => {
        setShowContextModal(false);
        setDocumentMetadata(context);

        if (recordingState === 'completed') {
            handleNewDictation();
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (!mediaRecorderRef.current) {
            await setupRecorder();
        }

        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
            audioChunksRef.current = [];
            mediaRecorderRef.current.start(1000);
            setRecordingState('recording');
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

            showStatus('info', 'Grabando dictado médico...');
        }
    };

    // FUNCIÓN MODIFICADA: Ahora abre el modal o llama a la función de inicio si no es 'idle'
    const startRecording = async () => {
        if (recordingState === 'idle') {
            // Si está en idle, mostrar modal de contexto
            setShowContextModal(true);
        } else if (recordingState === 'completed') {
            // Si está en completed, iniciar flujo de nuevo dictado
            handleNewDictation();
        }
        // Si está en recorded, se espera que el usuario presione el botón de Procesar
    };


    const togglePause = () => {
        if (mediaRecorderRef.current) {
            if (recordingState === 'paused') {
                mediaRecorderRef.current.resume();
                setRecordingState('recording');
                showStatus('info', 'Grabación reanudada');

                timerRef.current = setInterval(() => {
                    setRecordingTime(prev => prev + 1);
                }, 1000);
            } else {
                mediaRecorderRef.current.pause();
                setRecordingState('paused');
                showStatus('warning', 'Grabación pausada');

                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
            }
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setRecordingState('recorded');
            showStatus('success', 'Dictado grabado correctamente');

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            cleanupResources();
        }
    };

    const clearRecording = () => {
        if (recordingState === 'recording' || recordingState === 'paused') {
            stopRecording();
        }

        setRecordedAudio(null);
        setAudioBlob(null);
        setRecordingTime(0);
        setTranscript('');
        setUploadStatus('');
        setStatusMessage('');
        setRecordingState('idle');
        setGeneratedDocument(null);
        setProcessingSteps([]);
        setCurrentStep(null);
        setShowFinalSuccess(false);
        setShowNewDictationOptions(false);
        setIsEditingDocument(false);
        setEditedDocumentContent('');

        setRecordingId(null);
        setDocumentId(null);
        setDocumentMetadata({}); // Limpiar metadatos

        cleanupResources();

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        mediaRecorderRef.current = null;
        setShowDeleteConfirm(false);
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleNewDictation = () => {
        setShowNewDictationOptions(true);
    };

    const handleNewDictationChoice = (choice) => {
        if (choice === 'sameType') {
            clearRecording();
        } else if (choice === 'differentType') {
            setDocumentType('clinical_history');
            clearRecording();
        }
        setShowNewDictationOptions(false);
    };

    const handleEditDocument = () => {
        if (generatedDocument) {
            setEditedDocumentContent(generatedDocument.content);
            setIsEditingDocument(true);
        }
    };

    const handleSaveEditedDocument = async () => {
        if (!documentId) {
            showStatus('error', 'Error: ID de documento no encontrado.');
            return;
        }

        try {
            const updateResult = await clinicalService.updateDocumentContent(
                documentId,
                editedDocumentContent,
                false // Marca como no finalizado si se edita
            );

            setGeneratedDocument(prev => ({
                ...prev,
                content: updateResult.content,
            }));

            setIsEditingDocument(false);
            showStatus('success', 'Documento editado y guardado correctamente');
        } catch (error) {
            showStatus('error', error.message || 'Error al guardar los cambios');
        }
    };

    const handleCancelEdit = () => {
        setIsEditingDocument(false);
        setEditedDocumentContent('');
    };

    const uploadAndTranscribe = async () => {
        if (!audioBlob) return;

        setRecordingState('processing');
        setUploadStatus('processing');
        setProcessingSteps([]);
        setCurrentStep(null);
        setShowFinalSuccess(false);

        let currentRecording = null;
        let transcriptionResult = null;

        try {
            // 1. UPLOADING
            updateProcessingStep('uploading', 'active');
            const presignResponse = await storageService.presignPut({
                filename: `medical-dictation-${Date.now()}.webm`,
                content_type: 'audio/webm',
                size_bytes: audioBlob.size,
                folder: 'medical-recordings'
            });

            const uploadResponse = await fetch(presignResponse.upload_url, {
                method: 'PUT',
                headers: presignResponse.required_headers,
                body: audioBlob
            });

            if (!uploadResponse.ok) {
                throw new Error('Error subiendo audio al almacenamiento seguro');
            }
            updateProcessingStep('uploading', 'completed');

            // 2. REGISTERING
            updateProcessingStep('registering', 'active');
            const recordingData = {
                bucket: presignResponse.bucket,
                key: presignResponse.key,
                content_type: 'audio/webm',
                size_bytes: audioBlob.size,
                duration_sec: recordingTime
            };

            currentRecording = await recordingService.createRecording(recordingData);
            setRecordingId(currentRecording.id); // Guardar ID
            updateProcessingStep('registering', 'completed');

            // 3. TRANSCRIBING
            updateProcessingStep('transcribing', 'active');
            await transcriptionService.startTranscription(currentRecording.id);

            transcriptionResult = await transcriptionService.pollTranscriptionStatus(currentRecording.id);

            if (!transcriptionResult.transcript_text) {
                throw new Error('No se pudo obtener la transcripción');
            }

            setTranscript(transcriptionResult.transcript_text);
            updateProcessingStep('transcribing', 'completed');

            // 4. GENERATING DOCUMENT
            updateProcessingStep('generating', 'active');
            // Pasar los metadatos de contexto capturados
            await generateMedicalDocument(currentRecording.id, transcriptionResult.transcript_text);
            updateProcessingStep('generating', 'completed');

            // 5. COMPLETED
            updateProcessingStep('completed', 'completed');

            setRecordingState('completed');
            setShowFinalSuccess(true);

        } catch (error) {
            console.error('Upload/transcription error:', error);
            setRecordingState('recorded');
            showStatus('error', `Error en procesamiento médico: ${error.message}`);

            setProcessingSteps(prev => prev.map(step => ({
                ...step,
                status: step.status === 'active' ? 'error' : step.status
            })));
        }
    };

    const generateMedicalDocument = async (currentRecordingId, transcriptText) => {
        try {
            // Metadatos base + metadatos capturados del modal
            const metadata = {
                institution_name: localStorage.getItem('tenantCode'),
                doctor_name: JSON.parse(localStorage.getItem('userInfo'))?.full_name || 'Dr. Médico',
                recording_duration: recordingTime,
                patient_id: documentMetadata.patientId || 'N/A', // Usar metadatos del estado
                clinical_subject: documentMetadata.subject || 'N/A', // Usar metadatos del estado
            };

            const result = await clinicalService.generateMedicalDocument(
                currentRecordingId,
                documentType,
                transcriptText,
                metadata
            );

            if (result.success) {
                setGeneratedDocument(result);
                setDocumentId(result.document_id); // Guardar ID del documento
            } else {
                throw new Error(result.error || 'Error generando documento');
            }
        } catch (error) {
            console.error('Error generating document:', error);
            throw error;
        }
    };

    const handleCopyTranscript = () => {
        navigator.clipboard.writeText(transcript);
        showStatus('success', 'Texto copiado al portapapeles');
    };

    const handleCopyDocument = () => {
        if (generatedDocument) {
            navigator.clipboard.writeText(generatedDocument.content);
            showStatus('success', 'Documento copiado al portapapeles');
        }
    };

    const handleDownloadDocument = () => {
        if (generatedDocument) {
            const blob = new Blob([generatedDocument.content], {type: 'text/plain'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `documento-medico-${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showStatus('success', 'Documento descargado');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getStepIcon = (step) => {
        const StepIcon = step.icon;

        if (step.status === 'pending') {
            return (
                <div
                    className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner">
                    <StepIcon className="w-4 h-4 text-gray-400"/>
                </div>
            );
        }

        if (step.status === 'active') {
            return (
                <div
                    className={`w-8 h-8 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg animate-pulse`}>
                    <StepIcon className="w-4 h-4 text-white"/>
                </div>
            );
        }

        if (step.status === 'completed') {
            return (
                <div
                    className={`w-8 h-8 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
                    <CheckCircle className="w-4 h-4 text-white"/>
                </div>
            );
        }

        if (step.status === 'error') {
            return (
                <div
                    className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <AlertCircle className="w-4 h-4 text-white"/>
                </div>
            );
        }
    };

    const getStepTextColor = (step) => {
        if (step.status === 'completed') return 'text-green-600 font-semibold';
        if (step.status === 'active') return `bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent font-bold`;
        if (step.status === 'error') return 'text-red-600 font-semibold';
        return 'text-gray-500';
    };

    useEffect(() => {
        setupRecorder();
        return () => cleanupResources();
    }, []);

    return (
        <div
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200/50 p-6 shadow-xl shadow-blue-500/5">

            {/* MODAL DE CONTEXTO CLÍNICO */}
            <AnimatePresence>
                {showContextModal && (
                    <ClinicalContextModal
                        docType={documentType}
                        docConfig={currentDocConfig}
                        onConfirm={initiateRecordingAfterContext}
                        onCancel={() => setShowContextModal(false)}
                    />
                )}
            </AnimatePresence>

            {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{scale: 0.9, opacity: 0, y: 20}}
                            animate={{scale: 1, opacity: 1, y: 0}}
                            exit={{scale: 0.9, opacity: 0, y: 20}}
                            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200/50"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                    Confirmar Eliminación
                                </h3>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                                >
                                    <X className="w-4 h-4 text-gray-500"/>
                                </button>
                            </div>
                            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                                ¿Está seguro de que desea eliminar este dictado? Esta acción no se puede deshacer.
                            </p>
                            <div className="flex space-x-3 justify-end">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-all duration-200 font-semibold rounded-lg hover:bg-gray-100 text-sm"
                                >
                                    Cancelar
                                </button>
                                <motion.button
                                    onClick={clearRecording}
                                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-red-500/25 text-sm"
                                >
                                    Eliminar Dictado
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL DE NUEVO DICTADO */}
            <AnimatePresence>
                {showNewDictationOptions && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{scale: 0.9, opacity: 0, y: 20}}
                            animate={{scale: 1, opacity: 1, y: 0}}
                            exit={{scale: 0.9, opacity: 0, y: 20}}
                            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200/50"
                        >
                            <div className="text-center mb-6">
                                <div
                                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                    <Mic className="w-6 h-6 text-white"/>
                                </div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                                    Nuevo Dictado
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    ¿Qué tipo de documento desea crear?
                                </p>
                            </div>

                            <div className="space-y-3 mb-6">
                                <motion.button
                                    onClick={() => handleNewDictationChoice('sameType')}
                                    className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl hover:border-blue-300 transition-all duration-200 group"
                                    whileHover={{scale: 1.02}}
                                    whileTap={{scale: 0.98}}
                                >
                                    <FileSignature
                                        className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform"/>
                                    <div className="text-left">
                                        <div className="font-semibold text-blue-700 text-sm">Mismo Tipo</div>
                                        <div className="text-xs text-blue-600">Continuar
                                            con {currentDocConfig.label}</div>
                                    </div>
                                </motion.button>

                                <motion.button
                                    onClick={() => handleNewDictationChoice('differentType')}
                                    className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 group"
                                    whileHover={{scale: 1.02}}
                                    whileTap={{scale: 0.98}}
                                >
                                    <ClipboardList
                                        className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform"/>
                                    <div className="text-left">
                                        <div className="font-semibold text-purple-700 text-sm">Cambiar Tipo</div>
                                        <div className="text-xs text-purple-600">Seleccionar otro tipo de documento
                                        </div>
                                    </div>
                                </motion.button>
                            </div>

                            <button
                                onClick={() => setShowNewDictationOptions(false)}
                                className="w-full py-3 text-gray-500 hover:text-gray-700 transition-colors font-semibold rounded-lg hover:bg-gray-100 text-sm"
                            >
                                Continuar Editando
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Sistema de Dictado Médico
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Profesional • Seguro • Eficiente</p>
                </div>
                <div className={`px-3 py-1 rounded-xl text-xs font-semibold backdrop-blur-sm border ${
                    recordingState === 'recording' ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-200 text-red-700' :
                        recordingState === 'paused' ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-200 text-yellow-700' :
                            recordingState === 'processing' ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-200 text-blue-700' :
                                recordingState === 'completed' ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-200 text-green-700' :
                                    'bg-gradient-to-r from-gray-500/10 to-gray-400/10 border-gray-200 text-gray-700'
                }`}>
                    {{
                        'idle': '🟢 Listo para Dictar',
                        'recording': '🔴 Grabando Dictado',
                        'paused': '🟡 Grabación Pausada',
                        'recorded': '🟣 Dictado Grabado',
                        'processing': '🔄 Procesando',
                        'completed': '✅ Completado'
                    }[recordingState]}
                </div>
            </div>

            {recordingState === 'processing' && processingSteps.length > 0 && (
                <motion.div
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    className="mb-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-200/50 p-4 backdrop-blur-sm"
                >
                    <div className="flex items-center space-x-3 mb-4">
                        <div
                            className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Shield className="w-5 h-5 text-white"/>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                Procesamiento Médico
                            </h3>
                            <p className="text-blue-600/70 text-sm">Procesando su dictado de forma segura</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {processingSteps.map((step, index) => (
                            <motion.div
                                key={step.key}
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{delay: index * 0.1}}
                                className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl border border-gray-200/50 backdrop-blur-sm shadow-lg shadow-blue-500/5"
                            >
                                {getStepIcon(step)}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-base font-semibold ${getStepTextColor(step)}`}>
                                            {step.title}
                                        </span>
                                        {step.status === 'active' && (
                                            <div className={`w-2 h-2 rounded-full ${step.pulseColor} animate-ping`}/>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {uploadStatus && !(recordingState === 'processing') && !showFinalSuccess && (
                <motion.div
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    className={`mb-6 p-4 rounded-xl border backdrop-blur-sm ${
                        uploadStatus === 'success'
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50 text-green-800 shadow-lg shadow-green-500/10' :
                            uploadStatus === 'error'
                                ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200/50 text-red-800 shadow-lg shadow-red-500/10' :
                                uploadStatus === 'processing'
                                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200/50 text-blue-800 shadow-lg shadow-blue-500/10' :
                                    'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200/50 text-yellow-800 shadow-lg shadow-yellow-500/10'
                    }`}
                >
                    <div className="flex items-center space-x-3">
                        {uploadStatus === 'success' && (
                            <div
                                className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                                <CheckCircle className="w-5 h-5 text-white"/>
                            </div>
                        )}
                        {uploadStatus === 'error' && (
                            <div
                                className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                                <AlertCircle className="w-5 h-5 text-white"/>
                            </div>
                        )}
                        {uploadStatus === 'processing' && (
                            <div
                                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                <div
                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                            </div>
                        )}
                        {uploadStatus === 'info' && (
                            <div
                                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Clock className="w-5 h-5 text-white"/>
                            </div>
                        )}
                        {uploadStatus === 'warning' && (
                            <div
                                className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                                <AlertCircle className="w-5 h-5 text-white"/>
                            </div>
                        )}
                        <p className="font-semibold text-base">{statusMessage}</p>
                    </div>
                </motion.div>
            )}

            {/* Mostrar metadatos capturados cuando no está en IDLE */}
            {recordingState !== 'idle' && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    className="mb-6 p-4 bg-gray-100/70 rounded-xl border border-gray-200 shadow-inner text-sm"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-gray-700">
                            <User className="w-4 h-4 text-blue-500"/>
                            <span className="font-semibold">Paciente:</span>
                            <span className="font-medium">{documentMetadata.patientId || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700">
                            <FileText className="w-4 h-4 text-purple-500"/>
                            <span className="font-semibold">Foco:</span>
                            <span className="font-medium">{documentMetadata.subject || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700">
                            <Building className="w-4 h-4 text-emerald-500"/>
                            <span className="font-semibold">Tipo:</span>
                            <span className="font-medium">{currentDocConfig.label}</span>
                        </div>
                    </div>
                </motion.div>
            )}

            {recordingState === 'idle' && (
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    className="mb-6"
                >
                    <label
                        className="block text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                        Tipo de Documento Médico
                    </label>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {Object.values(DOCUMENT_TYPES_CONFIG).map((docType) => {
                            const IconComponent = docType.icon;
                            const isSelected = documentType === docType.value;
                            const colorClasses = getDocColorClasses(docType.value, isSelected);

                            return (
                                <motion.button
                                    key={docType.value}
                                    onClick={() => setDocumentType(docType.value)}
                                    className={`p-5 border-2 rounded-2xl text-left transition-all duration-300 ${colorClasses.bg} ${colorClasses.border} ${colorClasses.shadow} group`}
                                    whileHover={{scale: 1.05, y: -2}}
                                    whileTap={{scale: 0.95}}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${docType.gradient} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <IconComponent className="w-6 h-6 text-white"/>
                                    </div>
                                    <div className={`text-sm font-bold ${colorClasses.text} mb-1`}>
                                        {docType.label}
                                    </div>
                                    <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                                        {docType.description}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            <div className="space-y-6">
                {recordingState !== 'completed' ? (
                    <div className="text-center">
                        {(recordingState === 'recording' || recordingState === 'paused') && (
                            <div className="mb-6">
                                <div
                                    className="flex items-center justify-center space-x-2 text-base font-semibold text-gray-600 mb-4">
                                    <div className={`w-2 h-2 rounded-full ${
                                        recordingState === 'paused' ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'bg-gradient-to-r from-red-500 to-orange-500'
                                    } animate-pulse shadow-lg`}/>
                                    <span className="text-sm">
                                        {recordingState === 'paused' ? 'DICTADO PAUSADO' : 'GRABANDO DICTADO MÉDICO'}
                                    </span>
                                </div>

                                {recordingState === 'recording' && (
                                    <div className="flex justify-center space-x-1 mb-4">
                                        {[1, 2, 3, 4, 3, 2, 3, 4, 5, 4, 3, 2].map((height, index) => (
                                            <motion.div
                                                key={index}
                                                className="w-1 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-full shadow-lg"
                                                style={{height: `${height * 6}px`}}
                                                animate={{
                                                    height: [height * 6, height * 8, height * 6],
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    repeat: Infinity,
                                                    delay: index * 0.1,
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}

                                <div
                                    className="text-3xl font-mono font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
                                    {formatTime(recordingTime)}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center space-x-4">
                            {recordingState === 'idle' ? (
                                <motion.button
                                    onClick={startRecording} // Ahora abre el modal
                                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl font-bold text-base shadow-xl shadow-red-500/25 transition-all duration-300 group"
                                    whileHover={{scale: 1.03, shadow: "0 15px 30px -8px rgba(239, 68, 68, 0.3)"}}
                                    whileTap={{scale: 0.97}}
                                >
                                    <Mic className="w-4 h-4 group-hover:scale-110 transition-transform"/>
                                    <span>Iniciar Dictado Médico</span>
                                </motion.button>
                            ) : (recordingState === 'recording' || recordingState === 'paused') ? (
                                <>
                                    <motion.button
                                        onClick={togglePause}
                                        className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white rounded-xl font-bold shadow-xl shadow-yellow-500/25 transition-all duration-300 group"
                                        whileHover={{scale: 1.03}}
                                        whileTap={{scale: 0.97}}
                                    >
                                        {recordingState === 'paused' ?
                                            <Play className="w-4 h-4 group-hover:scale-110 transition-transform"/> :
                                            <Pause className="w-4 h-4 group-hover:scale-110 transition-transform"/>
                                        }
                                        <span className="text-sm">{recordingState === 'paused' ? 'Reanudar' : 'Pausar'}</span>
                                    </motion.button>

                                    <motion.button
                                        onClick={stopRecording}
                                        className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-bold shadow-xl shadow-gray-500/25 transition-all duration-300 group"
                                        whileHover={{scale: 1.03}}
                                        whileTap={{scale: 0.97}}
                                    >
                                        <Square className="w-4 h-4 group-hover:scale-110 transition-transform"/>
                                        <span className="text-sm">Finalizar Dictado</span>
                                    </motion.button>
                                </>
                            ) : (recordingState === 'recorded' || recordingState === 'processing') && (
                                <div className="space-y-4 w-full max-w-2xl mx-auto">
                                    <div
                                        className="flex items-center space-x-4 p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200/50 shadow-lg">
                                        <audio
                                            ref={audioRef}
                                            src={recordedAudio}
                                            controls
                                            className="flex-1"
                                        />
                                        <motion.button
                                            onClick={handleDeleteClick}
                                            className="p-2 text-gray-500 hover:text-red-500 transition-all duration-200 hover:bg-red-50 rounded-lg"
                                            whileHover={{scale: 1.05}}
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </motion.button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                        <div
                                            className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200/50">
                                            <Clock className="w-4 h-4 text-blue-500"/>
                                            <span>Duración: {formatTime(recordingTime)}</span>
                                        </div>
                                        <div
                                            className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200/50">
                                            <FileDown className="w-4 h-4 text-green-500"/>
                                            <span>Tamaño: {(audioBlob?.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    </div>

                                    <motion.button
                                        onClick={uploadAndTranscribe}
                                        disabled={recordingState === 'processing'}
                                        className="w-full flex justify-center items-center space-x-2 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-green-300 disabled:to-emerald-300 text-white rounded-xl font-bold text-base shadow-xl shadow-green-500/25 transition-all duration-300 group"
                                        whileHover={recordingState !== 'processing' ? {scale: 1.02} : {}}
                                        whileTap={{scale: 0.98}}
                                    >
                                        {recordingState === 'processing' ? (
                                            <>
                                                <div
                                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                                                <span className="text-sm">Procesando Dictado Médico...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 group-hover:scale-110 transition-transform"/>
                                                <span>Procesar con IA Médica</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        className="space-y-6"
                    >
                        {showFinalSuccess && (
                            <div
                                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200/50 shadow-xl shadow-green-500/10">
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <CheckCircle className="w-6 h-6 text-white"/>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                            Proceso Médico Completado
                                        </h3>
                                        <p className="text-green-700/80 text-sm mt-1">
                                            Dictado transcrito y documento médico generado exitosamente
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div
                            className="flex items-center space-x-4 p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200/50 shadow-lg">
                            <audio
                                ref={audioRef}
                                src={recordedAudio}
                                controls
                                className="flex-1"
                            />
                            <motion.button
                                onClick={handleDeleteClick}
                                className="p-2 text-gray-500 hover:text-red-500 transition-all duration-200 hover:bg-red-50 rounded-lg"
                                whileHover={{scale: 1.05}}
                            >
                                <Trash2 className="w-4 h-4"/>
                            </motion.button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div
                                className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200/50 shadow-sm">
                                <Clock className="w-4 h-4 text-blue-500"/>
                                <span className="text-gray-700">Duración: {formatTime(recordingTime)}</span>
                            </div>
                            <div
                                className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200/50 shadow-sm">
                                <FileDown className="w-4 h-4 text-green-500"/>
                                <span
                                    className="text-gray-700">Tamaño: {(audioBlob?.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                        </div>

                        <div
                            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50 shadow-lg overflow-hidden">
                            <div
                                className="p-4 border-b border-blue-200/50 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
                                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center">
                                    <FileText className="w-5 h-5 mr-2"/>
                                    Transcripción Médica
                                </h3>
                            </div>
                            <div className="p-4">
                                <div className="bg-white rounded-lg border border-blue-100 p-4 shadow-inner">
                                    <p className="text-blue-800 whitespace-pre-wrap leading-relaxed text-sm min-h-[80px]">
                                        {transcript}
                                    </p>
                                </div>
                                <div className="flex justify-end mt-3">
                                    <motion.button
                                        onClick={handleCopyTranscript}
                                        className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 text-sm"
                                        whileHover={{scale: 1.03}}
                                    >
                                        <Copy className="w-3 h-3"/>
                                        <span>Copiar Texto</span>
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {generatedDocument && (
                            <div
                                className={`rounded-xl border shadow-lg overflow-hidden bg-gradient-to-br ${currentDocConfig.lightGradient} border-${currentDocConfig.color}-200/50`}>
                                <div className={`p-4 border-b bg-gradient-to-r ${currentDocConfig.borderGradient}`}>
                                    <h3 className="text-lg font-bold flex items-center justify-between">
                                        <div className="flex items-center">
                                            <currentDocConfig.icon className="w-5 h-5 mr-2"/>
                                            <span
                                                className={`bg-gradient-to-r ${currentDocConfig.textGradient} bg-clip-text text-transparent`}>
                                                Documento Médico - {currentDocConfig.label}
                                            </span>
                                        </div>
                                        {/* Botón de Editar siempre visible si no estamos editando */}
                                        {!isEditingDocument && (
                                            <motion.button
                                                onClick={handleEditDocument}
                                                className={`flex items-center space-x-2 px-3 py-1 bg-gradient-to-r ${currentDocConfig.gradient} hover:brightness-110 text-white rounded-lg font-semibold shadow-lg ${currentDocConfig.shadow} transition-all duration-200 text-sm`}
                                                whileHover={{scale: 1.03}}
                                            >
                                                <Edit3 className="w-3 h-3"/>
                                                <span>Editar Documento</span>
                                            </motion.button>
                                        )}
                                    </h3>
                                </div>
                                <div className="p-4">
                                    {isEditingDocument ? (
                                        <div className="space-y-3">
                                            <textarea
                                                value={editedDocumentContent}
                                                onChange={(e) => setEditedDocumentContent(e.target.value)}
                                                className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                                                placeholder="Edite el contenido del documento médico..."
                                            />
                                            <div className="flex justify-end space-x-3">
                                                <motion.button
                                                    onClick={handleCancelEdit}
                                                    className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors font-semibold text-sm"
                                                    whileHover={{scale: 1.03}}
                                                >
                                                    Cancelar
                                                </motion.button>
                                                <motion.button
                                                    onClick={handleSaveEditedDocument}
                                                    className={`flex items-center space-x-2 px-3 py-1 bg-gradient-to-r ${currentDocConfig.gradient} hover:brightness-110 text-white rounded-lg font-semibold shadow-lg ${currentDocConfig.shadow} transition-all duration-200 text-sm`}
                                                    whileHover={{scale: 1.03}}
                                                >
                                                    <Save className="w-3 h-3"/>
                                                    <span>Guardar Cambios</span>
                                                </motion.button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-inner max-h-64 overflow-y-auto">
                                                <pre className="whitespace-pre-wrap leading-relaxed text-gray-800 text-sm">
                                                    {generatedDocument.content}
                                                </pre>
                                            </div>
                                            <div className="flex justify-end space-x-3 mt-3">
                                                <motion.button
                                                    onClick={handleCopyDocument}
                                                    className={`flex items-center space-x-2 px-3 py-2 bg-gradient-to-r ${currentDocConfig.gradient} hover:brightness-110 text-white rounded-lg font-semibold shadow-lg ${currentDocConfig.shadow} transition-all duration-200 text-sm`}
                                                    whileHover={{scale: 1.03}}
                                                >
                                                    <Copy className="w-3 h-3"/>
                                                    <span>Copiar</span>
                                                </motion.button>
                                                <motion.button
                                                    onClick={handleDownloadDocument}
                                                    className={`flex items-center space-x-2 px-3 py-2 bg-gradient-to-r ${currentDocConfig.gradient} hover:brightness-110 text-white rounded-lg font-semibold shadow-lg ${currentDocConfig.shadow} transition-all duration-200 text-sm`}
                                                    whileHover={{scale: 1.03}}
                                                >
                                                    <Download className="w-3 h-3"/>
                                                    <span>Descargar</span>
                                                </motion.button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <motion.button
                                onClick={handleNewDictation}
                                className="flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-bold text-sm shadow-xl shadow-gray-500/25 transition-all duration-300 group"
                                whileHover={{scale: 1.03}}
                            >
                                <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform"/>
                                <span>Nuevo Dictado</span>
                            </motion.button>

                            <motion.button
                                onClick={handleEditDocument}
                                className="flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/25 transition-all duration-300 group"
                                whileHover={{scale: 1.03}}
                            >
                                <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform"/>
                                <span>Editar Documento</span>
                            </motion.button>

                            <motion.button
                                className="flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-purple-500/25 transition-all duration-300 group"
                                whileHover={{scale: 1.03}}
                            >
                                <FileDown className="w-4 h-4 group-hover:scale-110 transition-transform"/>
                                <span>Exportar a HIS</span>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AudioRecorder;