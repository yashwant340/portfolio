import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import { About } from './pages/About'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { ProjectPage } from './pages/ProjectPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/projects/:slug', element: <ProjectPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
