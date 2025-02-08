import { useEffect, useState } from 'react';
import { Signup as SignupComponent } from '../components';
import { Card } from '../components/ui/card';
import { useTheme } from '../components/theme-provider';
import Particles from '../components/ui/particles';
import { motion } from 'framer-motion'; // Import Framer Motion
import { TypingAnimation } from '@/components/magicui/typing-animation';

function Signup() {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-screen w-full grid grid-cols-11 grid-flow-col rounded-none p-8 space-x-6 border-none
      max-md:space-x-0 max-md:p-2">
        <Card className="relative col-span-6 overflow-hidden rounded-lg border bg-background md:shadow-xl z-0 flex items-center justify-center
        max-md:col-span-11">
          <Particles
            className="absolute inset-0 z-1 max-md:w-full"
            quantity={100}
            ease={80}
            color={color}
            refresh
          />
          <TypingAnimation duration={150} className='font-sourceCode text-8xl m-6 text-center max-md:hidden'>Join Us and Explore New Ideas!</TypingAnimation>
        </Card>
        <Card className="col-span-5 align-middle place-content-center border-none 
        max-md:absolute inset-0 left-0 max-md:bg-transparent">
          <SignupComponent />
        </Card>
      </Card>
    </motion.div>
  );
}

export default Signup;
