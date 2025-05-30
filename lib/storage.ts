import type { DocumentTemplate, DocumentCategory } from "./types"

// Default categories
export const defaultCategories: DocumentCategory[] = [
  {
    id: "invoice",
    name: "Facturas",
    description: "Facturas comerciales y recibos",
    icon: "Receipt",
  },
  {
    id: "contract",
    name: "Contratos",
    description: "Contratos legales y acuerdos",
    icon: "FileText",
  },
  {
    id: "identity",
    name: "Documentos de Identidad",
    description: "Cédulas, pasaportes, licencias",
    icon: "CreditCard",
  },
  {
    id: "medical",
    name: "Documentos Médicos",
    description: "Historias clínicas, recetas, resultados",
    icon: "Heart",
  },
  {
    id: "financial",
    name: "Documentos Financieros",
    description: "Estados de cuenta, reportes financieros",
    icon: "DollarSign",
  },
  {
    id: "other",
    name: "Otros",
    description: "Otros tipos de documentos",
    icon: "File",
  },
]

// Storage keys
const TEMPLATES_KEY = "document_templates"
const CATEGORIES_KEY = "document_categories"

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

export const getTemplatesByCategory = (categoryId: string): DocumentTemplate[] => {
  return getTemplates().filter((template) => template.category === categoryId)
}

export const deleteTemplate = (templateId: string): void => {
  const templates = getTemplates().filter((template) => template.id !== templateId)
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
}

// Category management
export const getCategories = (): DocumentCategory[] => {
  if (typeof window === "undefined") return defaultCategories

  try {
    const stored = localStorage.getItem(CATEGORIES_KEY)
    return stored ? JSON.parse(stored) : defaultCategories
  } catch {
    return defaultCategories
  }
}

export const saveCategories = (categories: DocumentCategory[]): void => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
}
