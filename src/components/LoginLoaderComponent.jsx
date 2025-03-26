import { useEffect, useState } from 'react';
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
    const [userData, setUserData] = useState(null);

    useEffect(() => {

        const handleLogin = async () => {
            await new Promise(resolve => setTimeout(resolve, 200)); // Add delay of 200ms
            authService.getCurrentUser()
                .then((userData) => {
                    if (userData) {
                        console.log(userData);
                        dispatch(login({ userData }));
                        setUserData(userData);
                        
                        navigate("/");
                    } else {
                        dispatch(logout());
                    }
                })

            

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
                dispatch(login(userData));
                
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
