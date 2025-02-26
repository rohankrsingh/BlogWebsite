import { Moon, Sun } from "lucide-react";
import { useTheme } from "../theme-provider"; // Import useTheme from theme-provider


import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export function ThemeTogle() {
  const { theme, setTheme } = useTheme()

  return (
        <Button variant="outline" size="icon" onClick={() => { 

            const newTheme = theme === "dark" ? "light" : "dark"; // Determine new theme
            setTheme(newTheme); // Set the new theme

            // Removed redundant theme toggle

        }}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
  )
}
