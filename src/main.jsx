import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthLayout, LoginComponent } from './components/index.js'
import { ThemeProvider } from "@/components/theme-provider"
import Loader from './components/Loader.jsx'

const Home = lazy(() => import('./pages/Home.jsx'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const AllPosts = lazy(() => import('./pages/AllPosts'));
const AddPost = lazy(() => import('./pages/AddPost'));
const EditPost = lazy(() => import('./pages/EditPost'));
const Post = lazy(() => import('./pages/Post'));
const Layout = lazy(() => import('./components/settings/Layout.jsx'));
const Profile = lazy(() => import('./components/settings/Profile.jsx'));
const Customization = lazy(() => import('./components/settings/customization.jsx'));
const Account = lazy(() => import('./components/settings/Account.jsx'));
const User = lazy(() => import('./pages/User.jsx'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Suspense fallback={<Loader />}>
              <Login />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Suspense fallback={<Loader />}>
              <Signup />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/all-posts",
        element: (
          <AuthLayout authentication>
            <Suspense fallback={<Loader />}>
              <AllPosts />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/add-post",
        element: (
          <AuthLayout authentication>
            <Suspense fallback={<Loader />}>
              <AddPost />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <AuthLayout authentication>
            <Suspense fallback={<Loader />}>
              <EditPost />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/post/:slug",
        element: (
          <Suspense fallback={<Loader />}>
            <Post />
          </Suspense>
        ),
      },
      {
        path: "/settings/*",
        element: (
          <Suspense fallback={<Loader />}>
            <Layout />
          </Suspense>
        ),
        children: [
          {
            path: "profile",
            element: (
              <Suspense fallback={<Loader />}>
                <Profile />
              </Suspense>
            ),
          },
          {
            path: "customization",
            element: (
              <Suspense fallback={<Loader />}>
                <Customization />
              </Suspense>
            ),
          },
          {
            path: "account",
            element: (
              <Suspense fallback={<Loader />}>
                <Account />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/:username",
        element: (
          <Suspense fallback={<Loader />}>
            <User />
          </Suspense>
        ),
      },
    ],
  },
], {
  basename: import.meta.env.VITE_APP_BASE_NAME,
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_relativeSplatPath: true,
    v7_skipActionErrorRevalidation: true,
    v7_startTransition: true,
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        
          <RouterProvider router={router} future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }} />
        

      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)