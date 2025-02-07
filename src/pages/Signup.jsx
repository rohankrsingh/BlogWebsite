import { useEffect, useState } from 'react';
import { Signup as SignupComponent } from '../components';
import { Card } from '../components/ui/card';
import { useTheme } from '../components/theme-provider';
import Particles from '../components/ui/particles';
import { motion } from 'framer-motion'; // Import Framer Motion

function Signup() {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

  return (
    <motion.div
      initial={{ opacity: 0 }} // Initial state
      animate={{ opacity: 1 }} // Animate to this state
      exit={{ opacity: 0 }} // Exit state
      transition={{ duration: 0.5 }} // Transition duration
    >
      <Card className="h-screen w-full grid grid-cols-11 grid-flow-col rounded-none p-8 space-x-6 border-none">
        <Card className="relative col-span-6 overflow-hidden rounded-lg border bg-background md:shadow-xl z-0">
          <Particles
            className="absolute inset-0 z-1"
            quantity={100}
            ease={80}
            color={color}
            refresh
          />
        </Card>
        <Card className="col-span-5 align-middle place-content-center border-none">
          <SignupComponent />
        </Card>
      </Card>
    </motion.div>
  );
}

export default Signup;
