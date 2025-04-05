import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import DefaultLayout from './layouts/DefaultLayout';
import EmptyLayout from './layouts/EmptyLayout';
import Auction from './pages/Auction';
import CreateAuctionPage from './pages/auction/CreateAuctionPage';
import NotFound from './pages/NotFound';

import AdminLoginPage from '@/routes/pages/auction/AdminLoginPage';
import AdminPage from '@/routes/pages/auction/AdminPage';

const router = createBrowserRouter([
    {
        element: <EmptyLayout />,
        children: [
            {
                path: '/',
                element: <CreateAuctionPage />
            },
            {
                path: '/auction/create',
                element: <CreateAuctionPage />
            },
            {
                path: '/auction/:code/admin-login',
                element: <AdminLoginPage />
            }
        ]
    },
    {
        element: <DefaultLayout />,
        children: [
            {
                path: '/auction/:code',
                element: <Auction />
            },
            {
                path: '/auction/:code/admin',
                element: <AdminPage />
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
]);

export default function Router() {
    return <RouterProvider router={router} />;
}
