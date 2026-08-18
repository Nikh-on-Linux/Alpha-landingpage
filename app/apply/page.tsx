"use client"
import React from 'react'
import Header from '../components/header'
import Link from 'next/link'
import Input from '../components/Input'

function Page() {
    return (
        <main className='w-screen h-screen overflow-hidden flex flex-col items-center' >
            <header className='w-full z-50 flex items-center justify-center pt-4 px-4' >
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
                </div>
            </header>
            <section className='flex flex-col items-center py-12 h-full' >
                <h1 className='font-sans text-4xl font-bold' >Become one of our early user.</h1>
                <p className='font-sans text-foreground/70 text-center mt-4 max-w-[470px]' >By applying you will get early access to our product and become a part in further developments.</p>
                <div className='flex flex-col gap-8 py-24' >
                    <div className='flex items-center justify-center gap-4' >
                        <Input placeholder='First Name' />
                        <Input placeholder='Last Name' />
                    </div>
                    <Input placeholder='Email' className={"w-full"} />
                    <button className='bg-foreground text-background border border-foreground px-4 py-2 rounded-full cursor-pointer hover:bg-background hover:text-foreground transition-all' >Apply for Pilot</button>
                </div>
            </section>
        </main>
    )
}

export default Page