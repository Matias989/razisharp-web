import type { AppProps } from 'next/app'
import '../styles/globals.css'
import Head from 'next/head'
import { useBodyScroll } from '../lib/useBodyScroll'
import '../lib/scrollRestore'

export default function App({ Component, pageProps }: AppProps) {
  // Usar el hook para manejar el scroll del body
  useBodyScroll()

  return (
    <>
      <Head>
        <title>Razisharp - Streamer de Anime</title>
        <meta name="description" content="Sitio oficial de Razisharp, streamer de anime y gaming. Únete a la comunidad y vota por tus animes favoritos." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#32868A" />
        <meta property="og:title" content="Razisharp - Streamer de Anime" />
        <meta property="og:description" content="Sitio oficial de Razisharp, streamer de anime y gaming" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Razisharp - Streamer de Anime" />
        <meta name="twitter:description" content="Sitio oficial de Razisharp, streamer de anime y gaming" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
