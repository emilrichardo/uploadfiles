"use client"

import { useState } from "react"
import { Card, CardBody, CardHeader } from "@nextui-org/card"
import { Progress } from "@nextui-org/progress"
import DocumentUploader from "@/components/document-uploader"
import FieldDefinitionForm from "@/components/field-definition-form"
import ReviewAndSubmit from "@/components/review-and-submit"
import type { DocumentData } from "@/lib/types"

export default function Home() {
  const [step, setStep] = useState(1)
  const [documentData, setDocumentData] = useState<DocumentData>({
    file: null,
    fileName: "",
    fileType: "",
    fields: [],
    apiEndpoint: "https://n8n-api-endpoint.example/webhook",
  })

  const handleDocumentUpload = (file: File) => {
    setDocumentData({
      ...documentData,
      file,
      fileName: file.name,
      fileType: file.type,
    })
    setStep(2)
  }

  const handleFieldsUpdate = (fields: any[]) => {
    setDocumentData({
      ...documentData,
      fields,
    })
    setStep(3)
  }

  const handleApiEndpointUpdate = (endpoint: string) => {
    setDocumentData({
      ...documentData,
      apiEndpoint: endpoint,
    })
  }

  const handleReset = () => {
    setDocumentData({
      file: null,
      fileName: "",
      fileType: "",
      fields: [],
      apiEndpoint: "https://n8n-api-endpoint.example/webhook",
    })
    setStep(1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-center">Document Reader</h1>
          <Progress aria-label="Progress" value={(step / 3) * 100} className="max-w-md mx-auto" color="primary" />
          <div className="flex justify-between w-full max-w-md mx-auto text-sm">
            <span className={step >= 1 ? "text-primary" : ""}>Upload</span>
            <span className={step >= 2 ? "text-primary" : ""}>Define Fields</span>
            <span className={step >= 3 ? "text-primary" : ""}>Review & Submit</span>
          </div>
        </CardHeader>
        <CardBody>
          {step === 1 && <DocumentUploader onUpload={handleDocumentUpload} />}
          {step === 2 && <FieldDefinitionForm onSubmit={handleFieldsUpdate} onBack={() => setStep(1)} />}
          {step === 3 && (
            <ReviewAndSubmit
              documentData={documentData}
              onBack={() => setStep(2)}
              onApiEndpointChange={handleApiEndpointUpdate}
              onReset={handleReset}
            />
          )}
        </CardBody>
      </Card>
    </div>
  )
}
