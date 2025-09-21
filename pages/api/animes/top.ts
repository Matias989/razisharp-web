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
      .sort({ votes: -1 }) // Ordenar por votos descendente
      .limit(3) // Limitar a 3 resultados
      .toArray()

    // Agregar el ranking a cada anime
    const topAnimesWithRank = topAnimes.map((anime, index) => ({
      ...anime,
      rank: index + 1
    }))

    // Formatear la respuesta
    const response = {
      success: true,
      data: topAnimesWithRank,
      message: 'Top 3 animes más votados obtenidos exitosamente'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Error obteniendo top animes:', error)
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    })
  }
}
