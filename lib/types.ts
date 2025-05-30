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
}
