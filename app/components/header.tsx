import React from 'react'

function Header() {
    return (
        <header className='w-[100rem] mt-2 z-10 flex rounded-lg items-center backdrop-blur-sm' >
            <div className='flex flex-row max-w-[95rem] rounded-2xl w-full items-center gap-3 justify-between px-5 py-4.5' >
                <div className='flex flex-row items-center justify-center gap-8' >
                    <div className='' >
                        <span className='font-sans text-2xl font-semibold' >Arogya Ai</span>
                    </div>
                    <nav>
                        <ul className='flex flex-row text-md items-center gap-5 select-none cursor-pointer font-sans' >
                            <li className='font-sans navitem' >Philoshy</li>
                            <li className='font-sans navitem' >How it works</li>
                            <li className='font-sans navitem'>Contact Us</li>
                        </ul>
                    </nav>
                </div>
                <div>
                    <button className='bg-foreground text-background px-4.5 py-1.5 cursor-pointer transition-all hover:bg-foreground/90 rounded-md' >Apply</button>
                </div>
            </div>
        </header>
    )
}

export default Header