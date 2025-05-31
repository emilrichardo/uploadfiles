export interface Field {
  id: string
  name: string
  dataType: string
  possibleFormats: string
  description: string
}

export interface DocumentData {
  file: File | null
  fileName: string
  fileType: string
  fields: Field[]
  apiEndpoint: string
  extractedData?: Record<string, any>
}

export interface FieldTemplate {
  id: string
  name: string
  fields: Field[]
  createdAt: string
  description?: string
  projectId: string
}

export interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  documentsCount: number
}

export interface ProcessedDocument {
  id: string
  projectId: string
  fileName: string
  fileType: string
  fields: Field[]
  extractedData: Record<string, any>
  processedAt: string
  templateId?: string
}
