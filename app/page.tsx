"use client"

import { useState, useEffect } from "react"
import { Card, CardBody, CardHeader } from "@nextui-org/card"
import { Progress } from "@nextui-org/progress"
import DocumentUploader from "@/components/document-uploader"
import FieldDefinitionForm from "@/components/field-definition-form"
import ReviewAndSubmit from "@/components/review-and-submit"
import TemplateSelector from "@/components/template-selector"
import ProjectHeader from "@/components/project-header"
import { initializeDefaultProject } from "@/lib/storage"
import type { DocumentData, FieldTemplate } from "@/lib/types"

export default function Home() {
  const [step, setStep] = useState(1) // 1: upload, 2: template selection, 3: fields, 4: review
  const [currentProjectId, setCurrentProjectId] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<FieldTemplate | null>(null)
  const [documentData, setDocumentData] = useState<DocumentData>({
    file: null,
    fileName: "",
    fileType: "",
    fields: [],
    apiEndpoint: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://n8n-api-endpoint.example/webhook",
  })

  useEffect(() => {
    // Initialize with default project if none exists
    const defaultProject = initializeDefaultProject()
    setCurrentProjectId(defaultProject.id)
  }, [])

  const handleProjectChange = (projectId: string) => {
    setCurrentProjectId(projectId)
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

  const handleTemplateSelect = (template: FieldTemplate | null) => {
    setSelectedTemplate(template)
    if (template) {
      setDocumentData({
        ...documentData,
        fields: template.fields,
      })
    }
    setStep(3)
  }

  const handleFieldsUpdate = (fields: any[], templateId?: string) => {
    setDocumentData({
      ...documentData,
      fields,
    })
    setStep(4)
  }

  const handleReset = () => {
    setDocumentData({
      file: null,
      fileName: "",
      fileType: "",
      fields: [],
      apiEndpoint: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://n8n-api-endpoint.example/webhook",
    })
    setSelectedTemplate(null)
    setStep(1)
  }

  return (
    <div className="container mx-auto px-8 py-12">
      <Card className="max-w-5xl mx-auto card-elevated bg-white/70 backdrop-blur-sm">
        {/* Project Header */}
        <ProjectHeader selectedProjectId={currentProjectId} onProjectChange={handleProjectChange} />

        <CardHeader className="flex flex-col gap-6 p-10 pt-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Document Reader
            </h1>
            <p className="text-gray-600 text-lg font-light">
              Extrae información de documentos con inteligencia artificial
            </p>
          </div>

          {step > 1 && (
            <div className="space-y-6">
              <Progress
                aria-label="Progress"
                value={((step - 1) / 3) * 100}
                className="max-w-lg mx-auto"
                color="success"
                size="lg"
                classNames={{
                  track: "bg-green-100",
                  indicator: "gradient-green",
                }}
              />
              <div className="flex justify-between w-full max-w-lg mx-auto text-sm font-medium">
                <span className={`transition-colors ${step >= 2 ? "text-green-600" : "text-gray-400"}`}>
                  Seleccionar Plantilla
                </span>
                <span className={`transition-colors ${step >= 3 ? "text-green-600" : "text-gray-400"}`}>
                  Definir Campos
                </span>
                <span className={`transition-colors ${step >= 4 ? "text-green-600" : "text-gray-400"}`}>
                  Revisar y Procesar
                </span>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="text-center space-y-2">
              <p className="text-gray-500 text-lg">Sube tu documento para comenzar</p>
              <div className="w-24 h-1 gradient-green mx-auto rounded-full"></div>
            </div>
          )}
        </CardHeader>

        <CardBody className="p-10 pt-0">
          {step === 1 && <DocumentUploader onUpload={handleDocumentUpload} onBack={() => {}} />}
          {step === 2 && (
            <TemplateSelector
              projectId={currentProjectId}
              onSelectTemplate={handleTemplateSelect}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <FieldDefinitionForm
              onSubmit={handleFieldsUpdate}
              onBack={() => setStep(2)}
              initialFields={documentData.fields}
              projectId={currentProjectId}
              selectedTemplate={selectedTemplate}
            />
          )}
          {step === 4 && (
            <ReviewAndSubmit
              documentData={documentData}
              onBack={() => setStep(3)}
              onReset={handleReset}
              currentProjectId={currentProjectId}
              templateId={selectedTemplate?.id}
            />
          )}
        </CardBody>
      </Card>
    </div>
  )
}
