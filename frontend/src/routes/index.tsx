import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Auction from './pages/Auction'
import Auth from './pages/Auth'

const router = createBrowserRouter( [
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
] )

export default function Router() {
    return <RouterProvider router={router} />
}
