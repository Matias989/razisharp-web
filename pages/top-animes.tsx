import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Trophy, Star, ArrowLeft, Crown, Medal, Award } from 'lucide-react'
import { TopAnime } from '../types'

export default function TopAnimesPage() {
  const [topAnimes, setTopAnimes] = useState<TopAnime[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopAnimes()
  }, [])

  const fetchTopAnimes = async () => {
    try {
      const response = await fetch('/api/animes/top')
      const data = await response.json()
      
      if (data.success) {
        setTopAnimes(data.data)
      } else {
        console.error('Error fetching top animes:', data.message)
      }
    } catch (error) {
      console.error('Error fetching top animes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-400" />
      case 2:
        return <Medal className="w-8 h-8 text-gray-300" />
      case 3:
        return <Award className="w-8 h-8 text-amber-600" />
      default:
        return <Trophy className="w-6 h-6 text-cyan-400" />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600'
      case 2:
        return 'from-gray-300 to-gray-500'
      case 3:
        return 'from-amber-600 to-amber-800'
      default:
        return 'from-cyan-400 to-cyan-600'
    }
  }

  if (loading) {
    return (
      <>
        <Head>
          <title>Top Animes - Razisharp</title>
          <meta name="description" content="Los animes más votados por la comunidad" />
        </Head>

        <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-cyan-400 text-xl">Cargando top animes...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Top Animes - Razisharp</title>
        <meta name="description" content="Los animes más votados por la comunidad" />
      </Head>

      <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
        {/* Partículas de fondo */}
        <div className="particles-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 6 + 's',
                animationDuration: (Math.random() * 4 + 4) + 's'
              }}
            />
          ))}
        </div>

        {/* Header */}
        <header className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link 
              href="/animes" 
              className="btn-ghost flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Animes</span>
            </Link>

            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2 font-display flex items-center justify-center">
                <Trophy className="w-10 h-10 mr-3 text-yellow-400" />
                Top Animes
              </h1>
              <p className="text-cyan-400">Los más votados por la comunidad</p>
            </div>

            <div className="w-32"></div> {/* Spacer para centrar el título */}
          </div>
        </header>

        {/* Contenido principal */}
        <main className="relative z-10 px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            {topAnimes.length === 0 ? (
              <div className="text-center py-20">
                <Trophy className="w-24 h-24 text-gray-600 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-400 mb-4">No hay animes aún</h2>
                <p className="text-gray-500 mb-8">Sé el primero en agregar un anime y empezar a votar</p>
                <Link href="/animes" className="btn-primary">
                  Ver Animes
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {topAnimes.map((anime, index) => (
                  <motion.div
                    key={anime._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="card-glow p-8 relative overflow-hidden"
                  >
                    {/* Efecto de gradiente de fondo según el ranking */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${getRankColor(anime.rank)} opacity-5`}></div>
                    
                    <div className="relative z-10 flex items-center space-x-6">
                      {/* Ranking */}
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-2 border-2 border-cyan-400">
                          {getRankIcon(anime.rank)}
                        </div>
                        <span className="text-2xl font-bold text-cyan-400">#{anime.rank}</span>
                      </div>

                      {/* Imagen del anime */}
                      <div className="relative w-32 h-48 rounded-lg overflow-hidden">
                        <Image
                          src={anime.imageUrl}
                          alt={anime.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Información del anime */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2 font-display">
                          {anime.title}
                        </h3>
                        <p className="text-gray-300 mb-4 line-clamp-2">
                          {anime.description}
                        </p>
                        
                        {/* Estadísticas */}
                        <div className="flex items-center space-x-6 mb-4">
                          <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-yellow-400" />
                            <span className="text-yellow-400 font-semibold text-lg">
                              {anime.votes} votos
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400">Episodio:</span>
                            <span className="text-cyan-400 font-semibold">
                              {anime.currentEpisode}
                              {anime.totalEpisodes && ` / ${anime.totalEpisodes}`}
                            </span>
                          </div>
                        </div>

                        {/* Géneros */}
                        {anime.genres && anime.genres.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {anime.genres.map((genre, genreIndex) => (
                              <span
                                key={genreIndex}
                                className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm"
                              >
                                {genre}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Efecto de brillo para el primer lugar */}
                    {anime.rank === 1 && (
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent animate-pulse"></div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
