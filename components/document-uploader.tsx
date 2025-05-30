"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@nextui-org/button"
import { Card, CardBody } from "@nextui-org/card"
import { Chip } from "@nextui-org/chip"
import { ArrowLeft, FileUp, File, X, Upload } from "lucide-react"

interface DocumentUploaderProps {
  onUpload: (file: File, category: string) => void
  onBack: () => void
}

export default function DocumentUploader({ onUpload, onBack }: DocumentUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File) => {
    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    if (!validTypes.includes(file.type)) {
      setError("Por favor sube un archivo PDF o imagen (JPEG, PNG)")
      return false
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("El archivo debe ser menor a 10MB")
      return false
    }
    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError("")

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setError("")

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
      }
    }
  }

  const handleSubmit = () => {
    if (!selectedFile) {
      setError("Por favor selecciona un archivo para subir")
      return
    }
    onUpload(selectedFile, "")
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (inputRef.current) {
      inputRef.current.value = ""
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
        <h2 className="text-2xl font-semibold text-gray-800">Subir Documento</h2>
      </div>

      {/* File Upload */}
      <div
        className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
          dragActive
            ? "border-yellow-400 bg-yellow-50 scale-[1.02]"
            : "border-gray-300 hover:border-yellow-300 hover:bg-yellow-50/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" className="hidden" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png" />
        <div className="space-y-6">
          <div className="rounded-2xl gradient-yellow-light p-6 w-fit mx-auto shadow-lg">
            <FileUp className="h-12 w-12 text-yellow-600 mx-auto" />
          </div>
          <div className="space-y-3">
            <p className="text-lg font-medium text-gray-700">
              Arrastra y suelta tu documento aquí, o haz click para seleccionar
            </p>
            <p className="text-gray-500 font-light">Soporta archivos PDF, JPEG y PNG (máximo 10MB)</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center font-medium">
          {error}
        </div>
      )}

      {selectedFile && (
        <Card className="card-elevated bg-white/90 backdrop-blur-sm">
          <CardBody className="flex flex-row items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl gradient-yellow-light p-3">
                <File className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="space-y-1">
                <span className="text-base font-medium text-gray-800">{selectedFile.name}</span>
                <div className="flex items-center gap-3">
                  <Chip size="md" variant="flat" className="bg-yellow-100 text-yellow-700">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Chip>
                  <span className="text-sm text-gray-500">{selectedFile.type}</span>
                </div>
              </div>
            </div>
            <Button
              isIconOnly
              size="lg"
              variant="light"
              className="hover:bg-red-50 text-red-500"
              onClick={(e) => {
                e.stopPropagation()
                removeFile()
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </CardBody>
        </Card>
      )}

      <Button
        color="success"
        size="lg"
        className="btn-primary-gradient text-lg font-medium py-6"
        onClick={handleSubmit}
        isDisabled={!selectedFile}
        startContent={<Upload className="h-5 w-5" />}
      >
        Continuar con la Configuración
      </Button>
    </div>
  )
}
