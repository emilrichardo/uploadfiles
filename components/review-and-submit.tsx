"use client"

import { useState } from "react"
import { Button } from "@nextui-org/button"
import { Card, CardBody, CardHeader } from "@nextui-org/card"
import { Input } from "@nextui-org/input"
import { Divider } from "@nextui-org/divider"
import { Chip } from "@nextui-org/chip"
import { ArrowLeft, Send, Check, AlertCircle, File, ChevronDown, ChevronUp } from "lucide-react"
import type { DocumentData } from "@/lib/types"

interface ReviewAndSubmitProps {
  documentData: DocumentData
  onBack: () => void
  onApiEndpointChange: (endpoint: string) => void
  onReset: () => void
}

export default function ReviewAndSubmit({ documentData, onBack, onApiEndpointChange, onReset }: ReviewAndSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({})

  const toggleField = (fieldId: string) => {
    setExpandedFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError("")

    try {
      // Create form data to send file and fields
      const formData = new FormData()
      if (documentData.file) {
        formData.append("file", documentData.file)
      }

      // Add fields as JSON
      formData.append("fields", JSON.stringify(documentData.fields))

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you would make an actual API call:
      // const response = await fetch(documentData.apiEndpoint, {
      //   method: "POST",
      //   body: formData,
      // });
      //
      // if (!response.ok) {
      //   throw new Error(`Error: ${response.status}`);
      // }

      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="rounded-full bg-green-100 p-3 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Submission Successful!</h2>
        <p className="text-gray-600 text-center mb-6">
          Your document and field definitions have been successfully sent to the API.
        </p>
        <Button color="primary" onClick={onReset}>
          Process Another Document
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Review and Submit</h2>

      <Card className="mb-4">
        <CardBody>
          <h3 className="text-md font-medium mb-2">Document</h3>
          <Divider className="my-2" />
          <div className="flex items-center gap-2 mb-4">
            <File className="h-5 w-5 text-primary" />
            <span>{documentData.fileName}</span>
            <Chip size="sm" variant="flat">
              {documentData.fileType}
            </Chip>
          </div>
        </CardBody>
      </Card>

      <Card className="mb-4">
        <CardBody>
          <h3 className="text-md font-medium mb-2">Fields to Extract ({documentData.fields.length})</h3>
          <Divider className="my-2" />

          <div className="space-y-3">
            {documentData.fields.map((field, index) => (
              <Card key={field.id} className="bg-gray-50">
                <CardHeader
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleField(field.id)}
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        Field {index + 1}: {field.name}
                      </span>
                      <Chip size="sm" variant="flat" color="primary">
                        {field.dataType}
                      </Chip>
                    </div>
                    {expandedFields[field.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardHeader>

                {expandedFields[field.id] && (
                  <CardBody className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Expected Value:</p>
                        <p className="text-sm">{field.expectedValue}</p>
                      </div>

                      {field.possibleFormats && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Possible Formats:</p>
                          <p className="text-sm">{field.possibleFormats}</p>
                        </div>
                      )}

                      {field.description && (
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium text-gray-600">Description:</p>
                          <p className="text-sm">{field.description}</p>
                        </div>
                      )}
                    </div>
                  </CardBody>
                )}
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="mb-4">
        <CardBody>
          <h3 className="text-md font-medium mb-2">API Configuration</h3>
          <Divider className="my-2" />
          <Input
            label="API Endpoint"
            placeholder="https://n8n-api-endpoint.example/webhook"
            value={documentData.apiEndpoint}
            onChange={(e) => onApiEndpointChange(e.target.value)}
            className="mb-2"
          />
          <p className="text-xs text-gray-500">
            Enter the n8n webhook URL where the document and field data will be sent
          </p>
        </CardBody>
      </Card>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-between mt-4">
        <Button variant="flat" startContent={<ArrowLeft className="h-4 w-4" />} onClick={onBack}>
          Back
        </Button>
        <Button
          color="primary"
          startContent={<Send className="h-4 w-4" />}
          onClick={handleSubmit}
          isLoading={isSubmitting}
        >
          Submit to API
        </Button>
      </div>
    </div>
  )
}
