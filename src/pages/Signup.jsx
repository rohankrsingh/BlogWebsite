import { useEffect, useState} from 'react'
import { Signup as SignupComponent } from '../components'
import { Card } from '@/components/ui/card'
import { useTheme } from '@/components/theme-provider'
import Particles from '@/components/ui/particles'

function Signup() {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff")

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

  return (
    <Card className="h-screen grid grid-cols-11 grid-flow-col  rounded-none p-8 space-x-6">
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


  )
}

export default Signup