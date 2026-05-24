'use client'

import React, { useState } from 'react'
import DirectoryContext from './DirectoryContext'

const DirectoryContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [filePath, setFilePath] = useState('')
    const [fileCode, setFileCode] = useState('')

    return (
        <DirectoryContext.Provider value={{
            filePath,
            setFilePath,
            fileCode,
            setFileCode
        }}>
            {children}
        </DirectoryContext.Provider>
    )
}

export default DirectoryContextProvider