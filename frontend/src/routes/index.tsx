import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import DefaultLayout from './layouts/DefaultLayout';
import Auction from './pages/Auction';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
    {
        element: <DefaultLayout />,
        children: [
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
            },
            {
                path: '*',
                element: <NotFound />
            }
        ]
    }
]);

export default function Router() {
    return <RouterProvider router={router} />;
}
