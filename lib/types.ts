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
}

export interface DocumentTemplate {
  id: string
  name: string
  fields: Field[]
  createdAt: string
  description?: string
}
