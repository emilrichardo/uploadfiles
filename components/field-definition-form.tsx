"use client"

import { useState } from "react"
import { Button } from "@nextui-org/button"
import { Card, CardBody } from "@nextui-org/card"
import { Divider } from "@nextui-org/divider"
import { Plus, ArrowLeft, Trash2 } from "lucide-react"
import FieldItem from "./field-item"
import type { Field } from "@/lib/types"

interface FieldDefinitionFormProps {
  onSubmit: (fields: Field[]) => void
  onBack: () => void
}

export default function FieldDefinitionForm({ onSubmit, onBack }: FieldDefinitionFormProps) {
  const [fields, setFields] = useState<Field[]>([
    {
      id: "1",
      name: "",
      expectedValue: "",
      dataType: "text",
      possibleFormats: "",
      description: "",
    },
  ])
  const [errors, setErrors] = useState<Record<string, string>>({})

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
        newErrors[`name-${field.id}`] = "Field name is required"
        isValid = false
      }

      if (!field.expectedValue.trim()) {
        newErrors[`expectedValue-${field.id}`] = "Expected value is required"
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
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Define Fields to Extract</h2>
      <p className="text-sm text-gray-600 mb-4">
        Define the fields you want to extract from the document. Each field requires a name and expected value.
      </p>

      {fields.map((field, index) => (
        <Card key={field.id} className="mb-4">
          <CardBody>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-medium">Field {index + 1}</h3>
              {fields.length > 1 && (
                <Button isIconOnly color="danger" variant="light" onClick={() => removeField(field.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Divider className="my-2" />
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

      <Button variant="flat" startContent={<Plus className="h-4 w-4" />} onClick={addField} className="mb-4">
        Add Another Field
      </Button>

      <div className="flex justify-between mt-4">
        <Button variant="flat" startContent={<ArrowLeft className="h-4 w-4" />} onClick={onBack}>
          Back
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </div>
  )
}
