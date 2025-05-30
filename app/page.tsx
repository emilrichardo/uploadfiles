"use client"

import { useState } from "react"
import { Card, CardBody, CardHeader } from "@nextui-org/card"
import { Progress } from "@nextui-org/progress"
import DocumentUploader from "@/components/document-uploader"
import FieldDefinitionForm from "@/components/field-definition-form"
import ReviewAndSubmit from "@/components/review-and-submit"
import DocumentTypeSelector from "@/components/document-type-selector"
import type { DocumentData } from "@/lib/types"

export default function Home() {
  const [step, setStep] = useState(0) // 0: type selection, 1: upload, 2: fields, 3: review
  const [documentData, setDocumentData] = useState<DocumentData>({
    file: null,
    fileName: "",
    fileType: "",
    fields: [],
    apiEndpoint: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://n8n-api-endpoint.example/webhook",
  })

  const handleTypeSelection = (type: "new" | "template", templateData?: any) => {
    if (type === "template" && templateData) {
      setDocumentData({
        ...documentData,
        fields: templateData.fields,
      })
      setStep(1)
    } else {
      setStep(1)
    }
  }

  const handleDocumentUpload = (file: File) => {
    setDocumentData({
      ...documentData,
      file,
      fileName: file.name,
      fileType: file.type,
    })
    setStep(2)
  }

  const handleFieldsUpdate = (fields: any[]) => {
    setDocumentData({
      ...documentData,
      fields,
    })
    setStep(3)
  }

  const handleApiEndpointUpdate = (endpoint: string) => {
    setDocumentData({
      ...documentData,
      apiEndpoint: endpoint,
    })
  }

  const handleReset = () => {
    setDocumentData({
      file: null,
      fileName: "",
      fileType: "",
      fields: [],
      apiEndpoint: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://n8n-api-endpoint.example/webhook",
    })
    setStep(0)
  }

  return (
    <div className="container mx-auto px-8 py-12">
      <Card className="max-w-5xl mx-auto card-elevated bg-white/70 backdrop-blur-sm">
        <CardHeader className="flex flex-col gap-6 p-10">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
              Document Reader
            </h1>
            <p className="text-gray-600 text-lg font-light">
              Extrae información de documentos con inteligencia artificial
            </p>
          </div>

          {step > 0 && (
            <div className="space-y-6">
              <Progress
                aria-label="Progress"
                value={(step / 3) * 100}
                className="max-w-lg mx-auto"
                color="warning"
                size="lg"
                classNames={{
                  track: "bg-yellow-100",
                  indicator: "gradient-yellow",
                }}
              />
              <div className="flex justify-between w-full max-w-lg mx-auto text-sm font-medium">
                <span className={`transition-colors ${step >= 1 ? "text-yellow-600" : "text-gray-400"}`}>
                  Subir Documento
                </span>
                <span className={`transition-colors ${step >= 2 ? "text-yellow-600" : "text-gray-400"}`}>
                  Definir Campos
                </span>
                <span className={`transition-colors ${step >= 3 ? "text-yellow-600" : "text-gray-400"}`}>
                  Revisar y Enviar
                </span>
              </div>
            </div>
          )}

          {step === 0 && (
            <div className="text-center space-y-2">
              <p className="text-gray-500 text-lg">Elige cómo quieres procesar tu documento</p>
              <div className="w-24 h-1 gradient-yellow mx-auto rounded-full"></div>
            </div>
          )}
        </CardHeader>

        <CardBody className="p-10 pt-0">
          {step === 0 && <DocumentTypeSelector onSelect={handleTypeSelection} />}
          {step === 1 && <DocumentUploader onUpload={handleDocumentUpload} onBack={() => setStep(0)} />}
          {step === 2 && (
            <FieldDefinitionForm
              onSubmit={handleFieldsUpdate}
              onBack={() => setStep(1)}
              initialFields={documentData.fields}
            />
          )}
          {step === 3 && (
            <ReviewAndSubmit
              documentData={documentData}
              onBack={() => setStep(2)}
              onApiEndpointChange={handleApiEndpointUpdate}
              onReset={handleReset}
            />
          )}
        </CardBody>
      </Card>
    </div>
  )
}
