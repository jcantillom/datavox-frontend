// src/components/AudioRecorder.jsx - VERSIÓN MEJORADA
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
    Download
} from 'lucide-react';
import {storageService} from '../services/storage';
import {recordingService} from '../services/recordings';
import {transcriptionService} from '../services/transcription';

const AudioRecorder = () => {
    const [recordingState, setRecordingState] = useState('idle'); // 'idle', 'recording', 'paused', 'recorded', 'processing', 'completed'
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [transcript, setTranscript] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const audioRef = useRef(null);
    const streamRef = useRef(null);

    // Configurar grabador de audio
    const setupRecorder = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });

            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, {type: 'audio/webm'});
                const audioUrl = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setRecordedAudio(audioUrl);
                setRecordingState('recorded');
            };

        } catch (error) {
            console.error('Error accessing microphone:', error);
            showStatus('error', 'No se pudo acceder al micrófono. Por favor permita el acceso.');
        }
    };

    // Mostrar estado con notificación profesional
    const showStatus = (status, message) => {
        setUploadStatus(status);
        setStatusMessage(message);

        setTimeout(() => {
            setUploadStatus('');
            setStatusMessage('');
        }, 5000);
    };

    // Limpiar recursos
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
            mediaRecorderRef.current.start(1000);
            setRecordingState('recording');
            setRecordingTime(0);

            // Timer que respeta el estado de pausa
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        }
    };

    // Pausar/reanudar grabación - CORREGIDO
    const togglePause = () => {
        if (mediaRecorderRef.current) {
            if (recordingState === 'paused') {
                mediaRecorderRef.current.resume();
                setRecordingState('recording');

                // Reanudar timer
                timerRef.current = setInterval(() => {
                    setRecordingTime(prev => prev + 1);
                }, 1000);
            } else {
                mediaRecorderRef.current.pause();
                setRecordingState('paused');

                // Detener timer completamente
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
        setStatusMessage('Iniciando procesamiento...');

        try {
            // 1. Subir audio a S3
            setStatusMessage('Subiendo audio a almacenamiento seguro...');
            const presignResponse = await storageService.presignPut({
                filename: `recording-${Date.now()}.webm`,
                content_type: 'audio/webm',
                size_bytes: audioBlob.size,
                folder: 'medical-recordings'
            });

            const uploadResponse = await fetch(presignResponse.upload_url, {
                method: 'PUT',
                headers: presignResponse.required_headers,
                body: audioBlob
            });

            if (!uploadResponse.ok) throw new Error('Error subiendo audio');

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
            setStatusMessage('Procesando con IA médica...');
            await transcriptionService.startTranscription(recording.id);

            // 4. Polling para resultado
            setStatusMessage('Generando transcripción...');
            const result = await transcriptionService.pollTranscriptionStatus(recording.id);

            setTranscript(result.transcript_text);
            setRecordingState('completed');
            showStatus('success', 'Transcripción médica completada exitosamente');

        } catch (error) {
            console.error('Upload/transcription error:', error);
            setRecordingState('recorded');
            showStatus('error', `Error en procesamiento: ${error.message}`);
        }
    };

    // Formatear tiempo
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Acciones para audio procesado
    const handleCopyTranscript = () => {
        navigator.clipboard.writeText(transcript);
        showStatus('success', 'Texto copiado al portapapeles');
    };

    const handleExportDocument = () => {
        // Lógica para exportar a formato médico
        showStatus('success', 'Documento médico exportado');
    };

    useEffect(() => {
        setupRecorder();
        return () => cleanupResources();
    }, []);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                    Grabación de Dictado Médico
                </h2>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    recordingState === 'recording' ? 'bg-red-100 text-red-700' :
                        recordingState === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                            recordingState === 'processing' ? 'bg-blue-100 text-blue-700' :
                                recordingState === 'completed' ? 'bg-green-100 text-green-700' :
                                    'bg-gray-100 text-gray-700'
                }`}>
                    {{
                        'idle': 'Listo',
                        'recording': 'Grabando',
                        'paused': 'Pausado',
                        'recorded': 'Grabado',
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
                                : 'bg-blue-50 border-blue-200 text-blue-800'
                    }`}
                >
                    <div className="flex items-center space-x-3">
                        {uploadStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-500"/>}
                        {uploadStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-500"/>}
                        {uploadStatus === 'processing' && (
                            <div
                                className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
                        )}
                        <p className="font-medium">{statusMessage}</p>
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
                                        {recordingState === 'paused' ? 'GRABACIÓN PAUSADA' : 'GRABANDO DICTADO MÉDICO'}
                                    </span>
                                </div>

                                {/* Onda de sonido solo cuando está grabando activamente */}
                                {recordingState === 'recording' && (
                                    <div className="flex justify-center space-x-1 mb-4">
                                        {[1, 2, 3, 4, 3, 2].map((height, index) => (
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

                                {/* Tiempo */}
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
                                    {/* Reproductor */}
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

                                    {/* Información */}
                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                        <div>Duración: {formatTime(recordingTime)}</div>
                                        <div>Tamaño: {(audioBlob?.size / 1024 / 1024).toFixed(2)} MB</div>
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
                                                <span>Procesando Dictado...</span>
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
                    // Estado COMPLETADO - Transcripción lista
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        className="space-y-6"
                    >
                        {/* Header de Transcripción Completada */}
                        <div
                            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="w-6 h-6 text-green-500"/>
                                <div>
                                    <h3 className="font-semibold text-green-900">Dictado Procesado Exitosamente</h3>
                                    <p className="text-green-700 text-sm">Transcripción médica lista para usar</p>
                                </div>
                            </div>
                        </div>

                        {/* Audio y Info */}
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
                            </div>
                        </div>

                        {/* Acciones para Transcripción Completada */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <motion.button
                                onClick={handleCopyTranscript}
                                className="flex items-center justify-center space-x-2 py-3 bg-white border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                whileHover={{scale: 1.05}}
                            >
                                <Copy className="w-4 h-4"/>
                                <span>Copiar Texto</span>
                            </motion.button>

                            <motion.button
                                className="flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                whileHover={{scale: 1.05}}
                            >
                                <Edit3 className="w-4 h-4"/>
                                <span>Llenar Formulario</span>
                            </motion.button>

                            <motion.button
                                onClick={handleExportDocument}
                                className="flex items-center justify-center space-x-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                whileHover={{scale: 1.05}}
                            >
                                <Download className="w-4 h-4"/>
                                <span>Exportar PDF</span>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AudioRecorder;