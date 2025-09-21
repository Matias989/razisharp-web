import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Crown, Users, Star, Play, Zap, Shield, ExternalLink, User, LogOut } from 'lucide-react'
import { Stats } from '../types'

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalAnimes: 0,
    totalVotes: 0,
    activeUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Cargar estadísticas
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))

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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    window.location.reload()
  }

  return (
    <>
      <Head>
        <title>Razisharp - Streamer de Anime</title>
        <meta name="description" content="Sitio oficial de Razisharp, streamer de anime y gaming. Únete a la comunidad y vota por tus animes favoritos." />
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
        <header className="relative z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20"></div>
          <div className="relative container mx-auto px-4 py-8">
            <nav className="flex justify-between items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-cyan rounded-full flex items-center justify-center glow-cyan overflow-hidden">
                  <Image 
                    src="/ADARKF_3.png" 
                    alt="Razisharp Logo" 
                    width={24} 
                    height={24}
                    className="w-10 h-10"
                  />
                </div>
                <span className="text-2xl font-bold text-white font-display">Razisharp</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center space-x-4"
              >
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-white">
                      {user.isAdmin && <Crown className="w-4 h-4 text-yellow-400" />}
                      <User className="w-4 h-4" />
                      <span className="text-sm">Hola, {user.username}</span>
                    </div>
                    <button onClick={handleLogout} className="btn-ghost text-sm flex items-center justify-center">
                      <LogOut className="w-4 h-4 mr-1" />
                      Salir
                    </button>
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="btn-ghost">
                      Login
                    </Link>
                    <Link href="/register" className="btn-primary">
                      Registrarse
                    </Link>
                  </>
                )}
              </motion.div>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="mb-8">
                <motion.div 
                  className="w-60 h-60 mx-auto mb-8 bg-gradient-cyan rounded-full flex items-center justify-center glow-cyan-strong animate-float overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image 
                    src="/ADARKF_3.png" 
                    alt="Razisharp Character" 
                    width={300} 
                    height={300}
                  />
                </motion.div>
                
                <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 font-display text-glow-strong">
                  Razisharp
                </h1>
                <p className="text-2xl md:text-3xl text-cyan-400 mb-6 font-semibold">
                  Streamer de Anime & Gaming
                </p>
                <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Únete a la comunidad más épica de anime. Vota por tus series favoritas, 
                  sigue el progreso de capítulos y forma parte de la experiencia de streaming.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                  <Link href="/animes" className="btn-primary text-lg px-8 py-4 flex items-center justify-center">
                    <Star className="w-5 h-5 mr-2" />
                    Votar Animes
                  </Link>
                  <Link href="/about" className="btn-secondary text-lg px-8 py-4 flex items-center justify-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Conoce Más
                  </Link>
                </div>

                {/* Enlaces a Redes Sociales */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-col sm:flex-row justify-center gap-4"
                >
                  <a 
                    href="https://kick.com/razisharp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-ghost text-lg px-6 py-3 flex items-center justify-center"
                  >
                    <Image src="/kick.svg" alt="Kick" width={20} height={20} className="mr-2" />
                    Kick
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                  
                  <a 
                    href="https://www.twitch.tv/razisharp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-ghost text-lg px-6 py-3 flex items-center justify-center"
                  >
                    <Image src="/twitch.svg" alt="Twitch" width={20} height={20} className="mr-2" />
                    Twitch
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                  
                  <a 
                    href="https://discord.gg/hjKpTgfTPu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-ghost text-lg px-6 py-3 flex items-center justify-center"
                  >
                    <Image src="/discord.svg" alt="Discord" width={20} height={20} className="mr-2" />
                    Discord
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </motion.div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            >
              <div className="card-glow p-6 text-center">
                <Users className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">
                  {loading ? '...' : stats.totalUsers}
                </div>
                <div className="text-gray-400 text-sm">Seguidores</div>
              </div>
              
              <div className="card-glow p-6 text-center">
                <Star className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">
                  {loading ? '...' : stats.totalAnimes}
                </div>
                <div className="text-gray-400 text-sm">Animes</div>
              </div>
              
              <div className="card-glow p-6 text-center">
                <Crown className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">
                  {loading ? '...' : stats.totalVotes}
                </div>
                <div className="text-gray-400 text-sm">Votos</div>
              </div>
              
              <div className="card-glow p-6 text-center">
                <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">
                  {loading ? '...' : stats.activeUsers}
                </div>
                <div className="text-gray-400 text-sm">Activos</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
                ¿Qué puedes hacer aquí?
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Descubre todas las funcionalidades que tenemos para ti
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="card-glow p-8 text-center hover-lift"
              >
                <div className="w-16 h-16 bg-gradient-cyan rounded-2xl flex items-center justify-center mx-auto mb-6 glow-cyan">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Únete a la Comunidad</h3>
                <p className="text-gray-400 leading-relaxed">
                  Regístrate y forma parte de la comunidad más épica de seguidores de Razisharp. 
                  Conecta con otros fans y comparte tu pasión por el anime.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="card-glow p-8 text-center hover-lift"
              >
                <div className="w-16 h-16 bg-gradient-cyan rounded-2xl flex items-center justify-center mx-auto mb-6 glow-cyan">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Vota por Animes</h3>
                <p className="text-gray-400 leading-relaxed">
                  Ayuda a decidir qué animes ver en los streams. Tu voto cuenta y puede 
                  influir en la programación de contenido de Razisharp.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="card-glow p-8 text-center hover-lift"
              >
                <div className="w-16 h-16 bg-gradient-cyan rounded-2xl flex items-center justify-center mx-auto mb-6 glow-cyan">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Sigue el Progreso</h3>
                <p className="text-gray-400 leading-relaxed">
                  Mantente al día con el progreso de capítulos de cada anime. 
                  Nunca te pierdas un episodio importante.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Redes Sociales Section */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
                Sígueme en Mis Plataformas
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Conecta conmigo en todas mis plataformas y únete a la comunidad más épica
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <motion.a
                href="https://kick.com/razisharp"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                className="card-glow p-8 text-center hover-lift group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Image src="/kick.svg" alt="Kick" width={32} height={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Kick</h3>
                <p className="text-gray-400 mb-4">
                  Mira mis streams en vivo en Kick y disfruta del contenido más fresco
                </p>
                <div className="flex items-center justify-center text-purple-400 group-hover:text-purple-300 transition-colors">
                  <span className="mr-2">Visitar Kick</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </motion.a>

              <motion.a
                href="https://www.twitch.tv/razisharp"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                className="card-glow p-8 text-center hover-lift group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Image src="/twitch.svg" alt="Twitch" width={32} height={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Twitch</h3>
                <p className="text-gray-400 mb-4">
                  Únete a mis streams en Twitch y forma parte de la comunidad
                </p>
                <div className="flex items-center justify-center text-purple-400 group-hover:text-purple-300 transition-colors">
                  <span className="mr-2">Visitar Twitch</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </motion.a>

              <motion.a
                href="https://discord.gg/hjKpTgfTPu"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.0 }}
                className="card-glow p-8 text-center hover-lift group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Image src="/discord.svg" alt="Discord" width={32} height={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Discord</h3>
                <p className="text-gray-400 mb-4">
                  Únete a nuestro Discord y chatea con la comunidad en tiempo real
                </p>
                <div className="flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  <span className="mr-2">Unirse al Discord</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </motion.a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.2 }}
              className="card-glow p-12 max-w-4xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
                ¿Listo para la Aventura?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Únete ahora y forma parte de la comunidad más épica de anime. 
                Tu próxima gran aventura te espera.
              </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/register" className="btn-primary text-lg px-8 py-4 flex items-center justify-center">
                    <Crown className="w-5 h-5 mr-2" />
                    Crear Cuenta
                  </Link>
                  <Link href="/animes" className="btn-secondary text-lg px-8 py-4 flex items-center justify-center">
                    <Star className="w-5 h-5 mr-2" />
                    Ver Animes
                  </Link>
                </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-12 border-t border-cyan-400/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-cyan rounded-full flex items-center justify-center glow-cyan overflow-hidden">
                  <Image 
                    src="/ADARKF_3.png" 
                    alt="Razisharp Logo" 
                    width={24} 
                    height={24}
                    className="w-10 h-10"
                  />
                </div>
                <span className="text-2xl font-bold text-white font-display">Razisharp</span>
              </div>
              
              {/* Enlaces a Redes Sociales */}
              <div className="flex justify-center space-x-6 mb-6">
                <a 
                  href="https://kick.com/razisharp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                  title="Sígueme en Kick"
                >
                  <Image src="/kick.svg" alt="Kick" width={24} height={24} />
                </a>
                
                <a 
                  href="https://www.twitch.tv/razisharp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                  title="Sígueme en Twitch"
                >
                  <Image src="/twitch.svg" alt="Twitch" width={24} height={24} />
                </a>
                
                <a 
                  href="https://discord.gg/hjKpTgfTPu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                  title="Únete a mi Discord"
                >
                  <Image src="/discord.svg" alt="Discord" width={24} height={24} />
                </a>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-400 mb-2">
                © 2024 Razisharp. Todos los derechos reservados.
              </p>
              <p className="text-gray-500 text-sm">
                Hecho con ❤️ para la comunidad de anime
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
