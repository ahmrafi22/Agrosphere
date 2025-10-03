import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadPicture = async (file, folder = "agrosphere/default") => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: "auto",
      transformation: [
        { width: 800, height: 600, crop: "fill" },
        { quality: "auto", fetch_format: "auto" },
      ],
    })

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

export const deletePicture = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return {
      success: true,
      result,
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

export default cloudinary
