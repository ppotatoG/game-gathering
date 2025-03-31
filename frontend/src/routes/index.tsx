import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import DefaultLayout from './layouts/DefaultLayout';
import EmptyLayout from './layouts/EmptyLayout';
import Auction from './pages/Auction';
import CreateAuctionPage from './pages/auction/CreateAuctionPage';
import NotFound from './pages/NotFound';

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
            }
        ]
    },
    {
        element: <DefaultLayout />,
        children: [
            {
                path: '/auction',
                element: <Auction />
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
