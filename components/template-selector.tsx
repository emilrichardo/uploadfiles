"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@nextui-org/button"
import { Card, CardBody } from "@nextui-org/card"
import { Chip } from "@nextui-org/chip"
import { LayoutTemplateIcon as Template, Plus, Trash2, ArrowLeft } from "lucide-react"
import { getFieldTemplates, deleteFieldTemplate } from "@/lib/storage"
import type { FieldTemplate } from "@/lib/types"

interface TemplateSelectorProps {
  projectId: string
  onSelectTemplate: (template: FieldTemplate | null) => void
  onBack: () => void
}

export default function TemplateSelector({ projectId, onSelectTemplate, onBack }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<FieldTemplate[]>([])

  useEffect(() => {
    setTemplates(getFieldTemplates(projectId))
  }, [projectId])

  const handleDeleteTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteFieldTemplate(templateId)
    setTemplates(getFieldTemplates(projectId))
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
          <h2 className="text-2xl font-semibold text-gray-800">Seleccionar Plantilla de Campos</h2>
          <p className="text-gray-600 font-light">
            Elige una plantilla existente o crea una nueva configuración de campos
          </p>
        </div>
      </div>

      {/* Create New Template Button */}
      <div className="flex justify-center">
        <Button
          startContent={<Plus className="h-5 w-5" />}
          onClick={() => onSelectTemplate(null)}
          size="lg"
          className="btn-primary-gradient font-medium px-8"
        >
          Crear Nueva Plantilla de Campos
        </Button>
      </div>

      {/* Templates List */}
      {templates.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Plantillas Existentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="cursor-pointer card-hover" onClick={() => onSelectTemplate(template)}>
                <Card className="card-elevated gradient-green-subtle border-2 border-green-100 h-full">
                  <CardBody className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg gradient-green-light p-2">
                          <Template className="h-5 w-5 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-800">{template.name}</h4>
                      </div>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        className="hover:bg-red-50"
                        onClick={(e) => handleDeleteTemplate(template.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {template.description && <p className="text-gray-600 text-sm font-light">{template.description}</p>}

                    <div className="flex items-center justify-between">
                      <Chip size="sm" variant="flat" className="bg-green-100 text-green-700">
                        {template.fields.length} campos
                      </Chip>
                      <span className="text-xs text-gray-500">{new Date(template.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-600">Campos:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.fields.slice(0, 3).map((field) => (
                          <Chip key={field.id} size="sm" variant="flat" className="bg-gray-100 text-gray-600 text-xs">
                            {field.name}
                          </Chip>
                        ))}
                        {template.fields.length > 3 && (
                          <Chip size="sm" variant="flat" className="bg-gray-100 text-gray-600 text-xs">
                            +{template.fields.length - 3} más
                          </Chip>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {templates.length === 0 && (
        <div className="text-center py-16 space-y-6">
          <div className="rounded-2xl gradient-green-light p-8 w-fit mx-auto">
            <Template className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <div className="space-y-3">
            <p className="text-gray-600 text-lg font-medium">No hay plantillas en este proyecto</p>
            <p className="text-gray-500 font-light">
              Crea tu primera plantilla de campos para agilizar el procesamiento de documentos similares
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
