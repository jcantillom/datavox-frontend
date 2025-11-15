import React, {useState, useRef, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import Markdown from 'markdown-to-jsx';
import {
    Mic, Square, Play, Pause, Upload, Trash2, CheckCircle,
    AlertCircle, FileText, Copy, Edit3, Stethoscope,
    Pill, User, Clock, FileDown, Radiation, X,
    Shield, Brain, Database, Cloud, Sparkles, FileCheck,
    RotateCcw, FileSignature, ClipboardList, Save, Building, Briefcase, Activity
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
        icon: Radiation,
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
        icon: Briefcase,
        color: 'indigo',
        gradient: 'from-indigo-500 to-blue-500',
        lightGradient: 'from-indigo-50 to-blue-50',
        borderGradient: 'from-indigo-200 to-blue-200',
        textGradient: 'from-indigo-600 to-blue-600',
        shadow: 'shadow-indigo-500/25'
    }
};

// -------------------------------------------------------------------
// Modal de contexto clínico
// -------------------------------------------------------------------

const ClinicalContextModal = ({docConfig, onConfirm, onCancel}) => {
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
                        <p className="text-sm text-gray-600">
                            Asocie este dictado a un paciente y al foco clínico principal.
                        </p>
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
// Componente principal
// -------------------------------------------------------------------

const STEP_ORDER = ['uploading', 'registering', 'transcribing', 'generating'];

const AudioRecorder = ({ notifications }) => {
    const [recordingState, setRecordingState] = useState('idle');
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [documentType, setDocumentType] = useState('clinical_history');
    const [documentMetadata, setDocumentMetadata] = useState({});
    const [generatedDocument, setGeneratedDocument] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [processingSteps, setProcessingSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(null);
    const [showFinalSuccess, setShowFinalSuccess] = useState(false);
    const [showNewDictationOptions, setShowNewDictationOptions] = useState(false);
    const [isEditingDocument, setIsEditingDocument] = useState(false);
    const [editedDocumentContent, setEditedDocumentContent] = useState('');

    const [recordingId, setRecordingId] = useState(null);
    const [documentId, setDocumentId] = useState(null);
    const [showContextModal, setShowContextModal] = useState(false);

    // Timer total de procesamiento (se mantiene hasta limpiar dictado)
    const [processingDuration, setProcessingDuration] = useState(0);
    const llmTimerRef = useRef(null);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const audioRef = useRef(null);
    const streamRef = useRef(null);

    const currentDocConfig = DOCUMENT_TYPES_CONFIG[documentType];

    const processingStepsConfig = {
        uploading: {
            icon: Cloud,
            title: 'Subiendo Audio (S3)',
            description: 'Guardando el dictado en almacenamiento seguro',
            gradient: 'from-blue-500 to-cyan-500',
            lightGradient: 'from-blue-50 to-cyan-50',
            pulseColor: 'bg-gradient-to-r from-blue-500 to-cyan-500'
        },
        registering: {
            icon: Database,
            title: 'Registrando Metadatos (DB)',
            description: 'Creando el registro clínico asociado',
            gradient: 'from-indigo-500 to-purple-500',
            lightGradient: 'from-indigo-50 to-purple-50',
            pulseColor: 'bg-gradient-to-r from-indigo-500 to-purple-500'
        },
        transcribing: {
            icon: Brain,
            title: 'Transcribiendo (AWS Transcribe)',
            description: 'Convirtiendo audio a texto médico',
            gradient: 'from-emerald-500 to-green-500',
            lightGradient: 'from-emerald-50 to-green-50',
            pulseColor: 'bg-gradient-to-r from-emerald-500 to-green-500'
        },
        generating: {
            icon: Sparkles,
            title: 'Estructurando Informe (IA Médica)',
            description: 'Redactando informe listo para la historia clínica',
            gradient: 'from-amber-500 to-orange-500',
            lightGradient: 'from-amber-50 to-orange-50',
            pulseColor: 'bg-gradient-to-r from-amber-500 to-orange-500'
        },
        completed: {
            icon: FileCheck,
            title: 'Proceso Completado',
            description: 'Documento disponible para revisión y exportación',
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
                shadow: `shadow-lg ${config.shadow}`
            };
        }

        return {
            bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
            border: 'border-gray-200',
            text: 'text-gray-600',
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
                notifications.error('Error en la grabación de audio');
            };

        } catch (error) {
            console.error('Error accessing microphone:', error);
            if (error.name === 'NotAllowedError') {
                notifications.error('Permiso de micrófono denegado. Por favor permita el acceso al micrófono.');
            } else if (error.name === 'NotFoundError') {
                notifications.error('No se encontró ningún dispositivo de micrófono.');
            } else {
                notifications.error(`Error al acceder al micrófono: ${error.message}`);
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
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (recordedAudio) {
            URL.revokeObjectURL(recordedAudio);
        }

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        if (llmTimerRef.current) {
            clearInterval(llmTimerRef.current);
            llmTimerRef.current = null;
        }
    };

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

            notifications.info('Grabando dictado médico...');
        }
    };

    const startRecording = () => {
        if (recordingState === 'idle') {
            setShowContextModal(true);
        } else if (recordingState === 'completed') {
            handleNewDictation();
        }
    };

    const togglePause = () => {
        if (!mediaRecorderRef.current) return;

        if (recordingState === 'paused') {
            mediaRecorderRef.current.resume();
            setRecordingState('recording');
            notifications.info('Grabación reanudada');

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else if (recordingState === 'recording') {
            mediaRecorderRef.current.pause();
            setRecordingState('paused');
            notifications.warning('Grabación pausada');

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setRecordingState('recorded');
            notifications.success('Dictado grabado correctamente');

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
        setDocumentMetadata({});
        setProcessingDuration(0);   // el reloj se resetea sólo cuando se limpia el dictado

        cleanupResources();

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        mediaRecorderRef.current = null;
        setShowDeleteConfirm(false);
    };

    const handleDeleteClick = () => setShowDeleteConfirm(true);

    const handleNewDictation = () => setShowNewDictationOptions(true);

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
        if (!generatedDocument) return;
        setEditedDocumentContent(generatedDocument.content);
        setIsEditingDocument(true);
    };

    const handleSaveEditedDocument = async () => {
        if (!documentId) {
            notifications.error('Error: ID de documento no encontrado.');
            return;
        }

        try {
            const updateResult = await clinicalService.updateDocumentContent(
                documentId,
                editedDocumentContent,
                false
            );

            setGeneratedDocument(prev => ({
                ...prev,
                content: updateResult.content,
            }));

            setIsEditingDocument(false);
            notifications.success('Documento editado y guardado correctamente');
        } catch (error) {
            notifications.error(error.message || 'Error al guardar los cambios');
        }
    };

    const handleCancelEdit = () => {
        setIsEditingDocument(false);
        setEditedDocumentContent('');
    };

    const startTotalTimer = () => {
        setProcessingDuration(0);
        llmTimerRef.current = setInterval(() => {
            setProcessingDuration(prev => prev + 1);
        }, 1000);
    };

    const stopTotalTimer = () => {
        if (llmTimerRef.current) {
            clearInterval(llmTimerRef.current);
            llmTimerRef.current = null;
        }
    };

    const uploadAndTranscribe = async () => {
        if (!audioBlob) return;

        setRecordingState('processing');
        setUploadStatus('processing');
        setProcessingSteps([]);
        setCurrentStep(null);
        setShowFinalSuccess(false);
        setProcessingDuration(0);

        let currentRecording = null;
        let transcriptionResult = null;

        startTotalTimer();

        try {
            // 1. Subir audio
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

            // 2. Registrar metadatos
            updateProcessingStep('registering', 'active');
            const recordingData = {
                bucket: presignResponse.bucket,
                key: presignResponse.key,
                content_type: 'audio/webm',
                size_bytes: audioBlob.size,
                duration_sec: recordingTime
            };

            currentRecording = await recordingService.createRecording(recordingData);
            setRecordingId(currentRecording.id);
            updateProcessingStep('registering', 'completed');

            // 3. Transcripción
            updateProcessingStep('transcribing', 'active');
            await transcriptionService.startTranscription(currentRecording.id);

            transcriptionResult = await transcriptionService.pollTranscriptionStatus(currentRecording.id);

            if (!transcriptionResult.transcript_text) {
                throw new Error('No se pudo obtener la transcripción');
            }

            updateProcessingStep('transcribing', 'completed');

            // 4. Generación de documento
            updateProcessingStep('generating', 'active');

            await generateMedicalDocument(currentRecording.id, transcriptionResult.transcript_text);

            stopTotalTimer();
            updateProcessingStep('generating', 'completed');
            updateProcessingStep('completed', 'completed');

            setRecordingState('completed');
            setShowFinalSuccess(true);
            notifications.success(`Informe generado en ${formatTime(processingDuration)} minutos.`);

        } catch (error) {
            console.error('Upload/transcription error:', error);
            stopTotalTimer();
            setRecordingState('recorded');
            notifications.error(`Error en procesamiento médico: ${error.message}`);

            setProcessingSteps(prev => prev.map(step => ({
                ...step,
                status: step.status === 'active' ? 'error' : step.status
            })));
        }
    };

    const generateMedicalDocument = async (currentRecordingId, transcriptText) => {
        try {
            const metadata = {
                institution_name: localStorage.getItem('tenantCode'),
                doctor_name: JSON.parse(localStorage.getItem('userInfo'))?.full_name || 'Dr. Médico',
                recording_duration: recordingTime,
                patient_id: documentMetadata.patientId || 'N/A',
                clinical_subject: documentMetadata.subject || 'N/A',
            };

            const result = await clinicalService.generateMedicalDocument(
                currentRecordingId,
                documentType,
                transcriptText,
                metadata
            );

            if (result.success) {
                setGeneratedDocument(result);
                setDocumentId(result.document_id);
            } else {
                throw new Error(result.error || 'Error generando documento');
            }
        } catch (error) {
            console.error('Error generating document:', error);
            throw error;
        }
    };

    const handleCopyDocument = () => {
        if (!generatedDocument) return;
        navigator.clipboard.writeText(generatedDocument.content);
        notifications.success('Documento copiado al portapapeles');
    };

    const handleDownloadDocument = () => {
        notifications.warning(
            'La descarga de PDF oficial debe realizarse desde la página de Reportes Clínicos.',
            6000
        );
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

    const MarkdownOptions = {
        overrides: {
            h1: { props: { className: 'text-2xl font-extrabold text-gray-900 mt-6 mb-3 border-b pb-2' } },
            h2: { props: { className: 'text-xl font-bold text-gray-800 mt-5 mb-2' } },
            h3: { props: { className: 'text-lg font-semibold text-gray-700 mt-4 mb-1' } },
            h4: { props: { className: 'text-base font-semibold text-blue-600 mt-3 mb-1' } },
            p: { props: { className: 'text-gray-700 leading-relaxed mb-3' } },
            li: { props: { className: 'text-gray-700 ml-5 list-disc' } },
            pre: { props: { className: 'bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto my-3' } },
            table: { props: { className: 'w-full text-sm text-left text-gray-500 border border-gray-200 mt-3 mb-3' } },
            th: { props: { className: 'px-6 py-3 bg-gray-50' } },
            td: { props: { className: 'px-6 py-4' } },
        },
    };

    const getCleanContent = (content) => {
        if (!content) return '';
        let clean = content;
        clean = clean.replace(
            /--- INFORME MÉDICO OFICIAL ---[\s\S]*?-----------------------------------------------------------------------------------------\n/,
            ''
        ).trim();
        clean = clean.replace(/\n--- FIN DEL INFORME ---[\s\S]*$/, '').trim();
        return clean;
    };

    // ---------------------------------------------------
    // RENDER
    // ---------------------------------------------------

    const currentStepIndex =
        currentStep ? Math.max(STEP_ORDER.indexOf(currentStep), 0) : 0;
    const totalSteps = STEP_ORDER.length;

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200/50 p-6 shadow-xl shadow-blue-500/5">

            {/* Modales */}
            <AnimatePresence>
                {showContextModal && (
                    <ClinicalContextModal
                        docConfig={currentDocConfig}
                        onConfirm={initiateRecordingAfterContext}
                        onCancel={() => setShowContextModal(false)}
                    />
                )}
            </AnimatePresence>

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
                                        <div className="text-xs text-blue-600">
                                            Continuar con {currentDocConfig.label}
                                        </div>
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

            {/* HEADER: icono + estado + reloj global */}
            <div className="flex items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div
                            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg">
                            <Mic className="w-6 h-6 text-white"/>
                        </div>
                        <div
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-sky-100 flex items-center justify-center shadow-sm">
                            <Sparkles className="w-3 h-3 text-sky-500"/>
                        </div>
                    </div>
                    <div>
                        <h2
                            className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Sistema de Dictado Médico
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Dictado clínico asistido por IA para informes y documentos médicos.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className={`px-3 py-1 rounded-xl text-xs font-semibold backdrop-blur-sm border ${
                        recordingState === 'recording'
                            ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-200 text-red-700'
                            : recordingState === 'paused'
                                ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-200 text-yellow-700'
                                : recordingState === 'processing'
                                    ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-200 text-blue-700'
                                    : recordingState === 'completed'
                                        ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-200 text-green-700'
                                        : 'bg-gradient-to-r from-gray-500/10 to-gray-400/10 border-gray-200 text-gray-700'
                    }`}>
                        {{
                            'idle': '🟢 Listo para Dictar',
                            'recording': '🔴 Grabando Dictado',
                            'paused': '🟡 Grabación Pausada',
                            'recorded': '🟣 Dictado Grabado',
                            'processing': '🔄 Procesando Dictado',
                            'completed': '✅ Documento Generado'
                        }[recordingState]}
                    </div>

                    {processingDuration > 0 && (
                        <div
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-[11px] text-sky-100 shadow-md border border-slate-800">
                            <Activity className="w-3.5 h-3.5 text-emerald-300"/>
                            <span className="font-mono tracking-widest">
                                {formatTime(processingDuration)}
                            </span>
                            <span className="uppercase tracking-[0.16em] text-[10px] text-sky-200/80">
                                tiempo de proceso
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Banners de estado */}
            {recordingState === 'processing' && processingSteps.length > 0 && (
                <motion.div
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    className="mb-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-200/50 p-4 backdrop-blur-sm"
                >
                    <div className="flex items-center justify-between mb-4 gap-4">
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Shield className="w-5 h-5 text-white"/>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    Procesamiento Médico
                                </h3>
                                <p className="text-blue-600/70 text-sm">
                                    Orquestando carga, transcripción y generación del informe.
                                </p>
                            </div>
                        </div>

                        {/* Progreso visual en lugar de segundo reloj */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-blue-200 text-xs text-blue-800 shadow-sm">
                            <span className="font-semibold">Progreso</span>
                            <span className="font-mono">
                                {Math.min(currentStepIndex + 1, totalSteps)} / {totalSteps}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {processingSteps.map((step, index) => (
                            <motion.div
                                key={step.key}
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{delay: index * 0.08}}
                                className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl border border-gray-200/50 backdrop-blur-sm shadow-lg shadow-blue-500/5"
                            >
                                {getStepIcon(step)}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-base font-semibold ${getStepTextColor(step)}`}>
                                            {step.title}
                                        </span>
                                        {step.status === 'active' && (
                                            <div className={`${step.pulseColor} w-2 h-2 rounded-full animate-ping`}/>
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
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50 text-green-800 shadow-lg shadow-green-500/10'
                            : uploadStatus === 'error'
                                ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200/50 text-red-800 shadow-lg shadow-red-500/10'
                                : uploadStatus === 'processing'
                                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200/50 text-blue-800 shadow-lg shadow-blue-500/10'
                                    : 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200/50 text-yellow-800 shadow-lg shadow-yellow-500/10'
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
                        <p className="font-semibold text-base">{statusMessage}</p>
                    </div>
                </motion.div>
            )}

            {/* Metadatos capturados */}
            {recordingState !== 'idle' && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    className="mb-6 p-4 bg-gray-100/70 rounded-xl border border-gray-200 shadow-inner text-sm"
                >
                    <div className="flex items-center justify-between gap-3 flex-wrap">
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

            {/* Selección de tipo */}
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

            {/* Zona de grabación / resultado */}
            <div className="space-y-6">
                {recordingState !== 'completed' ? (
                    <div className="text-center">
                        {(recordingState === 'recording' || recordingState === 'paused') && (
                            <div className="mb-6">
                                <div
                                    className="flex items-center justify-center space-x-2 text-base font-semibold text-gray-600 mb-4">
                                    <div className={`w-2 h-2 rounded-full ${
                                        recordingState === 'paused'
                                            ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                                            : 'bg-gradient-to-r from-red-500 to-orange-500'
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
                                    onClick={startRecording}
                                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl font-bold text-base shadow-xl shadow-red-500/25 transition-all duration-300 group"
                                    whileHover={{scale: 1.03}}
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
                                        <span className="text-sm">
                                            {recordingState === 'paused' ? 'Reanudar' : 'Pausar'}
                                        </span>
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
                                            Informe generado en{' '}
                                            <span className="font-semibold">
                                                {formatTime(processingDuration)}
                                            </span>{' '}
                                            minutos.
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
                                                <div className="markdown-body text-gray-800 text-sm">
                                                    <Markdown options={MarkdownOptions}>
                                                        {getCleanContent(generatedDocument.content)}
                                                    </Markdown>
                                                </div>
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
                                onClick={handleDownloadDocument}
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
