'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { authClient } from "@/lib/auth-client"

export default function SettingsPage() {
  const router = useRouter()
  const { data: session, isPending, refetch } = authClient.useSession()

  // Form states
  const [name, setName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Status states
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Sync session data to state when loaded
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setPreviewUrl(session.user.image || null)
    }
  }, [session])

  // Setup react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0]
      if (selectedFile) {
        setFile(selectedFile)
        setPreviewUrl(URL.createObjectURL(selectedFile))
      }
    }
  })

  // Handle Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      let finalImageUrl = previewUrl

      // If a new file was dropped, upload it to our API route handler first
      if (file) {
        const formData = new FormData()
        formData.append("file", file)

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData
        })

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json()
          throw new Error(errorData.error || "Failed to upload your avatar image.")
        }

        const uploadData = await uploadRes.json()
        finalImageUrl = uploadData.url // Your fresh, secure Cloudinary URL
      }

      // Update user account details with Better-Auth client
      const { error } = await authClient.updateUser({
        name: name,
        image: finalImageUrl || undefined,
      })

      if (error) {
        setMessage({ type: 'error', text: error.message || "Failed to update profile." })
      } else {
        setMessage({ type: 'success', text: "Profile updated successfully!" })
        setFile(null) // Reset pending file reference state
        refetch() // Refresh client auth session cache
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: String(err) || "An unexpected error occurred during processing."
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await authClient.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-app-bg) text-zinc-400">
        Loading accounts configuration...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-(--color-app-bg) text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-zinc-800 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Account Settings</h1>
            <p className="mt-1 text-sm text-zinc-400">Manage your profile details and preferences.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-(--color-status-live) animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Session Live
            </span>
          </div>
        </div>

        {/* Profile Update Card */}
        <div className="bg-(--color-app-surface) rounded-2xl p-6 sm:p-8 border border-zinc-800/80 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>

          <form onSubmit={handleUpdateProfile} className="space-y-6">

            {/* Avatar Dropzone Field */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">Profile Picture</label>
              <div className="flex flex-col sm:flex-row items-center gap-6">

                {/* Visual Circle Preview */}
                <div className="relative w-24 h-24 rounded-full bg-zinc-900 border-2 border-zinc-700 shrink-0 overflow-hidden flex items-center justify-center">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-zinc-500 uppercase">
                      {name ? name.slice(0, 2) : "??"}
                    </span>
                  )}
                </div>

                {/* React Dropzone Core Interface */}
                <div
                  {...getRootProps()}
                  className={`w-full border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 outline-none ${isDragActive
                      ? 'border-(--color-brand-pink) bg-zinc-800/30'
                      : 'border-zinc-700 hover:border-(--color-brand-indigo) bg-zinc-900/40'
                    }`}
                >
                  <input {...getInputProps()} />
                  <p className="text-sm text-zinc-300">
                    {isDragActive ? "Drop the file here!" : "Drag 'n' drop a new picture, or click to browse"}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">PNG, JPG or WEBP up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Name Input Field */}
            <div>
              <label htmlFor="name-input" className="block text-sm font-medium text-zinc-300 mb-2">
                Display Name
              </label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full bg-zinc-900/60 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-(--color-brand-purple) focus:border-transparent transition-all"
              />
            </div>

            {/* Submission / Actions Feedback */}
            {message && (
              <div className={`p-4 rounded-xl text-sm ${message.type === 'success'
                  ? 'bg-emerald-950/40 text-(--color-status-live) border border-emerald-800/50'
                  : 'bg-red-950/40 text-red-400 border border-red-900/50'
                }`}>
                {message.text}
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 font-semibold text-white rounded-xl transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-(--color-brand-pink) disabled:opacity-50 disabled:cursor-not-allowed bg-linear-to-r from-(--color-brand-indigo) via-(--color-brand-purple) to-(--color-brand-pink) hover:opacity-90"
              >
                {isSaving ? "Saving changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Danger Zone / Log Out Card */}
        <div className="bg-(--color-app-surface) rounded-2xl p-6 sm:p-8 border border-red-950/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Session Management</h2>
            <p className="mt-1 text-sm text-zinc-400">Sign out securely from your current device.</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full sm:w-auto px-5 py-2.5 font-medium text-red-400 border border-red-900/60 rounded-xl hover:bg-red-950/40 active:bg-red-950/70 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Log Out Account
          </button>
        </div>

      </div>
    </div>
  )
}