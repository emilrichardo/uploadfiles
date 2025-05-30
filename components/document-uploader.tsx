"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@nextui-org/button"
import { Card, CardBody } from "@nextui-org/card"
import { Chip } from "@nextui-org/chip"
import { FileUp, File, X } from "lucide-react"

interface DocumentUploaderProps {
  onUpload: (file: File) => void
}

export default function DocumentUploader({ onUpload }: DocumentUploaderProps) {
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
      setError("Please upload a PDF or image file (JPEG, PNG)")
      return false
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size should be less than 10MB")
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
    if (selectedFile) {
      onUpload(selectedFile)
    } else {
      setError("Please select a file to upload")
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 cursor-pointer ${
          dragActive ? "border-blue-400 bg-blue-900/20" : "border-gray-600 hover:border-gray-500"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" className="hidden" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png" />
        <FileUp className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Drag and drop your document here, or click to select</p>
        <p className="text-xs text-gray-500 mt-1">Supports PDF, JPEG, and PNG (max 10MB)</p>
      </div>

      {error && (
        <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded border border-red-800">{error}</div>
      )}

      {selectedFile && (
        <Card className="bg-gray-50">
          <CardBody className="flex flex-row items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <File className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <Chip size="sm" variant="flat">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Chip>
            </div>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={(e) => {
                e.stopPropagation()
                removeFile()
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardBody>
        </Card>
      )}

      <Button color="primary" className="mt-4" onClick={handleSubmit} isDisabled={!selectedFile}>
        Continue
      </Button>
    </div>
  )
}
