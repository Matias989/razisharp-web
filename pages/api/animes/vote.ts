import { NextApiRequest, NextApiResponse } from 'next'
import { getCollection } from '../../../lib/mongodb'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const { animeId } = req.body

    if (!animeId) {
      return res.status(400).json({ message: 'Se requiere ID del anime' })
    }

    const votes = await getCollection('votes')
    const animes = await getCollection('animes')

    // Verificar si el anime existe
    const anime = await animes.findOne({ _id: new ObjectId(animeId) })
    if (!anime) {
      return res.status(404).json({ message: 'Anime no encontrado' })
    }

    // Verificar si ya votó
    const existingVote = await votes.findOne({
      userId: decoded.userId,
      animeId
    })

    if (existingVote) {
      return res.status(400).json({ message: 'Ya has votado por este anime' })
    }

    // Crear voto
    await votes.insertOne({
      userId: decoded.userId,
      animeId,
      createdAt: new Date()
    })

    // Actualizar contador de votos
    await animes.updateOne(
      { _id: new ObjectId(animeId) },
      { $inc: { votes: 1 } }
    )

    res.status(200).json({ message: 'Voto registrado exitosamente' })
  } catch (error) {
    console.error('Vote error:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
