import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'
import { Card } from '../ui'
import { Github, Heart, Linkedin } from 'lucide-react'
import { FaTelegram } from "react-icons/fa";
function Footer() {
    return (
        <section className="relative overflow-hidden ">
            <Card className="py-4 relative w-full rounded-none border-0 border-t-small">
                <div className='flex justify-between items-center py-4 px-6 max-sm:flex-col space-y-4'>
                    <div className="flex items-center space-x-2">
                        <Logo />
                    </div>
                    <nav className=" md:mt-0 flex space-x-6 text-foreground-600">
                        <h5>Made with <span className='text-red-500'>&#10084;</span> by Rohan</h5>
                    </nav>
                    <div className="mt-4 md:mt-0 flex space-x-4">
                        <a href="https://github.com/rohankrsingh" target='_new' className=" hover:text-primary-700">
                            <Github size={20} />
                        </a>
                        <a href="https://www.linkedin.com/in/rohan-kr-singh/" target='_new' className=" hover:text-primary-700">
                            <Linkedin size={20} />
                        </a>
                        <a href="https://t.me/rohankrsingh125" target='_new' className=" hover:text-primary-700">
                            <FaTelegram size={20} />
                        </a>
                    </div>
                </div>
                <p className='text-sm text-muted-foreground text-center'>Discover insights, stories, and tips from our community.</p>
            </Card>

        </section>
    )
}

export default Footer