import { useState, useEffect, useCallback, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Play, Pause, CheckCircle, ArrowLeft, LogOut, User, Crown, Settings, Trophy, Monitor, Search, Filter, X, Loader2 } from 'lucide-react'
import { Anime } from '../../types'
import { showSuccessAlert, showErrorAlert, showWarningAlert } from '../../lib/sweetalert-config'

interface PaginationInfo {
  page: number
  limit: number
  total: number
  hasMore: boolean
  totalPages: number
}

export default function AnimesPage() {
  const [animes, setAnimes] = useState<Anime[]>([])
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [voting, setVoting] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [availableGenres, setAvailableGenres] = useState<string[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<HTMLDivElement>(null)

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

  // Aplicar filtros cuando cambien los términos de búsqueda o género
  useEffect(() => {
    let filtered = animes

    // Filtrar por nombre
    if (searchTerm) {
      filtered = filtered.filter(anime =>
        anime.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por género
    if (selectedGenre) {
      filtered = filtered.filter(anime =>
        anime.genres && anime.genres.includes(selectedGenre)
      )
    }

    setFilteredAnimes(filtered)
  }, [animes, searchTerm, selectedGenre])

  const fetchAnimes = async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      const response = await fetch(`/api/animes?page=${page}&limit=12`)
      const data = await response.json()
      
      if (append) {
        setAnimes(prev => [...prev, ...data.animes])
        setFilteredAnimes(prev => [...prev, ...data.animes])
      } else {
        setAnimes(data.animes)
        setFilteredAnimes(data.animes)
        
        // Extraer géneros únicos solo en la primera carga
        const genres = new Set<string>()
        data.animes.forEach((anime: Anime) => {
          if (anime.genres) {
            anime.genres.forEach(genre => genres.add(genre))
          }
        })
        setAvailableGenres(Array.from(genres).sort())
      }
      
      setPagination(data.pagination)
      setHasMore(data.pagination.hasMore)
    } catch (error) {
      console.error('Error fetching animes:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
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

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedGenre('')
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  const clearGenre = () => {
    setSelectedGenre('')
  }

  const loadMoreAnimes = useCallback(() => {
    if (hasMore && !loadingMore && pagination) {
      fetchAnimes(pagination.page + 1, true)
    }
  }, [hasMore, loadingMore, pagination])

  // Observer para scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreAnimes()
        }
      },
      { threshold: 0.1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [loadMoreAnimes, hasMore, loadingMore])

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

          {/* Filtros */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="card-glow p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Búsqueda por nombre */}
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Buscar por nombre
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Escribe el nombre del anime..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    />
                    {searchTerm && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filtro por género */}
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Filtrar por género
                  </label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent appearance-none"
                    >
                      <option value="">Todos los géneros</option>
                      {availableGenres.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                    {selectedGenre && (
                      <button
                        onClick={clearGenre}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Botón limpiar filtros */}
                {(searchTerm || selectedGenre) && (
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="btn-ghost text-sm flex items-center justify-center"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Limpiar
                    </button>
                  </div>
                )}
              </div>

              {/* Contador de resultados */}
              <div className="mt-4 text-center">
                <span className="text-gray-400 text-sm">
                  {filteredAnimes.length} de {pagination?.total || animes.length} animes
                  {(searchTerm || selectedGenre) && ' encontrados'}
                  {pagination && !searchTerm && !selectedGenre && (
                    <span className="block mt-1 text-xs">
                      Página {pagination.page} de {pagination.totalPages}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimes.map((anime, index) => (
              <motion.div
                key={`${anime._id}-${index}`}
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

          {/* Indicador de carga para scroll infinito */}
          {loadingMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-8"
            >
              <div className="flex items-center space-x-2 text-cyan-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Cargando más animes...</span>
              </div>
            </motion.div>
          )}

          {/* Elemento observador para scroll infinito */}
          {hasMore && !loadingMore && (
            <div ref={observerRef} className="h-10" />
          )}

          {/* Mensaje cuando no hay más animes */}
          {!hasMore && animes.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="text-gray-400 text-sm">
                ¡Has visto todos los animes disponibles!
              </div>
            </motion.div>
          )}

          {filteredAnimes.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Star className="w-16 h-16 text-gray-600 mx-auto mb-6" />
              {animes.length === 0 ? (
                <>
                  <h3 className="text-2xl text-gray-400 mb-4">No hay animes disponibles</h3>
                  <p className="text-gray-500 mb-6">Vuelve más tarde para ver la lista de animes</p>
                  <Link href="/" className="btn-primary">
                    Volver al Inicio
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="text-2xl text-gray-400 mb-4">No se encontraron resultados</h3>
                  <p className="text-gray-500 mb-6">
                    No hay animes que coincidan con tu búsqueda
                    {(searchTerm || selectedGenre) && (
                      <span className="block mt-2">
                        Intenta con otros términos o{' '}
                        <button 
                          onClick={clearFilters}
                          className="text-cyan-400 hover:text-cyan-300 underline"
                        >
                          limpia los filtros
                        </button>
                      </span>
                    )}
                  </p>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
