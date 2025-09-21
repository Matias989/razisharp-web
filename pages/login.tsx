import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Skull, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { showSuccessAlert, showErrorAlert, showLoadingAlert, closeLoadingAlert } from '../lib/sweetalert-config'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      showLoadingAlert('Iniciando sesión...', 'Verificando credenciales...')

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      closeLoadingAlert()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        showSuccessAlert('¡Bienvenido!', 'Has iniciado sesión exitosamente').then(() => {
          window.location.href = '/animes'
        })
      } else {
        showErrorAlert('Error de autenticación', data.message || 'Credenciales inválidas')
      }
    } catch (error) {
      closeLoadingAlert()
      showErrorAlert('Error de conexión', 'No se pudo conectar con el servidor. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login - Razisharp</title>
        <meta name="description" content="Inicia sesión en tu cuenta de Razisharp" />
      </Head>

      <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4 relative overflow-hidden">
        {/* Partículas de fondo */}
        <div className="particles-container">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 6 + 's',
                animationDuration: (Math.random() * 4 + 4) + 's'
              }}
            />
          ))}
        </div>

        {/* Botón de regreso */}
        <Link 
          href="/" 
          className="absolute top-6 left-6 z-20 btn-ghost flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-strong rounded-2xl p-8 border border-cyan-400/30">
            <div className="text-center mb-8">
              <motion.div 
                className="w-20 h-20 bg-gradient-cyan rounded-full flex items-center justify-center mx-auto mb-6 glow-cyan animate-float"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Skull className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-4xl font-bold text-white mb-2 font-display">Bienvenido</h1>
              <p className="text-gray-400">Inicia sesión en tu cuenta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-primary"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-primary pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400">
                ¿No tienes cuenta?{' '}
                <Link href="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
