import type { FieldTemplate, Project, ProcessedDocument } from "./types"

// Storage keys
const TEMPLATES_KEY = "field_templates"
const PROJECTS_KEY = "document_projects"
const DOCUMENTS_KEY = "processed_documents"

// Template management (now per project)
export const saveFieldTemplate = (template: Omit<FieldTemplate, "id" | "createdAt">): FieldTemplate => {
  const templates = getFieldTemplates()
  const newTemplate: FieldTemplate = {
    ...template,
    id: `template_${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  templates.push(newTemplate)
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
  return newTemplate
}

export const getFieldTemplates = (projectId?: string): FieldTemplate[] => {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(TEMPLATES_KEY)
    const templates = stored ? JSON.parse(stored) : []
    return projectId ? templates.filter((t: FieldTemplate) => t.projectId === projectId) : templates
  } catch {
    return []
  }
}

export const deleteFieldTemplate = (templateId: string): void => {
  const templates = getFieldTemplates().filter((template) => template.id !== templateId)
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
}

// Project management
export const saveProject = (project: Omit<Project, "id" | "createdAt" | "documentsCount">): Project => {
  const projects = getProjects()
  const newProject: Project = {
    ...project,
    id: `project_${Date.now()}`,
    createdAt: new Date().toISOString(),
    documentsCount: 0,
  }

  projects.push(newProject)
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
  return newProject
}

export const getProjects = (): Project[] => {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(PROJECTS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const getProjectById = (projectId: string): Project | null => {
  const projects = getProjects()
  return projects.find((p) => p.id === projectId) || null
}

export const updateProjectDocumentCount = (projectId: string): void => {
  const projects = getProjects()
  const documents = getProcessedDocuments()
  const projectDocuments = documents.filter((doc) => doc.projectId === projectId)

  const updatedProjects = projects.map((project) =>
    project.id === projectId ? { ...project, documentsCount: projectDocuments.length } : project,
  )

  localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects))
}

export const deleteProject = (projectId: string): void => {
  const projects = getProjects().filter((project) => project.id !== projectId)
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))

  // Also delete all documents and templates in this project
  const documents = getProcessedDocuments().filter((doc) => doc.projectId !== projectId)
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents))

  const templates = getFieldTemplates().filter((template) => template.projectId !== projectId)
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
}

// Document management
export const saveProcessedDocument = (document: Omit<ProcessedDocument, "id" | "processedAt">): ProcessedDocument => {
  const documents = getProcessedDocuments()
  const newDocument: ProcessedDocument = {
    ...document,
    id: `doc_${Date.now()}`,
    processedAt: new Date().toISOString(),
  }

  documents.push(newDocument)
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents))

  // Update project document count
  updateProjectDocumentCount(document.projectId)

  return newDocument
}

export const getProcessedDocuments = (): ProcessedDocument[] => {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(DOCUMENTS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const getDocumentsByProject = (projectId: string): ProcessedDocument[] => {
  return getProcessedDocuments().filter((doc) => doc.projectId === projectId)
}

// Utility function to generate downloadable file
export const generateExtractedDataFile = (document: ProcessedDocument): void => {
  // Check if we're in the browser environment
  if (typeof window === "undefined" || typeof document === "undefined") {
    console.warn("generateExtractedDataFile can only be called in the browser")
    return
  }

  const data = {
    fileName: document.fileName,
    fileType: document.fileType,
    processedAt: document.processedAt,
    extractedFields: document.extractedData,
    fieldDefinitions: document.fields.map((field) => ({
      name: field.name,
      dataType: field.dataType,
      possibleFormats: field.possibleFormats,
      description: field.description,
    })),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${document.fileName.split(".")[0]}_extracted_data.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Initialize default project if none exists
export const initializeDefaultProject = (): Project => {
  const projects = getProjects()
  if (projects.length === 0) {
    return saveProject({
      name: "Mi Primer Proyecto",
      description: "Proyecto por defecto para comenzar",
    })
  }
  return projects[0]
}
