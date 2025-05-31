"use client"

import { useState, useEffect } from "react"
import { Button } from "@nextui-org/button"
import { Card, CardBody } from "@nextui-org/card"
import { Input } from "@nextui-org/input"
import { Divider } from "@nextui-org/divider"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal"
import { Plus, ArrowLeft, Trash2, Settings, Save } from "lucide-react"
import FieldItem from "./field-item"
import { saveFieldTemplate } from "@/lib/storage"
import type { Field, FieldTemplate } from "@/lib/types"

interface FieldDefinitionFormProps {
  onSubmit: (fields: Field[], templateId?: string) => void
  onBack: () => void
  initialFields?: Field[]
  projectId: string
  selectedTemplate?: FieldTemplate | null
}

export default function FieldDefinitionForm({
  onSubmit,
  onBack,
  initialFields = [],
  projectId,
  selectedTemplate,
}: FieldDefinitionFormProps) {
  const [fields, setFields] = useState<Field[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSaveTemplate, setShowSaveTemplate] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")

  useEffect(() => {
    if (selectedTemplate) {
      setFields(selectedTemplate.fields)
      setTemplateName(selectedTemplate.name)
      setTemplateDescription(selectedTemplate.description || "")
    } else if (initialFields.length > 0) {
      setFields(initialFields)
    } else {
      setFields([
        {
          id: "1",
          name: "",
          dataType: "text",
          possibleFormats: "",
          description: "",
        },
      ])
    }
  }, [initialFields, selectedTemplate])

  const addField = () => {
    setFields([
      ...fields,
      {
        id: `${Date.now()}`,
        name: "",
        dataType: "text",
        possibleFormats: "",
        description: "",
      },
    ])
  }

  const removeField = (id: string) => {
    if (fields.length > 1) {
      setFields(fields.filter((field) => field.id !== id))
      // Remove any errors for this field
      const newErrors = { ...errors }
      delete newErrors[`name-${id}`]
      setErrors(newErrors)
    }
  }

  const updateField = (id: string, updatedField: Partial<Field>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updatedField } : field)))

    // Clear errors when field is updated
    if (updatedField.name && errors[`name-${id}`]) {
      const newErrors = { ...errors }
      delete newErrors[`name-${id}`]
      setErrors(newErrors)
    }
  }

  const validateFields = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    fields.forEach((field) => {
      if (!field.name.trim()) {
        newErrors[`name-${field.id}`] = "El nombre del campo es obligatorio"
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = () => {
    if (validateFields()) {
      onSubmit(fields, selectedTemplate?.id)
    }
  }

  const handleSaveTemplate = () => {
    if (!templateName.trim() || !validateFields()) return

    const savedTemplate = saveFieldTemplate({
      name: templateName,
      fields,
      description: templateDescription,
      projectId,
    })

    setShowSaveTemplate(false)
    // Continue with the flow using the saved template
    onSubmit(fields, savedTemplate.id)
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
          <h2 className="text-2xl font-semibold text-gray-800">
            {selectedTemplate ? `Editando: ${selectedTemplate.name}` : "Definir Campos a Extraer"}
          </h2>
          <p className="text-gray-600 font-light">Configura los campos que quieres extraer del documento</p>
        </div>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id} className="card-elevated bg-white/80 backdrop-blur-sm">
            <CardBody className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg gradient-green-light p-2">
                    <Settings className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Campo {index + 1}</h3>
                </div>
                {fields.length > 1 && (
                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    onClick={() => removeField(field.id)}
                    size="lg"
                    className="hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </div>
              <Divider className="bg-gray-200" />
              <FieldItem
                field={field}
                onChange={(updatedField) => updateField(field.id, updatedField)}
                errors={{
                  name: errors[`name-${field.id}`],
                }}
              />
            </CardBody>
          </Card>
        ))}
      </div>

      <Button
        variant="flat"
        startContent={<Plus className="h-5 w-5" />}
        onClick={addField}
        size="lg"
        className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 font-medium py-6"
      >
        Agregar Otro Campo
      </Button>

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

        <div className="flex gap-4">
          {!selectedTemplate && (
            <Button
              variant="flat"
              startContent={<Save className="h-5 w-5" />}
              onClick={() => setShowSaveTemplate(true)}
              size="lg"
              className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 font-medium"
            >
              Guardar como Plantilla
            </Button>
          )}

          <Button
            color="success"
            onClick={handleSubmit}
            size="lg"
            className="btn-primary-gradient text-lg font-medium px-8 py-6"
          >
            Continuar a Revisión
          </Button>
        </div>
      </div>

      {/* Save Template Modal */}
      <Modal isOpen={showSaveTemplate} onClose={() => setShowSaveTemplate(false)} size="lg">
        <ModalContent className="m-6">
          <ModalHeader className="p-6 pb-2">
            <h3 className="text-xl font-semibold text-gray-800">Guardar Plantilla de Campos</h3>
          </ModalHeader>
          <ModalBody className="p-6 space-y-6">
            <Input
              label="Nombre de la Plantilla"
              placeholder="ej: Plantilla DNI, Facturas Servicios"
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
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
              <p className="text-green-800 font-medium">
                <strong>Campos:</strong> {fields.length}
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
              Guardar y Continuar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
