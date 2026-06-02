'use client'

import { ProjectStatus } from "@/app/generated/prisma/enums";
import { createContext } from "react";

type ProjectContextType = {
    status: string
    setStatus: React.Dispatch<React.SetStateAction<ProjectStatus>>

}
const ProjectContext = createContext<ProjectContextType>({
    status: '',
    setStatus: () => { }
})

export default ProjectContext