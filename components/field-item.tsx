"use client"

import { Input } from "@nextui-org/input"
import type { Field } from "@/lib/types"

interface FieldItemProps {
  field: Field
  onChange: (field: Partial<Field>) => void
  errors: {
    name?: string
  }
}

const dataTypes = [
  { value: "text", label: "Texto" },
  { value: "number", label: "Número" },
  { value: "date", label: "Fecha" },
  { value: "boolean", label: "Sí/No" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Teléfono" },
  { value: "address", label: "Dirección" },
]

export default function FieldItem({ field, onChange, errors }: FieldItemProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        label="Nombre del Campo"
        placeholder="ej: Número de Factura"
        value={field.name}
        onChange={(e) => onChange({ name: e.target.value })}
        isRequired
        isInvalid={!!errors.name}
        errorMessage={errors.name}
        size="lg"
        classNames={{
          input: "text-base",
          label: "text-base font-medium text-gray-700",
          inputWrapper: "input-enhanced h-14",
        }}
      />

      <div className="flex flex-col gap-3">
        <label className="text-base font-medium text-gray-700">Tipo de Dato</label>
        <select
          value={field.dataType}
          onChange={(e) => onChange({ dataType: e.target.value })}
          className="w-full px-4 py-4 border-2 border-green-200 rounded-xl bg-white/80 text-base focus:outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 transition-all backdrop-blur-sm"
        >
          {dataTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Formatos Posibles"
        placeholder="ej: DD/MM/YYYY, MM-DD-YYYY"
        value={field.possibleFormats}
        onChange={(e) => onChange({ possibleFormats: e.target.value })}
        description="Lista separada por comas de formatos válidos"
        size="lg"
        classNames={{
          input: "text-base",
          label: "text-base font-medium text-gray-700",
          inputWrapper: "input-enhanced h-14",
          description: "text-gray-500 font-light",
        }}
      />

      <div className="flex flex-col gap-3">
        <label className="text-base font-medium text-gray-700">Descripción</label>
        <textarea
          placeholder="Descripción breve de este campo y cómo identificarlo"
          value={field.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="w-full px-4 py-4 border-2 border-green-200 rounded-xl bg-white/80 text-base focus:outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 transition-all backdrop-blur-sm resize-none"
          rows={4}
        />
      </div>
    </div>
  )
}
