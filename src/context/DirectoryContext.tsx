'use client'

import { createContext } from "react";

type DirectoryContextType = {
    filePath: string
    setFilePath: React.Dispatch<React.SetStateAction<string>>
    fileCode: string
    setFileCode: React.Dispatch<React.SetStateAction<string>>
}
const DirectoryContext = createContext<DirectoryContextType>({
    filePath: '',
    setFilePath: () => {},
    fileCode: '',
    setFileCode: () => {}
})

export default DirectoryContext