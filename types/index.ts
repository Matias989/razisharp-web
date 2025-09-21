export interface User {
  _id?: string
  username: string
  email: string
  password: string
  createdAt: Date
  isAdmin?: boolean
  avatar?: string
}

export interface Anime {
  _id?: string
  title: string
  description: string
  imageUrl: string
  currentEpisode: number
  totalEpisodes?: number
  status: 'watching' | 'completed' | 'paused' | 'planning'
  votes: number
  addedBy: string
  createdAt: Date
  updatedAt: Date
  genres?: string[]
  rating?: number
}

export interface Vote {
  _id?: string
  userId: string
  animeId: string
  createdAt: Date
}

export interface Stats {
  totalUsers: number
  totalAnimes: number
  totalVotes: number
  activeUsers: number
}

export interface AuthResponse {
  message: string
  token: string
  user: {
    id: string
    username: string
    email: string
    isAdmin: boolean
  }
}

export interface TopAnime {
  _id: string
  title: string
  description: string
  imageUrl: string
  votes: number
  currentEpisode: number
  totalEpisodes?: number
  status: 'watching' | 'completed' | 'paused' | 'planning'
  genres?: string[]
  addedBy: string
  createdAt: Date
  updatedAt: Date
  rank: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
