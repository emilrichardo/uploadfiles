"use client"

import { useState } from "react"
import { Button } from "@nextui-org/button"
import { Card, CardBody } from "@nextui-org/card"
import { Input } from "@nextui-org/input"
import { Divider } from "@nextui-org/divider"
import { Chip } from "@nextui-org/chip"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal"
import { ArrowLeft, Send, Check, AlertCircle, File, ChevronDown, ChevronUp, Save, Sparkles } from "lucide-react"
import { saveTemplate } from "@/lib/storage"
import type { DocumentData } from "@/lib/types"

interface ReviewAndSubmitProps {
  documentData: DocumentData
  onBack: () => void
  onApiEndpointChange: (endpoint: string) => void
  onReset: () => void
}

export default function ReviewAndSubmit({ documentData, onBack, onApiEndpointChange, onReset }: ReviewAndSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({})
  const [showSaveTemplate, setShowSaveTemplate] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")

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

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you would make an actual API call:
      // const response = await fetch(apiEndpoint, {
      //   method: "POST",
      //   body: formData,
      // });
      //
      // if (!response.ok) {
      //   throw new Error(`Error: ${response.status}`);
      // }

      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return

    saveTemplate({
      name: templateName,
      fields: documentData.fields,
      description: templateDescription,
    })

    setShowSaveTemplate(false)
    setTemplateName("")
    setTemplateDescription("")
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-8">
        <div className="relative">
          <div className="rounded-full gradient-yellow-light p-6 shadow-xl">
            <Check className="h-12 w-12 text-yellow-600" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">¡Procesamiento Exitoso!</h2>
          <p className="text-gray-600 text-lg font-light max-w-lg mx-auto leading-relaxed">
            Tu documento y configuración de campos han sido enviados exitosamente a la API.
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            color="secondary"
            variant="flat"
            startContent={<Save className="h-5 w-5" />}
            onClick={() => setShowSaveTemplate(true)}
            size="lg"
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium px-6"
          >
            Guardar como Plantilla
          </Button>
          <Button color="success" onClick={onReset} size="lg" className="btn-primary-gradient font-medium px-8">
            Procesar Otro Documento
          </Button>
        </div>

        {/* Save Template Modal */}
        <Modal isOpen={showSaveTemplate} onClose={() => setShowSaveTemplate(false)} size="lg">
          <ModalContent className="m-6">
            <ModalHeader className="p-6 pb-2">
              <h3 className="text-xl font-semibold text-gray-800">Guardar Plantilla</h3>
            </ModalHeader>
            <ModalBody className="p-6 space-y-6">
              <Input
                label="Nombre de la Plantilla"
                placeholder="ej: Facturas de Servicios"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                isRequired
                size="lg"
                classNames={{
                  input: "text-base",
                  label: "text-base font-medium text-gray-700",
                  inputWrapper: "input-enhanced h-14",
                }}
              />
              <Input
                label="Descripción (opcional)"
                placeholder="Describe para qué tipo de documentos es esta plantilla"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                size="lg"
                classNames={{
                  input: "text-base",
                  label: "text-base font-medium text-gray-700",
                  inputWrapper: "input-enhanced h-14",
                }}
              />
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 space-y-2">
                <p className="text-yellow-800 font-medium">
                  <strong>Campos:</strong> {documentData.fields.length}
                </p>
              </div>
            </ModalBody>
            <ModalFooter className="p-6 pt-2">
              <Button
                variant="flat"
                onClick={() => setShowSaveTemplate(false)}
                size="lg"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                onClick={handleSaveTemplate}
                isDisabled={!templateName.trim()}
                size="lg"
                className="btn-primary-gradient font-medium"
              >
                Guardar Plantilla
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
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
          <h2 className="text-2xl font-semibold text-gray-800">Revisar y Enviar</h2>
          <p className="text-gray-600 font-light">Verifica la información antes de procesar</p>
        </div>
      </div>

      <Card className="card-elevated bg-white/80 backdrop-blur-sm">
        <CardBody className="p-8 space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Documento</h3>
          <Divider className="bg-gray-200" />
          <div className="flex items-center gap-4">
            <div className="rounded-xl gradient-yellow-light p-3">
              <File className="h-6 w-6 text-yellow-600" />
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
                <Card className="bg-yellow-50/50 border border-yellow-100">
                  <div
                    className="cursor-pointer hover:bg-yellow-100/50 transition-colors p-6"
                    onClick={() => toggleField(field.id)}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-800">
                          Campo {index + 1}: {field.name}
                        </span>
                        <Chip size="md" variant="flat" className="bg-yellow-100 text-yellow-700">
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
          {isSubmitting ? "Procesando..." : "Enviar a API"}
        </Button>
      </div>
    </div>
  )
}
