// src/components/AudioRecorder.jsx
import React, {useState, useRef, useEffect} from 'react';
import {motion} from 'framer-motion';
import {Mic, Square, Play, Pause, Upload, Trash2, Waves} from 'lucide-react';
import {storageService} from '../services/storage';
import {recordingService} from '../services/recordings';
import {transcriptionService} from '../services/transcription'; // ← Importación corregida

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [transcript, setTranscript] = useState('');

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const audioRef = useRef(null);
    const streamRef = useRef(null); // ← Nueva referencia para el stream

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

            streamRef.current = stream; // ← Guardar referencia

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
            };

        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('No se pudo acceder al micrófono. Por favor permita el acceso.');
        }
    };

    // Limpiar recursos
    const cleanupResources = () => {
        // Detener stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        // Limpiar URL de audio
        if (recordedAudio) {
            URL.revokeObjectURL(recordedAudio);
        }
    };

    // Iniciar grabación
    const startRecording = async () => {
        // Si ya hay una grabación, limpiar primero
        if (recordedAudio) {
            clearRecording();
            // Esperar un poco para que se limpie el estado
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (!mediaRecorderRef.current) {
            await setupRecorder();
        }

        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
            audioChunksRef.current = [];
            mediaRecorderRef.current.start(1000);
            setIsRecording(true);
            setIsPaused(false);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        }
    };

    // Detener grabación
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
            clearInterval(timerRef.current);

            // Limpiar recursos después de detener
            cleanupResources();
        }
    };

    // Pausar/reanudar grabación
    const togglePause = () => {
        if (mediaRecorderRef.current) {
            if (isPaused) {
                mediaRecorderRef.current.resume();
            } else {
                mediaRecorderRef.current.pause();
            }
            setIsPaused(!isPaused);
        }
    };

    // Limpiar grabación COMPLETAMENTE
    const clearRecording = () => {
        // Detener grabación si está activa
        if (isRecording) {
            stopRecording();
        }

        // Limpiar estado
        setRecordedAudio(null);
        setAudioBlob(null);
        setRecordingTime(0);
        setTranscript('');

        // Limpiar recursos
        cleanupResources();

        // Limpiar reproductor de audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        // Resetear recorder
        mediaRecorderRef.current = null;
    };

    // Subir audio al backend y manejar transcripción
    const uploadAudio = async () => {
        if (!audioBlob) return;

        setIsUploading(true);
        try {
            // 1. Subir audio a S3
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

            if (!uploadResponse.ok) {
                throw new Error('Error subiendo audio a S3');
            }

            // 2. Registrar en base de datos
            const recordingData = {
                bucket: presignResponse.bucket,
                key: presignResponse.key,
                content_type: 'audio/webm',
                size_bytes: audioBlob.size,
                duration_sec: recordingTime
            };

            const recording = await recordingService.createRecording(recordingData);

            // 3. Iniciar transcripción
            await transcriptionService.startTranscription(recording.id);

            alert('Audio subido. Iniciando transcripción...');

            // 4. Polling para obtener resultado
            const result = await transcriptionService.pollTranscriptionStatus(recording.id);

            setTranscript(result.transcript_text);

            alert('Transcripción completada!');

        } catch (error) {
            console.error('Upload/transcription error:', error);
            alert('Error: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    // Formatear tiempo
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        setupRecorder();

        return () => {
            // Cleanup al desmontar el componente
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            cleanupResources();
        };
    }, []);

    // Resto del componente permanece igual...
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Grabación de Dictado Médico
            </h2>

            {/* Controles de Grabación */}
            <div className="space-y-4">
                {!recordedAudio ? (
                    <div className="text-center">
                        {/* Indicador de Onda de Sonido */}
                        {isRecording && (
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

                        {/* Tiempo de Grabación */}
                        {isRecording && (
                            <div className="text-2xl font-mono text-gray-700 mb-4">
                                {formatTime(recordingTime)}
                            </div>
                        )}

                        {/* Botones de Control */}
                        <div className="flex justify-center space-x-4">
                            {!isRecording ? (
                                <motion.button
                                    onClick={startRecording}
                                    className="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-lg"
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                >
                                    <Mic className="w-5 h-5"/>
                                    <span>Iniciar Grabación</span>
                                </motion.button>
                            ) : (
                                <>
                                    <motion.button
                                        onClick={togglePause}
                                        className="flex items-center space-x-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold"
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                    >
                                        {isPaused ? <Play className="w-4 h-4"/> : <Pause className="w-4 h-4"/>}
                                        <span>{isPaused ? 'Reanudar' : 'Pausar'}</span>
                                    </motion.button>

                                    <motion.button
                                        onClick={stopRecording}
                                        className="flex items-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold"
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                    >
                                        <Square className="w-4 h-4"/>
                                        <span>Detener</span>
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    // Reproducción y Subida
                    <div className="space-y-4">
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
                            <div>Duración: {formatTime(recordingTime)}</div>
                            <div>Tamaño: {(audioBlob.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>

                        {/* Botón de Subida */}
                        <motion.button
                            onClick={uploadAudio}
                            disabled={isUploading}
                            className="w-full flex justify-center items-center space-x-2 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-xl font-semibold transition-colors"
                            whileHover={!isUploading ? {scale: 1.02} : {}}
                            whileTap={{scale: 0.98}}
                        >
                            {isUploading ? (
                                <>
                                    <div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Subiendo y Procesando...</span>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5"/>
                                    <span>Subir y Transcribir Audio</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Transcripción */}
            {transcript && (
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
                >
                    <h3 className="font-semibold text-blue-900 mb-2">Transcripción:</h3>
                    <p className="text-blue-800 whitespace-pre-wrap">{transcript}</p>

                    <div className="mt-3 flex space-x-3">
                        <motion.button
                            className="px-4 py-2 bg-white border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            whileHover={{scale: 1.05}}
                        >
                            Copiar Texto
                        </motion.button>
                        <motion.button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            whileHover={{scale: 1.05}}
                        >
                            Llenar Formulario
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AudioRecorder;