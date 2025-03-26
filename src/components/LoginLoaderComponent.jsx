import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import authService from '../appwrite/auth';
import service from '../appwrite/config';
import { login as authLogin } from '../store/authSlice';
import { motion } from 'framer-motion';
import { Spinner } from '@heroui/react';

function LoginLoaderComponent() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleLogin = async () => {
            const userData = useSelector((state) => state.auth.userData);
            console.log(userData);

            if (userData) {
                const existingProfile = await service.getUserProfile(userData.$id);
                if (!existingProfile) {
                    await service.createUserProfile({
                        userId: userData.$id,
                        name: userData.name,
                        createdAt: userData.$createdAt,
                        email: userData.email
                    });
                }
                
                navigate("/");
            }
        };
        handleLogin();
    }, [dispatch, navigate]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%',
                backgroundColor: 'var(--card)',
            }}
        >
            <div className="loader"><Spinner color="default" label="Loging you in..." /></div>
        </motion.div>
    );
}

export default LoginLoaderComponent;
