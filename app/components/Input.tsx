"use client"
import React from 'react'

function Input({ placeholder, className = "" }: { placeholder: string, className?:String }) {
    return (
        <div className={` ${className} relative inp border-b border-foreground/30`} >
            <input type="text" placeholder={placeholder} className='outline-none w-full border-foreground/80 px-2 py-2' />
        </div>
    )
}

export default Input