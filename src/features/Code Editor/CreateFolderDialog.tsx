'use client'

import { useContext, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import NewFolderButton from './NewFolderButton'
import DirectoryContext from '@/context/DirectoryContext'

const CreateFolderDialog = () => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')

    const context = useContext(DirectoryContext)

    const getParentDirectoryPath = () => {
        if (!context.filePath) {
            return ''
        }

        const pathParts = context.filePath.split('/').filter(Boolean)
        if (pathParts.length <= 1) {
            return ''
        }

        return pathParts.slice(0, -1).join('/')
    }
    const handleCreateFolder = (name: string) => {
        const normalizedName = name.trim().replace(/^\/+|\/+$/g, '')
        const safeName = normalizedName.includes('/') ? normalizedName.split('/').pop() ?? normalizedName : normalizedName
        const parentPath = getParentDirectoryPath()
        const nextFolderPath = parentPath ? `${parentPath}/${safeName}` : safeName

        if (!safeName || Object.prototype.hasOwnProperty.call(context.files, nextFolderPath)) {
            return
        }

        context.setFiles((prevFiles) => ({
            ...prevFiles,
            [`${nextFolderPath}/initialFile.ts`]: '',
        }))
        // setExpandedFolders((prevFolders) => (prevFolders.includes(nextFolderPath) ? prevFolders : [...prevFolders, nextFolderPath]))
    }

    const parentPath = getParentDirectoryPath()

    const handleSubmit = () => {
        const trimmedName = name.trim()

        if (!trimmedName) {
            return
        }

        handleCreateFolder(trimmedName)
        setName('')
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <NewFolderButton onCreateFolder={() => setOpen(true)} />
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>New folder</DialogTitle>
                    <DialogDescription>
                        Create a new folder inside {parentPath || 'the workspace root'}.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="new-folder-name">Folder name</Label>
                        <Input
                            id="new-folder-name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="components"
                            autoFocus
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault()
                                    handleSubmit()
                                }
                            }}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={!name.trim()}>
                        Create folder
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateFolderDialog
