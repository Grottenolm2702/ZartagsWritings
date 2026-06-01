import React from 'react'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import CampaignOverview from './pages/CampaignOverview'

function Router() {
  const [path, setPath] = React.useState(window.location.pathname)
  React.useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)

    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a')
      if (!a) return
      const href = a.getAttribute('href')
      if (href && (href.startsWith('/') || href.endsWith('.html'))) {
        e.preventDefault()
        window.history.pushState(null, '', href)
        setPath(href)
      }
    }
    document.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('popstate', onPop)
      document.removeEventListener('click', onClick)
    }
  }, [])

  if (path === '/' || path.endsWith('index.html')) return <Home />
  if (path.includes('about') || path.endsWith('about.html')) return <About />
  if (path.includes('login') || path.endsWith('login.html')) return <Login />
  if (path.includes('capaign1') || path.includes('overview')) return <CampaignOverview />
  return <Home />
}

export default function App() {
  return <Router />
}
