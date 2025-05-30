import type { DocumentTemplate } from "./types"

// Storage keys
const TEMPLATES_KEY = "document_templates"

// Template management
export const saveTemplate = (template: Omit<DocumentTemplate, "id" | "createdAt">): DocumentTemplate => {
  const templates = getTemplates()
  const newTemplate: DocumentTemplate = {
    ...template,
    id: `template_${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  templates.push(newTemplate)
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
  return newTemplate
}

export const getTemplates = (): DocumentTemplate[] => {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(TEMPLATES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const deleteTemplate = (templateId: string): void => {
  const templates = getTemplates().filter((template) => template.id !== templateId)
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
}
