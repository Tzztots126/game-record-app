import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { saveCoverImage, saveScreenshot, parseTags, stringifyTags } from '@/lib/upload'
import { v4 as uuidv4 } from 'uuid'

interface GameData {
  tags: string | null
  screenshots: string | null
  [key: string]: unknown
}

interface ParsedGame extends Record<string, unknown> {
  tags: string[]
  screenshots: string[]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const tag = searchParams.get('tag')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    const where: Record<string, string> = {}

    if (status && status !== 'all') {
      where.status = status
    }

    const games = await prisma.game.findMany({
      where,
      orderBy: {
        [sortBy]: order,
      },
    })

    // Parse JSON strings back to arrays
    const parsedGames: ParsedGame[] = games.map((game: GameData) => ({
      ...game,
      tags: JSON.parse(game.tags || '[]') as string[],
      screenshots: JSON.parse(game.screenshots || '[]') as string[],
    }))

    // Filter by tag if provided
    let filteredGames: ParsedGame[] = parsedGames
    if (tag) {
      filteredGames = parsedGames.filter((game: ParsedGame) =>
        game.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase())
      )
    }

    return NextResponse.json(filteredGames)
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const name = formData.get('name') as string
    const comment = formData.get('comment') as string
    const tagsString = formData.get('tags') as string
    const status = formData.get('status') as string
    const rating = formData.get('rating') as string
    const playTime = formData.get('playTime') as string

    if (!name) {
      return NextResponse.json({ error: 'Game name is required' }, { status: 400 })
    }

    const gameId = uuidv4()

    // Handle cover image
    const coverFile = formData.get('coverImage') as File
    let coverImagePath = '/uploads/default-cover.svg'

    if (coverFile && coverFile.size > 0) {
      const coverBuffer = Buffer.from(await coverFile.arrayBuffer())
      coverImagePath = await saveCoverImage(coverBuffer, coverFile.name, gameId)
    }

    // Handle screenshots
    const screenshots: string[] = []
    const screenshotFiles = formData.getAll('screenshots') as File[]

    for (const file of screenshotFiles) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const screenshotPath = await saveScreenshot(buffer, file.name, gameId)
        screenshots.push(screenshotPath)
      }
    }

    const tags = parseTags(tagsString)

    const game = await prisma.game.create({
      data: {
        id: gameId,
        name,
        coverImage: coverImagePath,
        tags: stringifyTags(tags),
        comment: comment || null,
        screenshots: stringifyTags(screenshots),
        status: status || 'playing',
        rating: rating ? parseInt(rating) : null,
        playTime: playTime ? parseFloat(playTime) : null,
      },
    })

    return NextResponse.json({
      ...game,
      tags,
      screenshots,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 })
  }
}
