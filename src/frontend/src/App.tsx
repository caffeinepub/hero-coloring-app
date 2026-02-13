import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import StudioPage from './pages/StudioPage';
import AppLayout from './components/layout/AppLayout';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gallery',
  component: GalleryPage,
});

const studioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/studio/$heroId',
  component: StudioPage,
});

const routeTree = rootRoute.addChildren([indexRoute, galleryRoute, studioRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
