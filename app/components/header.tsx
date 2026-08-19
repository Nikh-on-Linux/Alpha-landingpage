"use client"
import React, { useState } from 'react';
import Link from 'next/link';

function Header({ className = "" }: { className?: string }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className={`fixed top-0 left-0 w-full z-50 flex flex-col items-center justify-center px-6 md:px-12 transition-all duration-300 ${className}`}>
            <div className='flex flex-row w-full items-center justify-between py-6 relative z-50'>
                
                {/* Logo */}
                <div className='flex flex-row items-center gap-8'>
                    <Link href={"/"} onClick={() => setIsMobileMenuOpen(false)} className='font-sans text-lg md:text-xl font-bold tracking-tight text-foreground/90 hover:text-foreground transition-colors'>
                        Arogya AI
                    </Link>
                    
                    {/* Desktop Nav */}
                    <nav className='hidden md:block'>
                        <ul className='flex flex-row text-xs md:text-sm font-medium items-center gap-8 text-foreground/70'>
                            <li>
                                <Link href={"/why-we-exist"} className='hover:text-foreground transition-colors tracking-wide'>
                                    Philosophy
                                </Link>
                            </li>
                            <li>
                                <Link href={"/how-it-works"} className='hover:text-foreground transition-colors tracking-wide'>
                                    How it works
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* Right Side (CTA & Mobile Menu Toggle) */}
                <div className='flex items-center gap-4'>
                    <button 
                        onClick={() => window.open("https://forms.gle/ZcykQ29xW15HQCLh7", "_blank")} 
                        className='bg-foreground text-background text-xs md:text-sm font-semibold px-5 py-2 hover:scale-105 active:scale-95 transition-all rounded-full'
                    >
                        Apply
                    </button>
                    
                    {/* Mobile Hamburger */}
                    <button 
                        className="md:hidden flex flex-col justify-center items-center w-6 h-6 space-y-1.5 focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span className={`block w-5 h-0.5 bg-foreground transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`block w-5 h-0.5 bg-foreground transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                        <span className={`block w-5 h-0.5 bg-foreground transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div 
                className={`fixed inset-0 bg-background/95 backdrop-blur-2xl flex flex-col items-center justify-center transition-all duration-500 z-40 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <nav className="flex flex-col items-center gap-8 text-2xl font-semibold">
                    <Link href={"/"} onClick={() => setIsMobileMenuOpen(false)} className='text-foreground hover:text-foreground/70 transition-colors'>
                        Home
                    </Link>
                    <Link href={"/why-we-exist"} onClick={() => setIsMobileMenuOpen(false)} className='text-foreground hover:text-foreground/70 transition-colors'>
                        Philosophy
                    </Link>
                    <Link href={"/how-it-works"} onClick={() => setIsMobileMenuOpen(false)} className='text-foreground hover:text-foreground/70 transition-colors'>
                        How it works
                    </Link>
                </nav>
            </div>
        </header>
    )
}

export default Header
