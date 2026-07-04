'use client'

import React, { useMemo, useState } from 'react'
import DirectoryContext from './DirectoryContext'
import { FileTree } from '@/lib/types'

const DirectoryContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [filePath, setFilePath] = useState('')
    const [files, setFiles] = useState<FileTree>({})

    const value = useMemo(() => ({
        filePath,
        setFilePath,
        files,
        setFiles
    }), [filePath, files])

    return (
        <DirectoryContext.Provider value={value}>
            {children}
        </DirectoryContext.Provider>
    )
}

export default DirectoryContextProvider