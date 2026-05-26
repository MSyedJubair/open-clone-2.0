'use client'

import React, { useState } from 'react'
import DirectoryContext from './DirectoryContext'
import { FileSystemTree } from '@/lib/types'

const DirectoryContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [filePath, setFilePath] = useState('')
    const [files, setFiles] = useState<FileSystemTree>({})

    return (
        <DirectoryContext.Provider value={{
            filePath,
            setFilePath,
            files,
            setFiles
        }}>
            {children}
        </DirectoryContext.Provider>
    )
}

export default DirectoryContextProvider