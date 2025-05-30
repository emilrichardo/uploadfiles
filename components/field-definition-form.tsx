"use client"

import { useState, useEffect } from "react"
import { Button } from "@nextui-org/button"
import { Card, CardBody } from "@nextui-org/card"
import { Divider } from "@nextui-org/divider"
import { Plus, ArrowLeft, Trash2, Settings } from "lucide-react"
import FieldItem from "./field-item"
import type { Field } from "@/lib/types"

interface FieldDefinitionFormProps {
  onSubmit: (fields: Field[]) => void
  onBack: () => void
  initialFields?: Field[]
}

export default function FieldDefinitionForm({ onSubmit, onBack, initialFields = [] }: FieldDefinitionFormProps) {
  const [fields, setFields] = useState<Field[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialFields.length > 0) {
      setFields(initialFields)
    } else {
      setFields([
        {
          id: "1",
          name: "",
          expectedValue: "",
          dataType: "text",
          possibleFormats: "",
          description: "",
        },
      ])
    }
  }, [initialFields])

  const addField = () => {
    setFields([
      ...fields,
      {
        id: `${Date.now()}`,
        name: "",
        expectedValue: "",
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
      delete newErrors[`expectedValue-${id}`]
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

    if (updatedField.expectedValue && errors[`expectedValue-${id}`]) {
      const newErrors = { ...errors }
      delete newErrors[`expectedValue-${id}`]
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

      if (!field.expectedValue.trim()) {
        newErrors[`expectedValue-${field.id}`] = "El valor esperado es obligatorio"
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = () => {
    if (validateFields()) {
      onSubmit(fields)
    }
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
          <h2 className="text-2xl font-semibold text-gray-800">Definir Campos a Extraer</h2>
          <p className="text-gray-600 font-light">Configura los campos que quieres extraer del documento</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <p className="text-blue-800 font-medium leading-relaxed">
          💡 <strong>Consejo:</strong> Define cada campo con un nombre descriptivo y un valor esperado. Esto ayudará a
          la IA a identificar correctamente la información en tu documento.
        </p>
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
                  expectedValue: errors[`expectedValue-${field.id}`],
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
  )
}
