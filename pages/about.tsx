import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Skull, ArrowLeft, Star, Users, Play, Crown, Zap, Shield, Tv, MessageCircle, ExternalLink } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>Sobre Razisharp - Streamer de Anime</title>
        <meta name="description" content="Conoce más sobre Razisharp, el streamer de anime y gaming" />
      </Head>

      <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
        {/* Partículas de fondo */}
        <div className="particles-container">
          {[...Array(25)].map((_, i) => (
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
        <header className="relative z-10 py-6">
          <div className="container mx-auto px-4">
            <Link href="/" className="btn-ghost flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative z-10 py-12">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="w-32 h-32 mx-auto mb-8 bg-gradient-cyan rounded-full flex items-center justify-center glow-cyan-strong animate-float overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image 
                  src="/Icono music.png" 
                  alt="Razisharp Character" 
                  width={128} 
                  height={128}
                  className="w-32 h-32"
                />
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-display text-glow-strong">
                Sobre mí
              </h1>
              <p className="text-xl md:text-2xl text-cyan-400 mb-8 max-w-3xl mx-auto">
                El streamer de anime más épico que conocerás
              </p>
            </motion.div>
          </div>
        </section>

        {/* About Content */}
        <section className="relative z-10 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="card-glow p-8 mb-12"
              >
                <h2 className="text-3xl font-bold text-white mb-6 font-display">¿Quién soy?</h2>
                <div className="prose prose-lg max-w-none text-gray-300 leading-relaxed">
                  <p className="mb-4">
                    ¡Hey! Soy <strong>Razisharp</strong> 👾, un loco apasionado del anime y el gaming que decidió compartir todo esto con ustedes en stream.
                  </p>
                  <p className="mb-4">
                    Tengo mi propio estilo: un rollo <em>dark fantasy</em>, con cráneo, cuernos y ojos cyan brillantes 💀✨ que ya se volvieron parte de mi identidad. Ese toque gótico y futurista lo vas a ver en todo lo que hago, porque quiero que cada stream se sienta distinto, como entrar a otro mundo.
                  </p>
                  <p className="mb-6">
                    Este espacio lo construimos juntos: yo pongo los directos, pero ustedes deciden con qué animes y juegos lo llenamos.
                  </p>
                  
                  {/* Enlaces a Plataformas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <a 
                      href="https://kick.com/razisharp" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-4 bg-gray-700/50 rounded-lg hover:bg-purple-600/20 hover:border-purple-400 border border-gray-600 transition-all group"
                    >
                      <Tv className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
                      <div>
                        <div className="font-semibold text-white group-hover:text-purple-300">Kick</div>
                        <div className="text-sm text-gray-400">Streams en vivo</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-300 ml-auto" />
                    </a>
                    
                    <a 
                      href="https://www.twitch.tv/razisharp" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-4 bg-gray-700/50 rounded-lg hover:bg-purple-600/20 hover:border-purple-400 border border-gray-600 transition-all group"
                    >
                      <Tv className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
                      <div>
                        <div className="font-semibold text-white group-hover:text-purple-300">Twitch</div>
                        <div className="text-sm text-gray-400">Contenido gaming</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-300 ml-auto" />
                    </a>
                    
                    <a 
                      href="https://discord.gg/hjKpTgfTPu" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-4 bg-gray-700/50 rounded-lg hover:bg-indigo-600/20 hover:border-indigo-400 border border-gray-600 transition-all group"
                    >
                      <MessageCircle className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300" />
                      <div>
                        <div className="font-semibold text-white group-hover:text-indigo-300">Discord</div>
                        <div className="text-sm text-gray-400">Comunidad activa</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-300 ml-auto" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Secciones siguientes quedan igual */}
              {/* ... Qué hacemos aquí, características, unirte, footer ... */}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-12 border-t border-cyan-400/20 mt-20">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-cyan rounded-full flex items-center justify-center overflow-hidden">
                <Image 
                  src="/Icono music.png" 
                  alt="RaziClub Logo" 
                  width={20} 
                  height={20}
                  className="w-8 h-8"
                />
              </div>
              <span className="text-xl font-bold text-white font-display">RaziClub</span>
            </div>
            <p className="text-gray-400">
              © 2024 RaziClub. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
