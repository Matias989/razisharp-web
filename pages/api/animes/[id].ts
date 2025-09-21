import { NextApiRequest, NextApiResponse } from 'next'
import { getCollection } from '../../../lib/mongodb'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID de anime inválido' })
  }

  const animes = await getCollection('animes')

  try {
    switch (req.method) {
      case 'GET':
        const anime = await animes.findOne({ _id: new ObjectId(id) })
        if (!anime) {
          return res.status(404).json({ message: 'Anime no encontrado' })
        }
        res.status(200).json(anime)
        break

      case 'PUT':
        // Verificar autenticación de admin
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

        const { title, description, imageUrl, currentEpisode, totalEpisodes, status, genres } = req.body

        const updateData: any = {
          updatedAt: new Date()
        }

        if (title) updateData.title = title
        if (description) updateData.description = description
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl
        if (currentEpisode !== undefined) updateData.currentEpisode = currentEpisode
        if (totalEpisodes !== undefined) updateData.totalEpisodes = totalEpisodes
        if (status) updateData.status = status
        if (genres) updateData.genres = genres

        const result = await animes.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        )

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Anime no encontrado' })
        }

        const updatedAnime = await animes.findOne({ _id: new ObjectId(id) })
        res.status(200).json(updatedAnime)
        break

      case 'DELETE':
        // Verificar autenticación de admin
        const deleteToken = req.headers.authorization?.replace('Bearer ', '')
        if (!deleteToken) {
          return res.status(401).json({ message: 'No se proporcionó token de autenticación' })
        }

        const deleteDecoded = jwt.verify(deleteToken, process.env.JWT_SECRET!) as any
        const deleteUsers = await getCollection('users')
        const deleteUser = await deleteUsers.findOne({ _id: new ObjectId(deleteDecoded.userId) })

        if (!deleteUser || !deleteUser.isAdmin) {
          return res.status(403).json({ message: 'Se requiere acceso de administrador' })
        }

        const deleteResult = await animes.deleteOne({ _id: new ObjectId(id) })

        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ message: 'Anime no encontrado' })
        }

        // También eliminar votos relacionados
        const votes = await getCollection('votes')
        await votes.deleteMany({ animeId: id })

        res.status(200).json({ message: 'Anime eliminado exitosamente' })
        break

      default:
        res.status(405).json({ message: 'Método no permitido' })
    }
  } catch (error) {
    console.error('Anime API error:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
