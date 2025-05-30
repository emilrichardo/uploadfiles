export interface Field {
  id: string
  name: string
  expectedValue: string
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
  category?: string
}

export interface DocumentTemplate {
  id: string
  name: string
  category: string
  fields: Field[]
  createdAt: string
  description?: string
}

export interface DocumentCategory {
  id: string
  name: string
  description: string
  icon: string
}
