'use client'

import { createContext } from "react";

type WebContainerContextType = {
    tab: string
    setTab: React.Dispatch<React.SetStateAction<string>>

}
const WebContainerContext = createContext<WebContainerContextType>({
    tab: '',
    setTab: () => {}
})

export default WebContainerContext