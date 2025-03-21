import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Auth from './pages/Auth'
import Auction from './pages/Auction'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Auth />
  },
  {
    path: '/Auth',
    element: <Auth />
  },
  {
    path: '/auction',
    element: <Auction />
  }
])

export default function Router() {
  return <RouterProvider router={router} />
}
