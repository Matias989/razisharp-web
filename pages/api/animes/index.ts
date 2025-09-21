import { NextApiRequest, NextApiResponse } from 'next'
import { getCollection } from '../../../lib/mongodb'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { Anime } from '../../../types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const animes = await getCollection('animes')

  try {
    switch (req.method) {
      case 'GET':
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 12
        const skip = (page - 1) * limit

        const animeList = await animes
          .find({})
          .sort({ votes: -1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray()

        const total = await animes.countDocuments({})
        const hasMore = skip + animeList.length < total

        res.status(200).json({
          animes: animeList,
          pagination: {
            page,
            limit,
            total,
            hasMore,
            totalPages: Math.ceil(total / limit)
          }
        })
        break

      case 'POST':
        // Verificar autenticación
        const token = req.headers.authorization?.replace('Bearer ', '')
        if (!token) {
          return res.status(401).json({ message: 'No se proporcionó token de autenticación' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
        const users = await getCollection('users')
        const user = await users.findOne({ _id: new ObjectId(decoded.userId) })

        if (!user || !user.isAdmin) {
          return res.status(403).json({ message: 'Se requiere acceso de administrador' })
        }

        const { title, description, imageUrl, totalEpisodes, genres } = req.body

        if (!title || !description) {
          return res.status(400).json({ message: 'Se requieren título y descripción' })
        }

        const newAnime: Omit<Anime, '_id'> = {
          title,
          description,
          imageUrl: imageUrl || '',
          currentEpisode: 0,
          totalEpisodes: totalEpisodes || null,
          status: 'planning',
          votes: 0,
          addedBy: user._id.toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
          genres: genres || [],
          rating: 0
        }

        const result = await animes.insertOne(newAnime)
        res.status(201).json({ ...newAnime, _id: result.insertedId })
        break

      default:
        res.status(405).json({ message: 'Método no permitido' })
    }
  } catch (error) {
    console.error('Anime API error:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
