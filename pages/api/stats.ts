import { NextApiRequest, NextApiResponse } from 'next'
import { getCollection } from '../../lib/mongodb'
import { Stats } from '../../types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const users = await getCollection('users')
    const animes = await getCollection('animes')
    const votes = await getCollection('votes')

    // Obtener estadísticas básicas
    const [totalUsers, totalAnimes, totalVotes] = await Promise.all([
      users.countDocuments(),
      animes.countDocuments(),
      votes.countDocuments()
    ])

    // Usuarios activos (que han votado en los últimos 30 días)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const activeUsers = await votes.distinct('userId', {
      createdAt: { $gte: thirtyDaysAgo }
    })

    const stats: Stats = {
      totalUsers,
      totalAnimes,
      totalVotes,
      activeUsers: activeUsers.length
    }

    res.status(200).json(stats)
  } catch (error) {
    console.error('Stats API error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
