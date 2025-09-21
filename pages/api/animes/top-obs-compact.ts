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

    // Generar HTML compacto optimizado para OBS
    const html = generateCompactOBSHTML(topAnimesWithRank)

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.status(200).send(html)
  } catch (error) {
    console.error('Error obteniendo top animes compacto para OBS:', error)
    res.status(500).send(`
      <html>
        <head>
          <title>Error - Top Animes Compacto</title>
          <style>
            body { 
              background: transparent; 
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

function generateCompactOBSHTML(animes: TopAnime[]): string {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return '🏆'
    }
  }

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Top 3 Animes Compacto - Razisharp</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: transparent;
            color: #ffffff;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            overflow: hidden;
        }
        
        .container {
            margin: 0;
            padding: 0;
        }
        
        .podium {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin: 0;
            padding: 0;
        }
        
        .anime-card {
            background: rgba(30, 41, 59, 0.9);
            border: 2px solid #22d3ee;
            border-radius: 12px;
            padding: 8px;
            text-align: center;
            position: relative;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            min-width: 180px;
            max-width: 220px;
            flex: 1;
        }
        
        .anime-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 0 20px rgba(34, 211, 238, 0.4);
        }
        
        .anime-card.first {
            border-color: #fbbf24;
            box-shadow: 0 0 15px rgba(251, 191, 36, 0.3);
        }
        
        .anime-card.second {
            border-color: #d1d5db;
        }
        
        .anime-card.third {
            border-color: #d97706;
        }
        
        .rank {
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background: rgba(30, 41, 59, 0.95);
            border: 2px solid #22d3ee;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            font-weight: bold;
            color: #22d3ee;
            backdrop-filter: blur(10px);
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
            height: 120px;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 10px;
            position: relative;
        }
        
        .anime-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .anime-title {
            font-size: 0.9rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8px;
            line-height: 1.2;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .anime-stats {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .votes {
            display: flex;
            align-items: center;
            gap: 3px;
            color: #fbbf24;
            font-weight: 600;
            font-size: 0.8rem;
        }
        
        .episode {
            color: #22d3ee;
            font-weight: 500;
            font-size: 0.8rem;
        }
        
        .no-animes {
            text-align: center;
            padding: 40px 20px;
        }
        
        .no-animes h2 {
            font-size: 1.5rem;
            color: #6b7280;
            margin-bottom: 15px;
        }
        
        .no-animes p {
            font-size: 1rem;
            color: #9ca3af;
        }
        
        
        /* Responsive para diferentes tamaños */
        @media (max-width: 768px) {
            .podium {
                flex-direction: column;
                gap: 10px;
            }
            
            .anime-card {
                min-width: 180px;
                max-width: 220px;
            }
        }
        
        /* Animación sutil */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .anime-card {
            animation: fadeIn 0.5s ease-out;
        }
        
        .anime-card:nth-child(1) { animation-delay: 0.1s; }
        .anime-card:nth-child(2) { animation-delay: 0.2s; }
        .anime-card:nth-child(3) { animation-delay: 0.3s; }
    </style>
</head>
<body>
    <div class="container">
        ${animes.length === 0 ? `
            <div class="no-animes">
                <h2>No hay animes aún</h2>
                <p>Sé el primero en agregar un anime</p>
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
                    </div>
                `).join('')}
            </div>
        `}
    </div>
    
    <script>
        // Auto-refresh cada 5 minutos
        setTimeout(() => {
            window.location.reload();
        }, 300000);
    </script>
</body>
</html>
  `
}
