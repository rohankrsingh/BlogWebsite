import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home.jsx'
import { AuthLayout, LoginComponent } from './components/index.js'
import { ThemeProvider } from "@/components/theme-provider"
import AddPost from "./pages/AddPost";
import Signup from './pages/Signup'
import Login from './pages/Login'
import EditPost from "./pages/EditPost";
import Post from "./pages/Post";
import Layout from './components/settings/Layout.jsx'
import Profile from './components/settings/Profile.jsx'
import AllPosts from "./pages/AllPosts";
import Account from './components/settings/Account.jsx'
import Customization from './components/settings/customization.jsx'
import User from './pages/User.jsx'
import LoginLoaderComponent from './components/LoginLoaderComponent.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/all-posts",
        element: (
          <AuthLayout authentication>
            {" "}
            <AllPosts />
          </AuthLayout>
        ),
      },
      {
        path: "/add-post",
        element: (
          <AuthLayout authentication>
            {" "}
            <AddPost />
          </AuthLayout>
        ),
      },
      {
        path: "/loader",
        element: (
          <LoginLoaderComponent />
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <AuthLayout authentication>
            {" "}
            <EditPost />
          </AuthLayout>
        ),
      },
      {
        path: "/post/:slug",
        element: <Post />,
      },
      // New Settings Route
      {
        path: "/settings",
        element: <Layout />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "customization", element: <Customization /> },
          { path: "account", element: <Account /> }
        ],
      },
      // user Dashboard
      {
        path: "/:username",
        element: <User />
      }
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