'use client'

import { FileSystemTree } from "@/lib/types";
import { createContext } from "react";

type DirectoryContextType = {
    filePath: string
    setFilePath: React.Dispatch<React.SetStateAction<string>>
    files: FileSystemTree
    setFiles: React.Dispatch<
        React.SetStateAction<FileSystemTree>
    >
}
const DirectoryContext = createContext<DirectoryContextType>({
    filePath: '',
    setFilePath: () => { },
    files: {},
    setFiles: () => { }
})

export default DirectoryContext