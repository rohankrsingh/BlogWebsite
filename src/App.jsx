import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Outlet, useNavigate } from 'react-router-dom';
import BaseLayout from './BaseLayout';
import { AnimatePresence, motion } from 'framer-motion'; // Import Framer Motion components
import Loader from './components/Loader'; // Import the Loader component
import "@fontsource/poppins";
import "@fontsource/poppins/400.css"; 
import "@fontsource/poppins/700.css";
import "@fontsource/open-sans"; // Defaults to 400 weight (normal)
import "@fontsource/open-sans/400.css"; // Optionally import specific weights
import "@fontsource/open-sans/700.css"; // Optionally import bold weight
import "@fontsource/source-code-pro"; // Default weight (400)
import "@fontsource/source-code-pro/400.css"; // Optional: Regular weight
import "@fontsource/source-code-pro/700.css"; // Optional: Bold weight
import { HeroUIProvider } from '@heroui/system';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return !loading ? (
    <>
      <HeroUIProvider navigate={navigate}>
        <BaseLayout>
          <AnimatePresence>
            <motion.div
              key={location.key} // Ensure a unique key for each transition
              initial={{ opacity: 0 }} // Initial state
              animate={{ opacity: 1 }} // Animate to this state
              exit={{ opacity: 0 }} // Exit state
              transition={{ duration: 0.5 }} // Transition duration
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </BaseLayout>
      </HeroUIProvider>
    </>
  ) : (
    <Loader /> // Render the Loader component while loading
  );
}

export default App;
