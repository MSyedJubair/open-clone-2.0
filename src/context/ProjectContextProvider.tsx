'use client'

import { useState } from 'react'
import ProjectContext from './ProjectContext'
import { ProjectStatus } from '@/app/generated/prisma/enums'

const ProjectContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [status, setStatus] = useState<ProjectStatus>('DRAFT')
    return (
        <ProjectContext.Provider value={{
            status,
            setStatus
        }}>
            {children}
        </ProjectContext.Provider>
    )
}

export default ProjectContextProvider