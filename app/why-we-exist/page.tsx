"use client"
import React from 'react'
import { motion } from 'framer-motion'
import AccordionGallery from '@/app/components/carousel'
import DNAHelix from '@/app/components/DNAHelix'

function page() {
    const items = [
        { image: 'https://picsum.photos/id/1015/900/1200', label: 'Canyon', link: '#' },
        { image: 'https://picsum.photos/id/1018/900/1200', label: 'Ridgeline', link: '#' },
        { image: 'https://picsum.photos/id/1039/900/1200', label: 'Falls', link: '#' },
        { image: 'https://picsum.photos/id/1043/900/1200', label: 'Harbour', link: '#' },
        { image: 'https://picsum.photos/id/1044/900/1200', label: 'Skyline', link: '#' }
    ];
    return (
        <main className='w-screen h-screen overflow-hidden flex flex-row' >
            {/* Sidebar — slides in from the left on mount */}
            <motion.div
                className='relative flex-shrink-0 w-[20rem] h-full bg-background overflow-hidden'
                initial={{ x: -320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* DNA double-helix particle animation fills the whole sidebar */}
                <div className='absolute inset-0'>
                    <DNAHelix />
                </div>

                {/* Subtle right-edge gradient bridges the seam to the content panel */}
                <div className='absolute inset-y-0 right-0 w-16 pointer-events-none bg-gradient-to-r from-transparent to-background/60' />

                {/* Top + bottom fades so the helix appears to extend beyond the frame */}
                <div className='absolute inset-x-0 top-0 h-24 pointer-events-none bg-gradient-to-b from-background to-transparent' />
                <div className='absolute inset-x-0 bottom-0 h-24 pointer-events-none bg-gradient-to-t from-background to-transparent' />
            </motion.div>

            {/* Main content — slides in from the right (slight) and fades */}
            <motion.section
                className='relative w-full h-full overflow-x-hidden overflow-y-hidden flex flex-col'
                style={{ backgroundColor: '#050505' }}
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
                <header className='w-full top-0 left-0 z-50 flex items-center justify-center pt-1 px-4' >
                    <div className='flex flex-row max-w-7xl w-full items-center justify-between px-6 py-4' >
                        <div className='flex flex-row items-center justify-center gap-8' >
                            <div className='flex-shrink-0' >
                                <span className='font-sans text-xl md:text-2xl text-foreground font-semibold tracking-tight' >Arogya AI</span>
                            </div>
                            <nav className='hidden md:block'>
                                <ul className='flex flex-row text-sm font-medium items-center gap-6 select-none cursor-pointer text-foreground/70' >
                                    <li className='navitem' >Philosophy</li>
                                    <li className='navitem' >How it works</li>
                                    <li className='navitem'>Contact Us</li>
                                </ul>
                            </nav>
                        </div>
                        <div>
                            <button className='bg-foreground text-background text-sm font-medium px-5 py-2 cursor-pointer transition-all hover:bg-foreground/85 rounded-full' >Apply</button>
                        </div>
                    </div>
                </header>
                <section className='w-full px-48 pt-12 z-10 gap-10 flex flex-col gap-3 h-full overflow-y-auto' >
                    <h1 className='font-sans text-foreground font-bold text-6xl tracking-tight' >Why we Exist?</h1>
                    <div className='flex flex-col gap-4' >
                        <p className='w-full' >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illo dolor sit sint consequatur itaque. Perferendis ducimus dolor quia, id exercitationem, delectus, ipsam amet odit voluptatem optio nostrum laboriosam et quasi veniam aperiam dolore voluptates? Illo.</p>
                        <p className='w-full text-left' >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo assumenda modi, doloremque placeat soluta officia minus aut voluptate libero obcaecati totam ipsa aliquid neque pariatur magnam debitis iste quod velit laudantium optio enim, excepturi quasi voluptates dolore. Quam consequuntur, voluptatibus deleniti necessitatibus sit dolor ducimus velit natus quidem nihil reiciendis soluta dolorem voluptatum fugit sequi laborum facilis! Amet dicta deleniti, accusamus est necessitatibus laborum in architecto voluptatibus at, hic veritatis iusto repellat ipsum reiciendis. Blanditiis facere eius nostrum illo ea corporis eaque deleniti animi impedit, quae cumque rem. Harum velit similique ab ratione voluptatum facere perferendis numquam, beatae, aliquid debitis laudantium recusandae quaerat at quidem laborum optio placeat est culpa. Ipsam perspiciatis repellat libero accusantium, eum dicta accusamus veniam, dolor, voluptate veritatis porro assumenda molestias quaerat odit nulla! Sit iusto quos corrupti, magni vero nemo! Illum corrupti omnis quis minus eligendi dignissimos dolorem aut praesentium animi voluptas quam autem quisquam eum quia in, aperiam sit odio, et quos facilis, laboriosam sint? Commodi explicabo obcaecati sed. Natus incidunt hic odit vero laboriosam nam cupiditate doloremque. Voluptas, expedita? Neque accusamus, dignissimos aut sint nostrum asperiores! Exercitationem, sed! Totam at</p>
                    </div>
                    <div className='mt-20' >
                        <AccordionGallery
                            items={items}
                            defaultIndex={1}
                            expandRatio={0.52}
                            trigger="hover"
                            accentColor="#ffffff"
                            overlayColor="#060010"
                            textColor="#ffffff"
                            grayscale
                            showLabels
                            duration={0.6}
                            ease="power3.out"
                            parallax={0.5}
                            tilt={8}
                            stagger={0.06}
                            height={460}
                            gap={10}
                            radius={12}
                            orientation="horizontal"
                        />
                    </div>
                </section>
            </motion.section>
        </main>
    )
}

export default page