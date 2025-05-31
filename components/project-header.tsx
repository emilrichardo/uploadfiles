"use client"

import { useState, useEffect } from "react"
import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown"
import { ChevronDown, FolderPlus, Folder } from "lucide-react"
import { getProjects, saveProject, getProjectById, initializeDefaultProject } from "@/lib/storage"
import type { Project } from "@/lib/types"

interface ProjectHeaderProps {
  selectedProjectId: string
  onProjectChange: (projectId: string) => void
}

export default function ProjectHeader({ selectedProjectId, onProjectChange }: ProjectHeaderProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")

  useEffect(() => {
    const allProjects = getProjects()
    if (allProjects.length === 0) {
      const defaultProject = initializeDefaultProject()
      setProjects([defaultProject])
      setSelectedProject(defaultProject)
      onProjectChange(defaultProject.id)
    } else {
      setProjects(allProjects)
      const current = getProjectById(selectedProjectId) || allProjects[0]
      setSelectedProject(current)
      if (current.id !== selectedProjectId) {
        onProjectChange(current.id)
      }
    }
  }, [selectedProjectId, onProjectChange])

  const handleProjectSelect = (projectId: string) => {
    const project = getProjectById(projectId)
    if (project) {
      setSelectedProject(project)
      onProjectChange(projectId)
    }
  }

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return

    const newProject = saveProject({
      name: newProjectName,
      description: newProjectDescription,
    })

    setProjects(getProjects())
    setSelectedProject(newProject)
    onProjectChange(newProject.id)
    setShowCreateModal(false)
    setNewProjectName("")
    setNewProjectDescription("")
  }

  return (
    <>
      <div className="flex items-center gap-4 p-6 bg-white/80 backdrop-blur-sm border-b border-green-100">
        <div className="flex items-center gap-3">
          <div className="rounded-lg gradient-green-light p-2">
            <Folder className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-sm font-medium text-gray-600">Proyecto:</span>
        </div>

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="bg-green-50 border border-green-200 hover:bg-green-100 min-w-64 justify-between"
              endContent={<ChevronDown className="h-4 w-4" />}
            >
              <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-800">{selectedProject?.name || "Seleccionar proyecto"}</span>
                {selectedProject?.description && (
                  <span className="text-xs text-gray-500 truncate max-w-48">{selectedProject.description}</span>
                )}
              </div>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Proyectos" className="min-w-64">
            {projects.map((project) => (
              <DropdownItem
                key={project.id}
                onClick={() => handleProjectSelect(project.id)}
                className={selectedProject?.id === project.id ? "bg-green-50" : ""}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{project.name}</span>
                  {project.description && <span className="text-xs text-gray-500">{project.description}</span>}
                  <span className="text-xs text-gray-400">{project.documentsCount} documentos</span>
                </div>
              </DropdownItem>
            ))}
            <DropdownItem
              key="create-new"
              onClick={() => setShowCreateModal(true)}
              className="border-t border-gray-200 mt-2 pt-2"
            >
              <div className="flex items-center gap-2 text-green-600">
                <FolderPlus className="h-4 w-4" />
                <span className="font-medium">Crear Nuevo Proyecto</span>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Create Project Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} size="lg">
        <ModalContent className="m-6">
          <ModalHeader className="p-6 pb-2">
            <h3 className="text-xl font-semibold text-gray-800">Crear Nuevo Proyecto</h3>
          </ModalHeader>
          <ModalBody className="p-6 space-y-6">
            <Input
              label="Nombre del Proyecto"
              placeholder="ej: Mis DNI, Facturas 2024, Contratos"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              isRequired
              size="lg"
              classNames={{
                input: "text-base",
                label: "text-base font-medium text-gray-700",
                inputWrapper: "input-enhanced h-14",
              }}
            />
            <Input
              label="Descripción (opcional)"
              placeholder="Describe qué tipo de documentos contendrá este proyecto"
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              size="lg"
              classNames={{
                input: "text-base",
                label: "text-base font-medium text-gray-700",
                inputWrapper: "input-enhanced h-14",
              }}
            />
          </ModalBody>
          <ModalFooter className="p-6 pt-2">
            <Button
              variant="flat"
              onClick={() => setShowCreateModal(false)}
              size="lg"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              onClick={handleCreateProject}
              isDisabled={!newProjectName.trim()}
              size="lg"
              className="btn-primary-gradient font-medium"
            >
              Crear Proyecto
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
