import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary with your secure environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert the file stream into a Node.js Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert buffer to a base64 Data URI string that Cloudinary accepts
    const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`

    // Upload to Cloudinary (optional: specify a folder)
    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: "user_profiles",
    })

    // Return the secure cloud URL to your frontend page
    return NextResponse.json({ url: uploadResponse.secure_url })
  } catch (error) {
    console.error("Cloudinary Upload Error:", error)
    return NextResponse.json(
      { error: error || "Failed to upload image to cloud storage" }, 
      { status: 500 }
    )
  }
}