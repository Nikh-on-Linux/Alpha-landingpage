"use client"
import React from 'react';
import Link from 'next/link';

function Header() {
    return (
        <header className='w-full fixed top-0 left-0 z-50 flex items-center justify-center pt-4 px-4' >
            <div className='flex flex-row max-w-7xl w-full items-center justify-between px-6 py-4' >
                <div className='flex flex-row items-center justify-center gap-8' >
                    <div className='flex-shrink-0' >
                        <span className='font-sans text-xl md:text-2xl font-semibold tracking-tight' >Arogya AI</span>
                    </div>
                    <nav className='hidden md:block'>
                        <ul className='flex flex-row text-sm font-medium items-center gap-6 select-none cursor-pointer' >
                            <Link href={"/philosophy"} className='navitem' >Philosophy</Link>
                            <li className='navitem' >How it works</li>
                            <li className='navitem'>Contact Us</li>
                        </ul>
                    </nav>
                </div>
                <div>
                    <button className='bg-foreground text-background text-sm font-medium px-5 py-2 cursor-pointer transition-all hover:bg-foreground/90 rounded-full' >Apply</button>
                </div>
            </div>
        </header>
    )
}

export default Header