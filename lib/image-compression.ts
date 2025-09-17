// Image compression utilities for Loyola School Memories App
// Compresses images to optimize storage while maintaining quality

export interface CompressionOptions {
  maxSizeMB: number
  maxWidthOrHeight: number
  useWebWorker?: boolean
  quality?: number
}

export interface CompressionResult {
  file: File
  originalSize: number
  compressedSize: number
  compressionRatio: number
}

// Default compression settings for school photos
export const DEFAULT_COMPRESSION_OPTIONS: CompressionOptions = {
  maxSizeMB: 1, // Maximum 1MB as requested
  maxWidthOrHeight: 1920, // Max dimension for high quality
  useWebWorker: false,
  quality: 0.8, // 80% quality for good balance
}

/**
 * Compresses an image file to meet size requirements
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = DEFAULT_COMPRESSION_OPTIONS,
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        const { width, height } = calculateDimensions(img.width, img.height, options.maxWidthOrHeight)

        canvas.width = width
        canvas.height = height

        // Draw and compress the image
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)

          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                })

                const originalSize = file.size
                const compressedSize = compressedFile.size
                const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100

                resolve({
                  file: compressedFile,
                  originalSize,
                  compressedSize,
                  compressionRatio,
                })
              } else {
                reject(new Error("Failed to compress image"))
              }
            },
            file.type,
            options.quality,
          )
        }
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Calculate optimal dimensions while maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxDimension: number,
): { width: number; height: number } {
  if (originalWidth <= maxDimension && originalHeight <= maxDimension) {
    return { width: originalWidth, height: originalHeight }
  }

  const aspectRatio = originalWidth / originalHeight

  if (originalWidth > originalHeight) {
    return {
      width: maxDimension,
      height: Math.round(maxDimension / aspectRatio),
    }
  } else {
    return {
      width: Math.round(maxDimension * aspectRatio),
      height: maxDimension,
    }
  }
}

/**
 * Batch compress multiple images with progress tracking
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = DEFAULT_COMPRESSION_OPTIONS,
  onProgress?: (progress: number, currentFile: string) => void,
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    onProgress?.(((i + 1) / files.length) * 100, file.name)

    try {
      const result = await compressImage(file, options)
      results.push(result)
    } catch (error) {
      console.error(`Failed to compress ${file.name}:`, error)
      // Return original file if compression fails
      results.push({
        file,
        originalSize: file.size,
        compressedSize: file.size,
        compressionRatio: 0,
      })
    }
  }

  return results
}

/**
 * Check if file needs compression based on size
 */
export function needsCompression(file: File, maxSizeMB = 1): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size > maxSizeBytes
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * Validate image file type
 */
export function isValidImageType(file: File): boolean {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
  return validTypes.includes(file.type.toLowerCase())
}

/**
 * Generate thumbnail from image file
 */
export async function generateThumbnail(file: File, size = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = size
      canvas.height = size

      if (ctx) {
        // Calculate crop dimensions for square thumbnail
        const minDimension = Math.min(img.width, img.height)
        const x = (img.width - minDimension) / 2
        const y = (img.height - minDimension) / 2

        ctx.drawImage(img, x, y, minDimension, minDimension, 0, 0, size, size)
        resolve(canvas.toDataURL("image/jpeg", 0.8))
      } else {
        reject(new Error("Failed to create thumbnail"))
      }
    }

    img.onerror = () => reject(new Error("Failed to load image for thumbnail"))
    img.src = URL.createObjectURL(file)
  })
}
