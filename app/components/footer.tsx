import React from 'react'

function Footer() {
    return (
        <section className='w-full relative px-80 py-25 flex items-start justify-between ' >
            <div>
                <span className='block font-sans text-3xl font-bold' >Arogya AI</span>
                <span className='block font-sans text-sm text-foreground/50 mt-2' >Copyright © 2026 Arogya AI.</span>
            </div>
            <div className='flex flex-col gap-2' >
                <span className='font-sans font-semibold text-foreground/40 select-none' >Connect on</span>
                <ul className='gap-1 flex flex-col' >
                    <li className='select-none cursor-pointer hover:text-foreground/80 hover:underline underline-offset-6' >X</li>
                    <li className='select-none cursor-pointer hover:text-foreground/80 hover:underline underline-offset-6' >Instagram</li>
                    <li className='select-none cursor-pointer hover:text-foreground/80 hover:underline underline-offset-6' >Linked In</li>
                </ul>
            </div>
            <div className='flex flex-col gap-2' >
                <span className='font-sans font-semibold text-foreground/40 select-none' >Validation</span>
                <ul className='gap-1 flex flex-col' >
                    <li className='select-none cursor-pointer hover:text-foreground/80 hover:underline underline-offset-6' >India AI Impact Summit 2026</li>
                    <li className='select-none cursor-pointer hover:text-foreground/80 hover:underline underline-offset-6' >Doctors Endorsement Letters</li>
                </ul>
            </div>
            <div className='flex flex-col gap-2' >
                <span className='font-sans font-semibold text-foreground/40 select-none' >Contact</span>
                <ul className='gap-1 flex flex-col' >
                    <li className='cursor-pointer hover:text-foreground/80 underline-offset-6' >+91 9561894119</li>
                    <li className='cursor-pointer hover:text-foreground/80  underline-offset-6' >info@arogyai.tech</li>
                </ul>
            </div>

        </section>
    )
}

export default Footer