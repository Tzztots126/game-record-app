import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'games')

export interface UploadedFile {
  filepath: string
  filename: string
  mimetype: string
  size: number
}

export async function ensureUploadDir(): Promise<void> {
  try {
    await fs.access(UPLOAD_DIR)
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export function getGameDir(gameId: string): string {
  return path.join(UPLOAD_DIR, gameId)
}

export async function ensureGameDir(gameId: string): Promise<void> {
  const gameDir = getGameDir(gameId)
  try {
    await fs.access(gameDir)
  } catch {
    await fs.mkdir(gameDir, { recursive: true })
  }
}

export async function processImage(
  buffer: Buffer,
  filename: string,
  gameId: string,
  options: { width?: number; height?: number; quality?: number } = {}
): Promise<string> {
  await ensureGameDir(gameId)

  const { width = 800, quality = 80 } = options
  const ext = path.extname(filename).toLowerCase()
  const name = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  const outputFilename = `${name}.webp`
  const outputPath = path.join(getGameDir(gameId), outputFilename)

  await sharp(buffer)
    .resize(width, undefined, { withoutEnlargement: true })
    .webp({ quality })
    .toFile(outputPath)

  return `/uploads/games/${gameId}/${outputFilename}`
}

export async function saveCoverImage(
  buffer: Buffer,
  filename: string,
  gameId: string
): Promise<string> {
  return processImage(buffer, filename, gameId, { width: 600, quality: 85 })
}

export async function saveScreenshot(
  buffer: Buffer,
  filename: string,
  gameId: string
): Promise<string> {
  return processImage(buffer, filename, gameId, { width: 1200, quality: 80 })
}

export async function deleteGameImages(gameId: string): Promise<void> {
  const gameDir = getGameDir(gameId)
  try {
    const files = await fs.readdir(gameDir)
    await Promise.all(files.map(file => fs.unlink(path.join(gameDir, file))))
    await fs.rmdir(gameDir)
  } catch {
    // Directory might not exist
  }
}

export function parseTags(tagsString: string): string[] {
  if (!tagsString) return []
  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
}

export function stringifyTags(tags: string[]): string {
  return JSON.stringify(tags)
}
