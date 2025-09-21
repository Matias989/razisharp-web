import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowLeft, 
  Save, 
  X, 
  Star,
  Play,
  Pause,
  CheckCircle,
  Calendar,
  Users,
  LogOut
} from 'lucide-react'
import { Anime } from '../../types'
import { showSuccessAlert, showErrorAlert, showConfirmAlert, showLoadingAlert, closeLoadingAlert } from '../../lib/sweetalert-config'

export default function AdminAnimesPage() {
  const [animes, setAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingAnime, setEditingAnime] = useState<Anime | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    totalEpisodes: '',
    currentEpisode: '',
    status: 'planning' as 'watching' | 'completed' | 'paused' | 'planning',
    genres: ''
  })

  useEffect(() => {
    // Verificar autenticación de admin
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        if (user.isAdmin) {
          setUser(user)
          fetchAnimes()
        } else {
          window.location.href = '/animes'
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    } else {
      window.location.href = '/login'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      const animeData = {
        ...formData,
        totalEpisodes: formData.totalEpisodes ? parseInt(formData.totalEpisodes) : null,
        currentEpisode: parseInt(formData.currentEpisode) || 0,
        genres: formData.genres.split(',').map(g => g.trim()).filter(g => g)
      }

      const url = editingAnime ? `/api/animes/${editingAnime._id}` : '/api/animes'
      const method = editingAnime ? 'PUT' : 'POST'

      showLoadingAlert('Procesando...', editingAnime ? 'Actualizando anime...' : 'Creando anime...')

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(animeData)
      })

      closeLoadingAlert()

      if (response.ok) {
        await fetchAnimes()
        resetForm()
        showSuccessAlert(
          editingAnime ? '¡Anime actualizado!' : '¡Anime creado!', 
          editingAnime ? 'El anime ha sido actualizado exitosamente' : 'El anime ha sido creado exitosamente'
        )
      } else {
        const error = await response.json()
        showErrorAlert('Error al guardar', error.message || 'No se pudo guardar el anime')
      }
    } catch (error) {
      console.error('Error saving anime:', error)
      closeLoadingAlert()
      showErrorAlert('Error de conexión', 'No se pudo conectar con el servidor. Inténtalo de nuevo.')
    }
  }

  const handleEdit = (anime: Anime) => {
    setEditingAnime(anime)
    setFormData({
      title: anime.title,
      description: anime.description,
      imageUrl: anime.imageUrl,
      totalEpisodes: anime.totalEpisodes?.toString() || '',
      currentEpisode: anime.currentEpisode.toString(),
      status: anime.status,
      genres: anime.genres?.join(', ') || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (animeId: string) => {
    const result = await showConfirmAlert(
      '¿Eliminar anime?', 
      'Esta acción no se puede deshacer. El anime y todos sus votos serán eliminados permanentemente.'
    )

    if (!result.isConfirmed) return

    try {
      const token = localStorage.getItem('token')
      showLoadingAlert('Eliminando...', 'Eliminando anime y sus votos...')

      const response = await fetch(`/api/animes/${animeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      closeLoadingAlert()

      if (response.ok) {
        await fetchAnimes()
        showSuccessAlert('¡Anime eliminado!', 'El anime ha sido eliminado exitosamente')
      } else {
        const error = await response.json()
        showErrorAlert('Error al eliminar', error.message || 'No se pudo eliminar el anime')
      }
    } catch (error) {
      console.error('Error deleting anime:', error)
      closeLoadingAlert()
      showErrorAlert('Error de conexión', 'No se pudo conectar con el servidor. Inténtalo de nuevo.')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      totalEpisodes: '',
      currentEpisode: '',
      status: 'planning',
      genres: ''
    })
    setEditingAnime(null)
    setShowForm(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'watching': return <Play className="w-4 h-4 text-green-400" />
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-400" />
      case 'paused': return <Pause className="w-4 h-4 text-yellow-400" />
      default: return <Calendar className="w-4 h-4 text-gray-400" />
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Administración de Animes - Razisharp</title>
        <meta name="description" content="Panel de administración de animes" />
      </Head>

      <div className="min-h-screen bg-gradient-dark">
        {/* Header */}
        <header className="relative z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20"></div>
          <div className="relative container mx-auto px-4 py-8">
            <nav className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
          <Link href="/animes" className="btn-ghost flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Link>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-cyan rounded-full flex items-center justify-center glow-cyan overflow-hidden">
                    <Image 
                      src="/ADARKF_3.png" 
                      alt="Razisharp Logo" 
                      width={24} 
                      height={24}
                      className="w-10 h-10"
                    />
                  </div>
                  <span className="text-2xl font-bold text-white font-display">Admin Animes</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-white">Hola, {user?.username}</span>
          <button
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              window.location.href = '/login'
            }}
            className="btn-ghost flex items-center justify-center"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Salir
          </button>
              </div>
            </nav>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Administrar Animes</h1>
              <p className="text-gray-300">Gestiona la lista de animes para votación</p>
            </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar Anime
          </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {editingAnime ? 'Editar Anime' : 'Agregar Anime'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2">Título *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2">Estado</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="planning">Planificado</option>
                        <option value="watching">Viendo</option>
                        <option value="paused">Pausado</option>
                        <option value="completed">Completado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white mb-2">Episodios Totales</label>
                      <input
                        type="number"
                        value={formData.totalEpisodes}
                        onChange={(e) => setFormData({...formData, totalEpisodes: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2">Episodio Actual</label>
                      <input
                        type="number"
                        value={formData.currentEpisode}
                        onChange={(e) => setFormData({...formData, currentEpisode: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white mb-2">Descripción *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">URL de Imagen</label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Géneros (separados por comas)</label>
                    <input
                      type="text"
                      value={formData.genres}
                      onChange={(e) => setFormData({...formData, genres: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                      placeholder="Acción, Aventura, Comedia"
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn-ghost"
                    >
                      Cancelar
                    </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center justify-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {editingAnime ? 'Actualizar' : 'Crear'}
                </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {/* Animes List */}
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
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(anime.status)}
                      <span className="text-sm text-gray-400">
                        {getStatusText(anime.status)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {anime.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progreso:</span>
                      <span className="text-white">
                        {anime.currentEpisode}/{anime.totalEpisodes || '?'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Votos:</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-white">{anime.votes}</span>
                      </div>
                    </div>

                    {anime.genres && anime.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {anime.genres.slice(0, 3).map((genre, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-cyan-600/20 text-cyan-400 text-xs rounded"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(anime)}
                    className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(anime._id!)}
                    className="flex-1 btn-ghost text-sm py-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Eliminar
                  </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {animes.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No hay animes</h3>
              <p className="text-gray-400 mb-6">Comienza agregando tu primer anime</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Agregar Primer Anime
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
