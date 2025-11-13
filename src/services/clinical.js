import {apiService} from './api';

export const clinicalService = {
    // Generación de documentos médicos
    async generateMedicalDocument(documentType, transcript, metadata) {
        try {
            // Simular generación de documento hasta que el backend esté listo
            const documentTemplates = {
                clinical_history: `
HISTORIA CLÍNICA

INSTITUCIÓN: ${metadata.institution_name || 'Centro Médico'}
MÉDICO: ${metadata.doctor_name || 'Dr. Médico'}
FECHA: ${new Date().toLocaleDateString()}

MOTIVO DE CONSULTA:
${transcript}

DIAGNÓSTICO:
Diagnóstico establecido según hallazgos clínicos.

TRATAMIENTO:
Plan de tratamiento según protocolo establecido.

OBSERVACIONES:
Paciente en observación. Seguimiento según evolución.

FIRMA: ___________________
${metadata.doctor_name || 'Dr. Médico'}
${metadata.doctor_license || 'LM-00000'}
                `,
                radiology_report: `
INFORME RADIOLÓGICO

INSTITUCIÓN: ${metadata.institution_name || 'Centro Radiológico'}
PACIENTE: ${metadata.patient_name || 'Paciente'}
FECHA: ${new Date().toLocaleDateString()}

ESTUDIO: ${metadata.study_type || 'Radiografía'}

HALLAZGOS:
${transcript}

IMPRESIÓN DIAGNÓSTICA:
Hallazgos radiológicos descritos en el estudio.

RECOMENDACIONES:
Seguimiento según criterio médico.

RADIÓLOGO: ${metadata.radiologist_name || 'Dr. Radiólogo'}
FIRMA: ___________________
                `,
                medical_prescription: `
FORMULA MÉDICA

INSTITUCIÓN: ${metadata.institution_name || 'Centro Médico'}
MÉDICO: ${metadata.doctor_name || 'Dr. Médico'}
PACIENTE: ${metadata.patient_name || 'Paciente'}
FECHA: ${new Date().toLocaleDateString()}

MEDICAMENTOS:
${transcript}

INDICACIONES:
Seguir tratamiento según indicaciones médicas.

FIRMA: ___________________
${metadata.doctor_name || 'Dr. Médico'}
${metadata.doctor_license || 'LM-00000'}
                `
            };

            const content = documentTemplates[documentType] || transcript;

            return {
                success: true,
                document_type: documentType,
                content: content,
                metadata: metadata,
                generated_at: new Date().toISOString()
            };

        } catch (error) {
            console.error('Error generating medical document:', error);
            return {
                success: false,
                error: error.message,
                document_type: documentType
            };
        }
    },

    // Tipos de documentos médicos soportados
    getDocumentTypes() {
        return [
            {
                value: 'clinical_history',
                label: 'Historia Clínica',
                description: 'Documento completo de historia clínica',
                icon: 'file-medical'
            },
            {
                value: 'radiology_report',
                label: 'Informe Radiológico',
                description: 'Reporte de estudios de imagen',
                icon: 'scan'
            },
            {
                value: 'medical_prescription',
                label: 'Formula Médica',
                description: 'Prescripción de medicamentos',
                icon: 'prescription'
            }
        ];
    }
};
