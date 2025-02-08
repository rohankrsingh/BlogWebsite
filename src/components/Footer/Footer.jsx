import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'
import { Card } from '../ui'
import { Github, Heart, Linkedin } from 'lucide-react'
import { FaTelegram } from "react-icons/fa";
function Footer() {
    return (
        <section className="relative overflow-hidden ">
            <Card className="relative w-full rounded-none">
                <div className='flex justify-between items-center py-8 px-6 max-sm:flex-col space-y-4'>
                    <div className="flex items-center space-x-2">
                        <Logo />
                    </div>
                    <nav className=" md:mt-0 flex space-x-6 text-foreground-600">
                        <h5>Made with <span className='text-red-500'>&#10084;</span> by Rohan</h5>
                    </nav>
                    <div className="mt-4 md:mt-0 flex space-x-4">
                        <a href="#" className=" hover:text-primary-700">
                            <Github size={20} />
                        </a>
                        <a href="#" className=" hover:text-primary-700">
                            <Linkedin size={20} />
                        </a>
                        <a href="#" className=" hover:text-primary-700">
                            <FaTelegram size={20} />
                        </a>
                    </div>
                </div>
                <p className='text-sm text-muted-foreground text-center mb-4'>Discover insights, stories, and tips from our community.</p>
            </Card>

        </section>
    )
}

export default Footer