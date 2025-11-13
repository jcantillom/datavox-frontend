// src/components/AudioRecorder.jsx - VERSIÓN CORREGIDA
import React, {useState, useRef, useEffect} from 'react';
import {motion} from 'framer-motion';
import {
    Mic,
    Square,
    Play,
    Pause,
    Upload,
    Trash2,
    CheckCircle,
    AlertCircle,
    FileText,
    Copy,
    Edit3,
    Download,
    Stethoscope,
    Pill,
    User,
    Calendar,
    Clock,
    FileDown,
    Scan // Usamos Scan en lugar de XRay
} from 'lucide-react';
import {storageService} from '../services/storage';
import {recordingService} from '../services/recordings';
import {transcriptionService} from '../services/transcription';
import {clinicalService} from '../services/clinical';


const AudioRecorder = () => {
    const [recordingState, setRecordingState] = useState('idle');
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [transcript, setTranscript] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [documentType, setDocumentType] = useState('clinical_history');
    const [documentMetadata, setDocumentMetadata] = useState({});
    const [generatedDocument, setGeneratedDocument] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const audioRef = useRef(null);
    const streamRef = useRef(null);

    // Document types para uso médico profesional
    const documentTypes = [
        {
            value: 'clinical_history',
            label: 'Historia Clínica',
            description: 'Documento completo de historia clínica',
            icon: Stethoscope
        },
        {
            value: 'radiology_report',
            label: 'Informe Radiológico',
            description: 'Reporte de estudios de imagen',
            icon: Scan // Cambiado de XRay a Scan
        },
        {
            value: 'medical_prescription',
            label: 'Formula Médica',
            description: 'Prescripción de medicamentos',
            icon: Pill
        },
        {
            value: 'medical_certificate',
            label: 'Certificado Médico',
            description: 'Certificado de atención médica',
            icon: FileText
        },
        {
            value: 'incapacity',
            label: 'Incapacidad',
            description: 'Documento de incapacidad laboral',
            icon: User
        }
    ];

    // Obtener icono según tipo de documento - FUNCIÓN CORREGIDA
    const getDocumentIcon = (type) => {
        const docType = documentTypes.find(doc => doc.value === type);
        return docType ? docType.icon : FileText;
    };

    // Configurar grabador de audio profesional
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

    // Mostrar estado con notificación profesional
    const showStatus = (status, message) => {
        setUploadStatus(status);
        setStatusMessage(message);

        if (status === 'success' || status === 'error') {
            setTimeout(() => {
                setUploadStatus('');
                setStatusMessage('');
            }, 5000);
        }
    };

    // Limpiar recursos
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

    // Iniciar grabación
    const startRecording = async () => {
        if (recordingState === 'completed') {
            clearRecording();
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (!mediaRecorderRef.current) {
            await setupRecorder();
        }

        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
            audioChunksRef.current = [];
            mediaRecorderRef.current.start(1000); // Capturar datos cada segundo
            setRecordingState('recording');
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

            showStatus('info', 'Grabando dictado médico...');
        }
    };

    // Pausar/reanudar grabación
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

    // Detener grabación
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

    // Limpiar grabación
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

        cleanupResources();

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        mediaRecorderRef.current = null;
    };

    // Subir y transcribir audio
    const uploadAndTranscribe = async () => {
        if (!audioBlob) return;

        setRecordingState('processing');
        setUploadStatus('processing');
        setStatusMessage('Iniciando procesamiento médico...');

        try {
            // 1. Subir audio a S3
            setStatusMessage('Subiendo audio a almacenamiento seguro...');
            const presignResponse = await storageService.presignPut({
                filename: `medical-dictation-${Date.now()}.webm`,
                content_type: 'audio/webm',
                size_bytes: audioBlob.size,
                folder: 'medical-recordings'
            });

            // Upload directo a S3
            const uploadResponse = await fetch(presignResponse.upload_url, {
                method: 'PUT',
                headers: presignResponse.required_headers,
                body: audioBlob
            });

            if (!uploadResponse.ok) {
                throw new Error('Error subiendo audio al almacenamiento seguro');
            }

            // 2. Registrar en base de datos
            setStatusMessage('Registrando en sistema médico...');
            const recordingData = {
                bucket: presignResponse.bucket,
                key: presignResponse.key,
                content_type: 'audio/webm',
                size_bytes: audioBlob.size,
                duration_sec: recordingTime
            };

            const recording = await recordingService.createRecording(recordingData);

            // 3. Iniciar transcripción
            setStatusMessage('Procesando con IA médica especializada...');
            await transcriptionService.startTranscription(recording.id);

            // 4. Polling para resultado con mejor manejo
            setStatusMessage('Generando transcripción médica...');
            const result = await transcriptionService.pollTranscriptionStatus(recording.id);

            if (result.transcript_text) {
                setTranscript(result.transcript_text);
                setRecordingState('completed');
                showStatus('success', 'Transcripción médica completada exitosamente');

                // Auto-generar documento basado en el tipo seleccionado
                await generateMedicalDocument(result.transcript_text);
            } else {
                throw new Error('No se pudo obtener la transcripción');
            }

        } catch (error) {
            console.error('Upload/transcription error:', error);
            setRecordingState('recorded');
            showStatus('error', `Error en procesamiento médico: ${error.message}`);
        }
    };

    // Generar documento médico
    const generateMedicalDocument = async (transcriptText) => {
        try {
            setStatusMessage('Generando documento médico...');

            const metadata = {
                ...documentMetadata,
                generated_at: new Date().toISOString(),
                recording_duration: recordingTime
            };

            const result = await clinicalService.generateMedicalDocument(
                documentType,
                transcriptText,
                metadata
            );

            if (result.success) {
                setGeneratedDocument(result);
                showStatus('success', 'Documento médico generado exitosamente');
            } else {
                throw new Error(result.error || 'Error generando documento');
            }
        } catch (error) {
            console.error('Error generating document:', error);
            showStatus('error', `Error generando documento: ${error.message}`);
        }
    };

    // Acciones para documentos
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

    const handleMetadataChange = (field, value) => {
        setDocumentMetadata(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Formatear tiempo
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        setupRecorder();
        return () => cleanupResources();
    }, []);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                    Sistema de Dictado Médico Profesional
                </h2>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    recordingState === 'recording' ? 'bg-red-100 text-red-700' :
                        recordingState === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                            recordingState === 'processing' ? 'bg-blue-100 text-blue-700' :
                                recordingState === 'completed' ? 'bg-green-100 text-green-700' :
                                    'bg-gray-100 text-gray-700'
                }`}>
                    {{
                        'idle': 'Listo para Dictar',
                        'recording': 'Grabando Dictado',
                        'paused': 'Grabación Pausada',
                        'recorded': 'Dictado Grabado',
                        'processing': 'Procesando',
                        'completed': 'Completado'
                    }[recordingState]}
                </div>
            </div>

            {/* Notificación de Estado */}
            {uploadStatus && (
                <motion.div
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    className={`mb-6 p-4 rounded-xl border ${
                        uploadStatus === 'success'
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : uploadStatus === 'error'
                                ? 'bg-red-50 border-red-200 text-red-800'
                                : uploadStatus === 'processing'
                                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                                    : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    }`}
                >
                    <div className="flex items-center space-x-3">
                        {uploadStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-500"/>}
                        {uploadStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-500"/>}
                        {uploadStatus === 'processing' && (
                            <div
                                className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
                        )}
                        {uploadStatus === 'info' && <Clock className="w-5 h-5 text-blue-500"/>}
                        {uploadStatus === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500"/>}
                        <p className="font-medium">{statusMessage}</p>
                    </div>
                </motion.div>
            )}

            {/* Selector de Tipo de Documento */}
            {recordingState === 'idle' && (
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    className="mb-6"
                >
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Tipo de Documento Médico
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {documentTypes.map((docType) => {
                            const IconComponent = docType.icon;
                            return (
                                <motion.button
                                    key={docType.value}
                                    onClick={() => setDocumentType(docType.value)}
                                    className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                                        documentType === docType.value
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    whileHover={{scale: 1.02}}
                                    whileTap={{scale: 0.98}}
                                >
                                    <IconComponent className={`w-6 h-6 mb-2 ${
                                        documentType === docType.value ? 'text-blue-600' : 'text-gray-400'
                                    }`}/>
                                    <div className="text-sm font-medium text-gray-900">
                                        {docType.label}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {docType.description}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Metadata del Documento */}
            {recordingState === 'idle' && (
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    className="mb-6"
                >
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Información del Documento
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Nombre del Médico
                            </label>
                            <input
                                type="text"
                                value={documentMetadata.doctor_name || ''}
                                onChange={(e) => handleMetadataChange('doctor_name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Dr. Juan Pérez"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Licencia Médica
                            </label>
                            <input
                                type="text"
                                value={documentMetadata.doctor_license || ''}
                                onChange={(e) => handleMetadataChange('doctor_license', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="LM-12345"
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Controles de Grabación */}
            <div className="space-y-6">
                {recordingState !== 'completed' ? (
                    <div className="text-center">
                        {/* Indicador Visual */}
                        {(recordingState === 'recording' || recordingState === 'paused') && (
                            <div className="mb-6">
                                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-3">
                                    <div className={`w-2 h-2 rounded-full ${
                                        recordingState === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
                                    } animate-pulse`}/>
                                    <span>
                                        {recordingState === 'paused' ? 'DICTADO PAUSADO' : 'GRABANDO DICTADO MÉDICO'}
                                    </span>
                                </div>

                                {/* Onda de sonido animada */}
                                {recordingState === 'recording' && (
                                    <div className="flex justify-center space-x-1 mb-4">
                                        {[1, 2, 3, 4, 3, 2, 3, 4, 5, 4, 3, 2].map((height, index) => (
                                            <motion.div
                                                key={index}
                                                className="w-1 bg-blue-500 rounded-full"
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

                                {/* Tiempo de grabación */}
                                <div className="text-2xl font-mono text-gray-700 mb-2">
                                    {formatTime(recordingTime)}
                                </div>
                            </div>
                        )}

                        {/* Botones de Control */}
                        <div className="flex justify-center space-x-4">
                            {recordingState === 'idle' ? (
                                <motion.button
                                    onClick={startRecording}
                                    className="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-lg"
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                >
                                    <Mic className="w-5 h-5"/>
                                    <span>Iniciar Dictado Médico</span>
                                </motion.button>
                            ) : (recordingState === 'recording' || recordingState === 'paused') ? (
                                <>
                                    <motion.button
                                        onClick={togglePause}
                                        className="flex items-center space-x-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold"
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                    >
                                        {recordingState === 'paused' ?
                                            <Play className="w-4 h-4"/> :
                                            <Pause className="w-4 h-4"/>
                                        }
                                        <span>{recordingState === 'paused' ? 'Reanudar' : 'Pausar'}</span>
                                    </motion.button>

                                    <motion.button
                                        onClick={stopRecording}
                                        className="flex items-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold"
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                    >
                                        <Square className="w-4 h-4"/>
                                        <span>Finalizar Dictado</span>
                                    </motion.button>
                                </>
                            ) : (recordingState === 'recorded' || recordingState === 'processing') && (
                                <div className="space-y-4 w-full">
                                    {/* Reproductor de Audio */}
                                    <div className="flex items-center space-x-4">
                                        <audio
                                            ref={audioRef}
                                            src={recordedAudio}
                                            controls
                                            className="flex-1"
                                        />
                                        <motion.button
                                            onClick={clearRecording}
                                            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                            whileHover={{scale: 1.1}}
                                        >
                                            <Trash2 className="w-5 h-5"/>
                                        </motion.button>
                                    </div>

                                    {/* Información del Audio */}
                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="w-4 h-4"/>
                                            <span>Duración: {formatTime(recordingTime)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <FileDown className="w-4 h-4"/>
                                            <span>Tamaño: {(audioBlob?.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    </div>

                                    {/* Botón de Procesamiento */}
                                    <motion.button
                                        onClick={uploadAndTranscribe}
                                        disabled={recordingState === 'processing'}
                                        className="w-full flex justify-center items-center space-x-2 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-xl font-semibold transition-colors"
                                        whileHover={recordingState !== 'processing' ? {scale: 1.02} : {}}
                                        whileTap={{scale: 0.98}}
                                    >
                                        {recordingState === 'processing' ? (
                                            <>
                                                <div
                                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                                                <span>Procesando Dictado Médico...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-5 h-5"/>
                                                <span>Procesar con IA Médica</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // Estado COMPLETADO - Transcripción y Documento listos
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        className="space-y-6"
                    >
                        {/* Header de Proceso Completado */}
                        <div
                            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="w-6 h-6 text-green-500"/>
                                <div>
                                    <h3 className="font-semibold text-green-900">Proceso Médico Completado</h3>
                                    <p className="text-green-700 text-sm">
                                        Dictado transcrito y documento médico generado exitosamente
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Audio y Información */}
                        <div className="flex items-center space-x-4">
                            <audio
                                ref={audioRef}
                                src={recordedAudio}
                                controls
                                className="flex-1"
                            />
                            <motion.button
                                onClick={clearRecording}
                                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                whileHover={{scale: 1.1}}
                            >
                                <Trash2 className="w-5 h-5"/>
                            </motion.button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>Duración: {formatTime(recordingTime)}</div>
                            <div>Tamaño: {(audioBlob?.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>

                        {/* Transcripción */}
                        <div className="bg-blue-50 rounded-xl border border-blue-200">
                            <div className="p-4 border-b border-blue-200">
                                <h3 className="font-semibold text-blue-900 flex items-center">
                                    <FileText className="w-4 h-4 mr-2"/>
                                    Transcripción Médica:
                                </h3>
                            </div>
                            <div className="p-4">
                                <p className="text-blue-800 whitespace-pre-wrap bg-white p-4 rounded-lg border border-blue-100 min-h-[120px]">
                                    {transcript}
                                </p>
                                <div className="flex justify-end mt-3">
                                    <motion.button
                                        onClick={handleCopyTranscript}
                                        className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        whileHover={{scale: 1.05}}
                                    >
                                        <Copy className="w-4 h-4"/>
                                        <span>Copiar Texto</span>
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Documento Generado */}
                        {generatedDocument && (
                            <div className="bg-green-50 rounded-xl border border-green-200">
                                <div className="p-4 border-b border-green-200">
                                    <h3 className="font-semibold text-green-900 flex items-center">
                                        {React.createElement(getDocumentIcon(documentType), {className: "w-4 h-4 mr-2"})}
                                        Documento Médico Generado:
                                    </h3>
                                </div>
                                <div className="p-4">
                                    <pre
                                        className="text-green-800 whitespace-pre-wrap bg-white p-4 rounded-lg border border-green-100 min-h-[200px] max-h-96 overflow-y-auto text-sm">
                                        {generatedDocument.content}
                                    </pre>
                                    <div className="flex justify-end space-x-3 mt-3">
                                        <motion.button
                                            onClick={handleCopyDocument}
                                            className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            whileHover={{scale: 1.05}}
                                        >
                                            <Copy className="w-4 h-4"/>
                                            <span>Copiar</span>
                                        </motion.button>
                                        <motion.button
                                            onClick={handleDownloadDocument}
                                            className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            whileHover={{scale: 1.05}}
                                        >
                                            <Download className="w-4 h-4"/>
                                            <span>Descargar</span>
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Acciones Adicionales */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <motion.button
                                onClick={clearRecording}
                                className="flex items-center justify-center space-x-2 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                whileHover={{scale: 1.05}}
                            >
                                <Mic className="w-4 h-4"/>
                                <span>Nuevo Dictado</span>
                            </motion.button>

                            <motion.button
                                className="flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                whileHover={{scale: 1.05}}
                            >
                                <Edit3 className="w-4 h-4"/>
                                <span>Editar Documento</span>
                            </motion.button>

                            <motion.button
                                className="flex items-center justify-center space-x-2 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                whileHover={{scale: 1.05}}
                            >
                                <FileDown className="w-4 h-4"/>
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