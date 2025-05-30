"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardBody } from "@nextui-org/card"
import { Button } from "@nextui-org/button"
import { Chip } from "@nextui-org/chip"
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal"
import { FileUp, LayoutTemplateIcon as Template, Trash2, Sparkles } from "lucide-react"
import { getTemplates, deleteTemplate } from "@/lib/storage"
import type { DocumentTemplate } from "@/lib/types"

interface DocumentTypeSelectorProps {
  onSelect: (type: "new" | "template", templateData?: DocumentTemplate) => void
}

export default function DocumentTypeSelector({ onSelect }: DocumentTypeSelectorProps) {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [showTemplates, setShowTemplates] = useState(false)

  useEffect(() => {
    setTemplates(getTemplates())
  }, [])

  const handleDeleteTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteTemplate(templateId)
    setTemplates(getTemplates())
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">¿Cómo quieres procesar tu documento?</h2>
        <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
          Puedes subir un nuevo documento y configurar los campos desde cero, o usar una plantilla existente para
          agilizar el proceso
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* New Document */}
        <div className="cursor-pointer card-hover" onClick={() => onSelect("new")}>
          <Card className="card-elevated gradient-yellow-subtle border-2 border-yellow-100 h-full">
            <CardBody className="flex flex-col items-center justify-center p-10 text-center space-y-6">
              <div className="relative">
                <div className="rounded-2xl gradient-yellow-light p-6 shadow-lg">
                  <FileUp className="h-10 w-10 text-yellow-600" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-800">Nuevo Documento</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Sube un documento y define los campos que quieres extraer desde cero
                </p>
              </div>
              <div className="w-full h-1 gradient-yellow rounded-full opacity-60"></div>
            </CardBody>
          </Card>
        </div>

        {/* Use Template */}
        <div className="cursor-pointer card-hover" onClick={() => setShowTemplates(true)}>
          <Card className="card-elevated gradient-yellow-subtle border-2 border-yellow-100 h-full">
            <CardBody className="flex flex-col items-center justify-center p-10 text-center space-y-6">
              <div className="relative">
                <div className="rounded-2xl gradient-yellow-light p-6 shadow-lg">
                  <Template className="h-10 w-10 text-yellow-600" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="rounded-full bg-yellow-500 text-gray-800 text-xs px-2 py-1 font-medium">
                    {templates.length}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-800">Usar Plantilla</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Usa una configuración de campos guardada anteriormente para procesar documentos similares
                </p>
              </div>
              <Chip size="lg" variant="flat" className="bg-yellow-100 text-yellow-700 font-medium px-4 py-2">
                {templates.length} plantillas disponibles
              </Chip>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Templates Modal */}
      <Modal isOpen={showTemplates} onClose={() => setShowTemplates(false)} size="3xl" scrollBehavior="inside">
        <ModalContent className="m-6">
          <ModalHeader className="p-8 pb-4">
            <h3 className="text-2xl font-semibold text-gray-800">Seleccionar Plantilla</h3>
          </ModalHeader>
          <ModalBody className="p-8 pt-4">
            {templates.length === 0 ? (
              <div className="text-center py-16 space-y-6">
                <div className="rounded-2xl gradient-yellow-light p-8 w-fit mx-auto">
                  <Template className="h-16 w-16 text-yellow-500 mx-auto" />
                </div>
                <div className="space-y-3">
                  <p className="text-gray-600 text-lg font-medium">No hay plantillas guardadas</p>
                  <p className="text-gray-500 font-light">
                    Procesa un documento primero para crear plantillas reutilizables
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Templates List */}
                <div className="space-y-4">
                  {templates.map((template) => {
                    return (
                      <div
                        key={template.id}
                        className="cursor-pointer"
                        onClick={() => {
                          onSelect("template", template)
                          setShowTemplates(false)
                        }}
                      >
                        <Card className="card-elevated card-hover bg-white/80 backdrop-blur-sm">
                          <CardBody className="flex flex-row items-center justify-between p-6">
                            <div className="flex items-center gap-6">
                              <div className="space-y-3">
                                <h4 className="font-semibold text-lg text-gray-800">{template.name}</h4>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-gray-500 font-medium">
                                    {template.fields.length} campos
                                  </span>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    {new Date(template.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                                {template.description && (
                                  <p className="text-gray-600 font-light">{template.description}</p>
                                )}
                              </div>
                            </div>
                            <Button
                              isIconOnly
                              size="lg"
                              variant="light"
                              color="danger"
                              className="hover:bg-red-50"
                              onClick={(e) => handleDeleteTemplate(template.id, e)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </CardBody>
                        </Card>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}
