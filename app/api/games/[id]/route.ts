import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { saveCoverImage, saveScreenshot, parseTags, stringifyTags, deleteGameImages } from '@/lib/upload'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const game = await prisma.game.findUnique({
      where: { id },
    })

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...game,
      tags: JSON.parse(game.tags || '[]'),
      screenshots: JSON.parse(game.screenshots || '[]'),
    })
  } catch (error) {
    console.error('Error fetching game:', error)
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const formData = await request.formData()

    const name = formData.get('name') as string
    const comment = formData.get('comment') as string
    const tagsString = formData.get('tags') as string
    const status = formData.get('status') as string
    const rating = formData.get('rating') as string
    const playTime = formData.get('playTime') as string
    const existingScreenshotsJson = formData.get('existingScreenshots') as string

    const existingGame = await prisma.game.findUnique({
      where: { id },
    })

    if (!existingGame) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    let coverImagePath = existingGame.coverImage

    // Handle new cover image
    const coverFile = formData.get('coverImage') as File
    if (coverFile && coverFile.size > 0) {
      const coverBuffer = Buffer.from(await coverFile.arrayBuffer())
      coverImagePath = await saveCoverImage(coverBuffer, coverFile.name, id)
    }

    // Handle screenshots
    const screenshots: string[] = existingScreenshotsJson
      ? JSON.parse(existingScreenshotsJson)
      : JSON.parse(existingGame.screenshots || '[]')

    const newScreenshotFiles = formData.getAll('screenshots') as File[]
    for (const file of newScreenshotFiles) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const path = await saveScreenshot(buffer, file.name, id)
        screenshots.push(path)
      }
    }

    const tags = parseTags(tagsString)

    const game = await prisma.game.update({
      where: { id },
      data: {
        name: name || existingGame.name,
        coverImage: coverImagePath,
        tags: stringifyTags(tags),
        comment: comment !== undefined ? comment : existingGame.comment,
        screenshots: stringifyTags(screenshots),
        status: status || existingGame.status,
        rating: rating !== undefined ? (rating ? parseInt(rating) : null) : existingGame.rating,
        playTime: playTime !== undefined ? (playTime ? parseFloat(playTime) : null) : existingGame.playTime,
      },
    })

    return NextResponse.json({
      ...game,
      tags,
      screenshots,
    })
  } catch (error) {
    console.error('Error updating game:', error)
    return NextResponse.json({ error: 'Failed to update game' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const game = await prisma.game.findUnique({
      where: { id },
    })

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    // Delete associated images
    await deleteGameImages(id)

    await prisma.game.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Game deleted successfully' })
  } catch (error) {
    console.error('Error deleting game:', error)
    return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 })
  }
}
