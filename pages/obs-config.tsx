import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Copy, Check, ExternalLink, Monitor, Code, Settings } from 'lucide-react'

export default function OBSConfigPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const endpoints = [
    {
      name: 'Vista Compacta',
      description: 'Diseño minimalista con fondo transparente, solo información esencial',
      url: '/api/animes/top-obs-compact',
      type: 'HTML',
      features: ['Fondo transparente', 'Vista compacta', 'Solo info esencial', 'Perfecto para overlay']
    },
    {
      name: 'Vista HTML Completa',
      description: 'Diseño completo optimizado para OBS con auto-refresh',
      url: '/api/animes/top-obs',
      type: 'HTML',
      features: ['Diseño visual atractivo', 'Auto-refresh cada 30s', 'Responsive', 'Efectos de partículas']
    },
    {
      name: 'Datos JSON',
      description: 'Solo los datos en formato JSON para uso personalizado',
      url: '/api/animes/top-data',
      type: 'JSON',
      features: ['Datos puros', 'Fácil integración', 'Formato estándar', 'Metadatos incluidos']
    },
    {
      name: 'API Original',
      description: 'Endpoint original con respuesta completa',
      url: '/api/animes/top',
      type: 'JSON',
      features: ['Respuesta completa', 'Manejo de errores', 'Estructura estándar']
    }
  ]

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Error copying to clipboard:', err)
    }
  }

  const getFullUrl = (endpoint: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${endpoint}`
    }
    return `https://tu-dominio.com${endpoint}`
  }

  return (
    <>
      <Head>
        <title>Configuración OBS - Razisharp</title>
        <meta name="description" content="Configuración de endpoints para OBS Studio" />
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
                <Monitor className="w-10 h-10 mr-3 text-cyan-400" />
                Configuración OBS
              </h1>
              <p className="text-cyan-400">Endpoints para integrar con OBS Studio</p>
            </div>

            <div className="w-32"></div>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="relative z-10 px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            {/* Instrucciones */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-glow p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Settings className="w-6 h-6 mr-2 text-cyan-400" />
                Instrucciones para OBS Studio
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>1. <strong>Fuente de Navegador:</strong> Agrega una nueva fuente &quot;Navegador&quot; en OBS</p>
                <p>2. <strong>URL:</strong> Copia y pega la URL del endpoint que prefieras</p>
                <p>3. <strong>Dimensiones:</strong> Configura el ancho y alto según tus necesidades</p>
                <p>4. <strong>Auto-refresh:</strong> El endpoint HTML se actualiza automáticamente cada 30 segundos</p>
                <p>5. <strong>Personalización:</strong> Puedes modificar el CSS directamente en el endpoint HTML</p>
              </div>
            </motion.div>

            {/* Endpoints */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {endpoints.map((endpoint, index) => (
                <motion.div
                  key={endpoint.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-glow p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{endpoint.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      endpoint.type === 'HTML' 
                        ? 'bg-green-400/20 text-green-400' 
                        : 'bg-blue-400/20 text-blue-400'
                    }`}>
                      {endpoint.type}
                    </span>
                  </div>

                  <p className="text-gray-300 mb-4">{endpoint.description}</p>

                  {/* URL */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-cyan-400 mb-2">
                      URL del Endpoint:
                    </label>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 bg-gray-800 text-cyan-400 p-2 rounded text-sm break-all">
                        {getFullUrl(endpoint.url)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(getFullUrl(endpoint.url), endpoint.name)}
                        className="btn-secondary p-2"
                        title="Copiar URL"
                      >
                        {copied === endpoint.name ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Características */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-cyan-400 mb-2">Características:</h4>
                    <ul className="space-y-1">
                      {endpoint.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-center">
                          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Botón de prueba */}
                  <a
                    href={endpoint.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Probar Endpoint</span>
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Configuración avanzada */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card-glow p-8 mt-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Code className="w-6 h-6 mr-2 text-cyan-400" />
                Configuración Avanzada
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Dimensiones Recomendadas</h3>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>Ancho:</strong> 800px - 1200px</p>
                    <p><strong>Alto:</strong> 600px - 800px</p>
                    <p><strong>Relación:</strong> 16:9 o 4:3</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Configuración OBS</h3>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>FPS:</strong> 30 FPS</p>
                    <p><strong>CSS:</strong> Personalizable</p>
                    <p><strong>JavaScript:</strong> Habilitado</p>
                    <p><strong>Cache:</strong> Deshabilitado</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h4 className="text-sm font-medium text-cyan-400 mb-2">CSS Personalizado (Opcional)</h4>
                <code className="text-sm text-gray-300">
                  {`.anime-card { transform: scale(0.8); }
.header h1 { font-size: 2rem; }
.podium { gap: 10px; }`}
                </code>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  )
}
