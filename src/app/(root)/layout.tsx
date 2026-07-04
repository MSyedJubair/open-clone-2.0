import { Sidebar } from '@/features/SideBar/SideBar';
import React from 'react'

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="flex h-screen w-full">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}

export default RootLayout