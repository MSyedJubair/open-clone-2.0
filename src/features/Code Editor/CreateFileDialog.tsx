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
import NewFileButton from './NewFileButton'
import DirectoryContext from '@/context/DirectoryContext'

const CreateFileDialog = () => {
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
    const handleCreateFile = (name: string) => {
        const normalizedName = name.trim().replace(/^\/+|\/+$/g, '')
        const safeName = normalizedName.includes('/') ? normalizedName.split('/').pop() ?? normalizedName : normalizedName
        const parentPath = getParentDirectoryPath()
        const nextFilePath = parentPath ? `${parentPath}/${safeName}` : safeName

        if (!safeName || Object.prototype.hasOwnProperty.call(context.files, nextFilePath)) {
            return
        }

        context.setFiles((prevFiles) => ({
            ...prevFiles,
            [nextFilePath]: '',
        }))
        context.setFilePath(nextFilePath)
    }

    const parentPath = getParentDirectoryPath()

    const handleSubmit = () => {
        const trimmedName = name.trim()

        if (!trimmedName) {
            return
        }

        handleCreateFile(trimmedName)
        setName('')
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <NewFileButton onCreateFile={() => setOpen(true)} />
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>New file</DialogTitle>
                    <DialogDescription>
                        Create a new file inside {parentPath || 'the workspace root'}.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="new-file-name">File name</Label>
                        <Input
                            id="new-file-name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="page.tsx"
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
                        Create file
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateFileDialog
