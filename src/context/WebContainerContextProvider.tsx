'use client'

import { useState } from 'react'
import WebContainerContext from './WebContainerContext'

const WebContainerContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [tab, setTab] = useState('Desktop')
    return (
        <WebContainerContext.Provider value={{
            tab,
            setTab
        }}>
            {children}
        </WebContainerContext.Provider>
    )
}

export default WebContainerContextProvider