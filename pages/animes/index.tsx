import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Play, Pause, CheckCircle, ArrowLeft, LogOut, User, Crown, Settings, Trophy, Monitor } from 'lucide-react'
import { Anime } from '../../types'
import { showSuccessAlert, showErrorAlert, showWarningAlert } from '../../lib/sweetalert-config'

export default function AnimesPage() {
  const [animes, setAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [voting, setVoting] = useState<string | null>(null)

  useEffect(() => {
    // Cargar animes
    fetchAnimes()
    
    // Verificar autenticación
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [])

  const fetchAnimes = async () => {
    try {
      const response = await fetch('/api/animes')
      const data = await response.json()
      setAnimes(data)
    } catch (error) {
      console.error('Error fetching animes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (animeId: string) => {
    if (!user) {
      showWarningAlert('Acceso requerido', 'Debes iniciar sesión para poder votar por tus animes favoritos')
      return
    }

    setVoting(animeId)
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch('/api/animes/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ animeId })
      })

      if (response.ok) {
        // Actualizar la lista de animes
        setAnimes(animes.map(anime => 
          anime._id === animeId 
            ? { ...anime, votes: anime.votes + 1 }
            : anime
        ))
        showSuccessAlert('¡Voto registrado!', 'Tu voto ha sido contabilizado exitosamente')
      } else {
        const error = await response.json()
        showErrorAlert('Error al votar', error.message || 'No se pudo procesar tu voto')
      }
    } catch (error) {
      console.error('Error voting:', error)
      showErrorAlert('Error de conexión', 'No se pudo conectar con el servidor. Inténtalo de nuevo.')
    } finally {
      setVoting(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'watching': return <Play className="w-4 h-4 text-green-400" />
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-400" />
      case 'paused': return <Pause className="w-4 h-4 text-yellow-400" />
      default: return <Star className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'watching': return 'Viendo'
      case 'completed': return 'Completado'
      case 'paused': return 'Pausado'
      default: return 'Planificado'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'watching': return 'text-green-400'
      case 'completed': return 'text-blue-400'
      case 'paused': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <div className="text-cyan-400 text-xl">Cargando animes...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Votar Animes - Razisharp</title>
        <meta name="description" content="Vota por tus animes favoritos en el sitio de Razisharp" />
      </Head>

      <div className="min-h-screen bg-gradient-dark">
        {/* Header */}
        <header className="relative z-10 py-6">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="btn-ghost flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </Link>
              
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-white">
                      {user.isAdmin && <Crown className="w-4 h-4 text-yellow-400" />}
                      <User className="w-4 h-4" />
                      <span className="text-sm">{user.username}</span>
                    </div>
            <Link href="/top-animes" className="btn-secondary text-sm flex items-center justify-center">
              <Trophy className="w-4 h-4 mr-1" />
              Top 3
            </Link>
            {user.isAdmin && (
              <>
                <Link href="/obs-config" className="btn-secondary text-sm flex items-center justify-center">
                  <Monitor className="w-4 h-4 mr-1" />
                  OBS
                </Link>
                <Link href="/admin/animes" className="btn-secondary text-sm flex items-center justify-center">
                  <Settings className="w-4 h-4 mr-1" />
                  Admin
                </Link>
              </>
            )}
                    <button onClick={handleLogout} className="btn-ghost text-sm flex items-center justify-center">
                      <LogOut className="w-4 h-4 mr-1" />
                      Salir
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/login" className="btn-ghost text-sm">Login</Link>
                    <Link href="/register" className="btn-primary text-sm">Registrarse</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-white mb-4 font-display text-glow-strong"
            >
              Votar Animes
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300"
            >
              Ayuda a decidir qué animes ver en los streams
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animes.map((anime, index) => (
              <motion.div
                key={anime._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-glow hover-lift"
              >
                {anime.imageUrl && (
                  <div className="h-48 bg-gray-700 rounded-t-lg overflow-hidden relative">
                    <Image 
                      src={anime.imageUrl} 
                      alt={anime.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white truncate flex-1">
                      {anime.title}
                    </h3>
                    <div className="flex items-center space-x-1 ml-2">
                      {getStatusIcon(anime.status)}
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {anime.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm font-medium ${getStatusColor(anime.status)}`}>
                      {getStatusText(anime.status)}
                    </span>
                    <span className="text-gray-400 text-sm">
                      Cap. {anime.currentEpisode}
                      {anime.totalEpisodes && `/${anime.totalEpisodes}`}
                    </span>
                  </div>

                  {anime.genres && anime.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {anime.genres.slice(0, 3).map((genre, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-cyan-600/20 text-cyan-400 text-xs rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-bold text-lg">{anime.votes}</span>
                    </div>
                    
                  <button
                    onClick={() => handleVote(anime._id!)}
                    disabled={voting === anime._id}
                    className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    {voting === anime._id ? 'Votando...' : 'Votar'}
                  </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {animes.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Star className="w-16 h-16 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl text-gray-400 mb-4">No hay animes disponibles</h3>
              <p className="text-gray-500 mb-6">Vuelve más tarde para ver la lista de animes</p>
              <Link href="/" className="btn-primary">
                Volver al Inicio
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
