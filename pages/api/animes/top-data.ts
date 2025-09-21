import { NextApiRequest, NextApiResponse } from 'next'
import { getCollection } from '../../../lib/mongodb'
import { TopAnime } from '../../../types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' })
  }

  try {
    const animes = await getCollection('animes')

    // Obtener los 3 animes más votados
    const topAnimes = await animes
      .find({})
      .sort({ votes: -1 })
      .limit(3)
      .toArray()

    // Agregar el ranking a cada anime
    const topAnimesWithRank = topAnimes.map((anime, index) => ({
      ...anime,
      rank: index + 1
    }))

    // Formatear la respuesta para OBS
    const response = {
      success: true,
      data: topAnimesWithRank,
      message: 'Top 3 animes más votados obtenidos exitosamente',
      timestamp: new Date().toISOString(),
      total: topAnimesWithRank.length
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Error obteniendo top animes para OBS:', error)
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor',
      data: [],
      timestamp: new Date().toISOString(),
      total: 0
    })
  }
}
