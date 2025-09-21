import { NextApiRequest, NextApiResponse } from 'next'
import { getCollection } from '../../../lib/mongodb'
import { TopAnime } from '../../../types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' })
  }

  try {
    const animes = await getCollection('animes')

    // Obtener los 3 animes más votados
    const topAnimes = await animes
      .find({})
      .sort({ votes: -1 })
      .limit(3)
      .toArray()

    // Agregar el ranking a cada anime
    const topAnimesWithRank = topAnimes.map((anime, index) => ({
      ...anime,
      rank: index + 1
    })) as unknown as TopAnime[]

    // Generar HTML optimizado para OBS
    const html = generateOBSHTML(topAnimesWithRank)

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.status(200).send(html)
  } catch (error) {
    console.error('Error obteniendo top animes para OBS:', error)
    res.status(500).send(`
      <html>
        <head>
          <title>Error - Top Animes</title>
          <style>
            body { 
              background: #0f172a; 
              color: #e2e8f0; 
              font-family: 'Inter', sans-serif; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0; 
            }
            .error { text-align: center; }
          </style>
        </head>
        <body>
          <div class="error">
            <h1>Error al cargar datos</h1>
            <p>No se pudieron obtener los animes</p>
          </div>
        </body>
      </html>
    `)
  }
}

function generateOBSHTML(animes: TopAnime[]): string {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '👑'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return '🏆'
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#fbbf24' // Amarillo
      case 2: return '#d1d5db' // Gris
      case 3: return '#d97706' // Naranja
      default: return '#22d3ee' // Cian
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

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Top 3 Animes - Razisharp</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
            color: #e2e8f0;
            min-height: 100vh;
            overflow: hidden;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 800;
            color: #ffffff;
            margin-bottom: 10px;
            text-shadow: 0 0 20px rgba(34, 211, 238, 0.5);
        }
        
        .header p {
            font-size: 1.2rem;
            color: #22d3ee;
            font-weight: 500;
        }
        
        .podium {
            display: flex;
            justify-content: center;
            align-items: end;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .anime-card {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border: 2px solid #22d3ee;
            border-radius: 16px;
            padding: 20px;
            text-align: center;
            position: relative;
            overflow: hidden;
            box-shadow: 0 0 30px rgba(34, 211, 238, 0.3);
            transition: all 0.3s ease;
            min-width: 280px;
        }
        
        .anime-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 0 40px rgba(34, 211, 238, 0.5);
        }
        
        .anime-card.first {
            border-color: #fbbf24;
            box-shadow: 0 0 40px rgba(251, 191, 36, 0.4);
            animation: glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
            from { box-shadow: 0 0 40px rgba(251, 191, 36, 0.4); }
            to { box-shadow: 0 0 60px rgba(251, 191, 36, 0.6); }
        }
        
        .rank {
            position: absolute;
            top: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border: 3px solid #22d3ee;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: bold;
            color: #22d3ee;
        }
        
        .anime-card.first .rank {
            border-color: #fbbf24;
            color: #fbbf24;
        }
        
        .anime-card.second .rank {
            border-color: #d1d5db;
            color: #d1d5db;
        }
        
        .anime-card.third .rank {
            border-color: #d97706;
            color: #d97706;
        }
        
        .anime-image {
            width: 100%;
            height: 200px;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 15px;
            position: relative;
        }
        
        .anime-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .anime-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 10px;
            line-height: 1.3;
        }
        
        .anime-stats {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .votes {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #fbbf24;
            font-weight: 600;
        }
        
        .episode {
            color: #22d3ee;
            font-weight: 500;
        }
        
        .status {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
            margin-bottom: 15px;
            display: inline-block;
        }
        
        .status.watching { background: #10b981; color: #ffffff; }
        .status.completed { background: #3b82f6; color: #ffffff; }
        .status.paused { background: #f59e0b; color: #ffffff; }
        .status.planning { background: #6b7280; color: #ffffff; }
        
        .genres {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            justify-content: center;
        }
        
        .genre {
            padding: 2px 8px;
            background: rgba(34, 211, 238, 0.2);
            color: #22d3ee;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .no-animes {
            text-align: center;
            padding: 60px 20px;
        }
        
        .no-animes h2 {
            font-size: 2rem;
            color: #6b7280;
            margin-bottom: 20px;
        }
        
        .no-animes p {
            font-size: 1.1rem;
            color: #9ca3af;
        }
        
        .footer {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            border-top: 1px solid #334155;
        }
        
        .footer p {
            color: #6b7280;
            font-size: 0.9rem;
        }
        
        .refresh-info {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 0.8rem;
            color: #22d3ee;
            border: 1px solid #22d3ee;
        }
    </style>
</head>
<body>
    <div class="refresh-info">
        🔄 Auto-refresh: 30s
    </div>
    
    <div class="container">
        <div class="header">
            <h1>🏆 Top 3 Animes</h1>
            <p>Los más votados por la comunidad</p>
        </div>
        
        ${animes.length === 0 ? `
            <div class="no-animes">
                <h2>No hay animes aún</h2>
                <p>Sé el primero en agregar un anime y empezar a votar</p>
            </div>
        ` : `
            <div class="podium">
                ${animes.map((anime, index) => `
                    <div class="anime-card ${index === 0 ? 'first' : index === 1 ? 'second' : 'third'}">
                        <div class="rank">${getRankIcon(anime.rank)}</div>
                        
                        <div class="anime-image">
                            <img src="${anime.imageUrl || '/placeholder-anime.jpg'}" alt="${anime.title}" />
                        </div>
                        
                        <h3 class="anime-title">${anime.title}</h3>
                        
                        <div class="anime-stats">
                            <div class="votes">
                                ⭐ ${anime.votes}
                            </div>
                            <div class="episode">
                                Cap. ${anime.currentEpisode}${anime.totalEpisodes ? `/${anime.totalEpisodes}` : ''}
                            </div>
                        </div>
                        
                        <div class="status ${anime.status}">
                            ${getStatusText(anime.status)}
                        </div>
                        
                        ${anime.genres && anime.genres.length > 0 ? `
                            <div class="genres">
                                ${anime.genres.slice(0, 3).map(genre => `
                                    <span class="genre">${genre}</span>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `}
        
        <div class="footer">
            <p>Razisharp Community • Actualizado automáticamente</p>
        </div>
    </div>
    
    <script>
        // Auto-refresh cada 30 segundos
        setTimeout(() => {
            window.location.reload();
        }, 30000);
        
        // Efecto de partículas de fondo
        function createParticles() {
            const container = document.body;
            const particleCount = 20;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.width = Math.random() * 4 + 2 + 'px';
                particle.style.height = particle.style.width;
                particle.style.background = '#22d3ee';
                particle.style.borderRadius = '50%';
                particle.style.opacity = '0.6';
                particle.style.pointerEvents = 'none';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animation = 'float ' + (Math.random() * 4 + 4) + 's ease-in-out infinite';
                particle.style.animationDelay = Math.random() * 6 + 's';
                
                container.appendChild(particle);
            }
        }
        
        // CSS para animación de partículas
        const style = document.createElement('style');
        style.textContent = '@keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; } 50% { transform: translateY(-20px) rotate(180deg); opacity: 0.3; } }';
        document.head.appendChild(style);
        
        // Crear partículas al cargar
        createParticles();
    </script>
</body>
</html>
  `
}
