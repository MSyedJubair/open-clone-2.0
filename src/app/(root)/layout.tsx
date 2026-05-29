import { Sidebar } from '@/components/Shared/SideBar';
import React from 'react'

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className='flex flex-row w-full'>
            <Sidebar />
            <main className='w-full'>
                {children}
            </main>
        </div>
    )
}

export default RootLayout