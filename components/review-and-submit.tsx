"use client"

import { useState } from "react"
import { Button } from "@nextui-org/button"
import { Card, CardBody } from "@nextui-org/card"
import { Divider } from "@nextui-org/divider"
import { Chip } from "@nextui-org/chip"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown"
import { ArrowLeft, Send, Check, AlertCircle, File, ChevronDown, ChevronUp, Sparkles, Download } from "lucide-react"
import { saveProcessedDocument, generateExtractedDataFile, getProjects, getProjectById } from "@/lib/storage"
import type { DocumentData, Project } from "@/lib/types"

interface ReviewAndSubmitProps {
  documentData: DocumentData
  onBack: () => void
  onReset: () => void
  currentProjectId: string
  templateId?: string
}

export default function ReviewAndSubmit({
  documentData,
  onBack,
  onReset,
  currentProjectId,
  templateId,
}: ReviewAndSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({})
  const [processedDocument, setProcessedDocument] = useState<any>(null)
  const [selectedProjectId, setSelectedProjectId] = useState(currentProjectId)
  const [projects, setProjects] = useState<Project[]>([])

  useState(() => {
    setProjects(getProjects())
  })

  const toggleField = (fieldId: string) => {
    setExpandedFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError("")

    try {
      // Create form data to send file and fields
      const formData = new FormData()
      if (documentData.file) {
        formData.append("file", documentData.file)
      }

      // Add fields as JSON
      formData.append("fields", JSON.stringify(documentData.fields))

      // Use environment variable for API endpoint
      const apiEndpoint = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://n8n-api-endpoint.example/webhook"

      // Simulate API call and response with extracted data
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate extracted data response
      const mockExtractedData: Record<string, any> = {}
      documentData.fields.forEach((field) => {
        // Generate mock data based on field type
        switch (field.dataType) {
          case "text":
            mockExtractedData[field.name] = `Valor extraído para ${field.name}`
            break
          case "number":
            mockExtractedData[field.name] = Math.floor(Math.random() * 1000)
            break
          case "date":
            mockExtractedData[field.name] = new Date().toISOString().split("T")[0]
            break
          case "email":
            mockExtractedData[field.name] = "ejemplo@email.com"
            break
          case "phone":
            mockExtractedData[field.name] = "+1234567890"
            break
          default:
            mockExtractedData[field.name] = `Valor de ${field.name}`
        }
      })

      setProcessedDocument({
        ...documentData,
        extractedData: mockExtractedData,
      })
      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDocument = () => {
    if (processedDocument && typeof window !== "undefined") {
      const savedDoc = saveProcessedDocument({
        projectId: selectedProjectId,
        fileName: processedDocument.fileName,
        fileType: processedDocument.fileType,
        fields: processedDocument.fields,
        extractedData: processedDocument.extractedData,
        templateId,
      })

      // Generate and download the extracted data file
      generateExtractedDataFile(savedDoc)
    }
  }

  const selectedProject = getProjectById(selectedProjectId)

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-8">
        <div className="relative">
          <div className="rounded-full gradient-green-light p-6 shadow-xl">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">¡Procesamiento Exitoso!</h2>
          <p className="text-gray-600 text-lg font-light max-w-lg mx-auto leading-relaxed">
            Tu documento ha sido procesado y los campos han sido extraídos exitosamente.
          </p>
        </div>

        {/* Extracted Data Preview */}
        {processedDocument && (
          <Card className="card-elevated bg-white/80 backdrop-blur-sm max-w-2xl w-full">
            <CardBody className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Datos Extraídos</h3>
              <Divider className="bg-gray-200" />
              <div className="space-y-3">
                {Object.entries(processedDocument.extractedData).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <span className="text-gray-600">{String(value)}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Project Selection */}
        <Card className="card-elevated bg-white/80 backdrop-blur-sm max-w-2xl w-full">
          <CardBody className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Guardar en Proyecto</h3>
            <Divider className="bg-gray-200" />
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">Proyecto:</span>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    className="bg-green-50 border border-green-200 hover:bg-green-100 min-w-64 justify-between"
                    endContent={<ChevronDown className="h-4 w-4" />}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-gray-800">{selectedProject?.name}</span>
                      {selectedProject?.description && (
                        <span className="text-xs text-gray-500 truncate max-w-48">{selectedProject.description}</span>
                      )}
                    </div>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Proyectos" className="min-w-64">
                  {projects.map((project) => (
                    <DropdownItem
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className={selectedProjectId === project.id ? "bg-green-50" : ""}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{project.name}</span>
                        {project.description && <span className="text-xs text-gray-500">{project.description}</span>}
                        <span className="text-xs text-gray-400">{project.documentsCount} documentos</span>
                      </div>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </CardBody>
        </Card>

        <div className="flex gap-4 flex-wrap justify-center">
          <Button
            color="primary"
            startContent={<Download className="h-5 w-5" />}
            onClick={handleSaveDocument}
            size="lg"
            className="btn-primary-gradient font-medium px-6"
          >
            Guardar Documento
          </Button>

          <Button color="success" onClick={onReset} size="lg" className="btn-primary-gradient font-medium px-8">
            Procesar Otro Documento
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button
          variant="flat"
          startContent={<ArrowLeft className="h-5 w-5" />}
          onClick={onBack}
          size="lg"
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Volver
        </Button>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-gray-800">Revisar y Procesar</h2>
          <p className="text-gray-600 font-light">Verifica la información antes de procesar</p>
        </div>
      </div>

      <Card className="card-elevated bg-white/80 backdrop-blur-sm">
        <CardBody className="p-8 space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Documento</h3>
          <Divider className="bg-gray-200" />
          <div className="flex items-center gap-4">
            <div className="rounded-xl gradient-green-light p-3">
              <File className="h-6 w-6 text-green-600" />
            </div>
            <div className="space-y-1">
              <span className="font-medium text-gray-800">{documentData.fileName}</span>
              <div className="flex items-center gap-3">
                <Chip size="md" variant="flat" className="bg-gray-100 text-gray-700">
                  {documentData.fileType}
                </Chip>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="card-elevated bg-white/80 backdrop-blur-sm">
        <CardBody className="p-8 space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Campos a Extraer ({documentData.fields.length})</h3>
          <Divider className="bg-gray-200" />

          <div className="space-y-4">
            {documentData.fields.map((field, index) => (
              <div key={field.id}>
                <Card className="bg-green-50/50 border border-green-100">
                  <div
                    className="cursor-pointer hover:bg-green-100/50 transition-colors p-6"
                    onClick={() => toggleField(field.id)}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-800">
                          Campo {index + 1}: {field.name}
                        </span>
                        <Chip size="md" variant="flat" className="bg-green-100 text-green-700">
                          {field.dataType}
                        </Chip>
                      </div>
                      {expandedFields[field.id] ? (
                        <ChevronUp className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                  </div>

                  {expandedFields[field.id] && (
                    <CardBody className="pt-0 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {field.possibleFormats && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Formatos Posibles:</p>
                            <p className="text-gray-600">{field.possibleFormats}</p>
                          </div>
                        )}

                        {field.description && (
                          <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">Descripción:</p>
                            <p className="text-gray-600">{field.description}</p>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="flex justify-between items-center pt-6">
        <Button
          variant="flat"
          startContent={<ArrowLeft className="h-5 w-5" />}
          onClick={onBack}
          size="lg"
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Volver
        </Button>
        <Button
          color="success"
          startContent={<Send className="h-5 w-5" />}
          onClick={handleSubmit}
          isLoading={isSubmitting}
          size="lg"
          className="btn-primary-gradient text-lg font-medium px-8"
        >
          {isSubmitting ? "Procesando..." : "Procesar Documento"}
        </Button>
      </div>
    </div>
  )
}
