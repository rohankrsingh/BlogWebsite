import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Outlet, useNavigate } from 'react-router-dom';
import BaseLayout from './BaseLayout';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from './components/Loader';
import { ToastProvider } from "@heroui/react";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from '@vercel/analytics/react';
import "@fontsource/poppins";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import "@fontsource/open-sans";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import "@fontsource/source-code-pro";
import "@fontsource/source-code-pro/400.css";
import "@fontsource/source-code-pro/700.css";
import "@fontsource/comic-neue";
import "@fontsource/comic-neue/400.css";
import "@fontsource/comic-neue/700.css";

import { HeroUIProvider } from '@heroui/system';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState({
    theme: "dark",
    accentColor: "160.1 84.1% 39.4%",
    font: "poppins"
  });


  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
          setPrefs(userData.prefs)
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));

  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', prefs.accentColor);
    document.documentElement.style.setProperty('--font-family', prefs?.font);
    document.documentElement.style.setProperty('dark', prefs.theme);

  }, [prefs]);

  return !loading ? (
    <>
      <HeroUIProvider navigate={navigate}>
        <ToastProvider />
        <BaseLayout>
          <AnimatePresence>
            <motion.div
              key={location.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Outlet />
              <SpeedInsights />
              <Analytics />
            </motion.div>
          </AnimatePresence>
        </BaseLayout>
      </HeroUIProvider>
    </>
  ) : (
    <Loader />
  );
}

export default App;
