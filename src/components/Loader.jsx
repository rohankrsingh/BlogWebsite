import React from 'react';
import { motion } from 'framer-motion';
import { Spinner } from '@heroui/react';

const Loader = () => {
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
      <div className="loader"><Spinner color="default" label="Loading..." /></div> 
    </motion.div>
  );
};

export default Loader;
