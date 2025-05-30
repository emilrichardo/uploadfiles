"use client"

import { Input } from "@nextui-org/input"
import type { Field } from "@/lib/types"

interface FieldItemProps {
  field: Field
  onChange: (field: Partial<Field>) => void
  errors: {
    name?: string
    expectedValue?: string
  }
}

const dataTypes = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "boolean", label: "Boolean" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone Number" },
  { value: "address", label: "Address" },
]

export default function FieldItem({ field, onChange, errors }: FieldItemProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="Field Name"
        placeholder="e.g., Invoice Number"
        value={field.name}
        onChange={(e) => onChange({ name: e.target.value })}
        isRequired
        isInvalid={!!errors.name}
        errorMessage={errors.name}
      />

      <Input
        label="Expected Value"
        placeholder="e.g., INV-2023-001"
        value={field.expectedValue}
        onChange={(e) => onChange({ expectedValue: e.target.value })}
        isRequired
        isInvalid={!!errors.expectedValue}
        errorMessage={errors.expectedValue}
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Data Type</label>
        <select
          value={field.dataType}
          onChange={(e) => onChange({ dataType: e.target.value })}
          className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {dataTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Possible Formats"
        placeholder="e.g., DD/MM/YYYY, MM-DD-YYYY"
        value={field.possibleFormats}
        onChange={(e) => onChange({ possibleFormats: e.target.value })}
        description="Comma-separated list of formats"
      />

      <div className="md:col-span-2 flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Description</label>
        <textarea
          placeholder="Brief description of this field"
          value={field.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>
    </div>
  )
}
