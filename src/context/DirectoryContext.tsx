'use client'

import { FileTree } from "@/lib/types";
import { createContext } from "react";

type DirectoryContextType = {
    filePath: string
    setFilePath: React.Dispatch<React.SetStateAction<string>>
    files: FileTree
    setFiles: React.Dispatch<
        React.SetStateAction<FileTree>
    >
}
const DirectoryContext = createContext<DirectoryContextType>({
    filePath: '',
    setFilePath: () => { },
    files: {},
    setFiles: () => { }
})

export default DirectoryContext