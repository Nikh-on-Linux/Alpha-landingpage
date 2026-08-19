import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full relative z-50 bg-transparent py-8 px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-foreground/40 text-[10px] font-mono uppercase tracking-[0.15em] mt-auto">
            <div className="flex flex-col items-start gap-1">
                <span className="font-sans font-bold text-sm text-foreground/80 tracking-tight normal-case">Arogya AI</span>
                <span className="text-foreground/30">&copy; {new Date().getFullYear()} Arogya AI. All rights reserved.</span>
            </div>
            
            <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-3">
                <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
                <span className="text-foreground/20">|</span>
                <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
                <span className="text-foreground/20">|</span>
                <Link href="https://x.com" target="_blank" className="hover:text-foreground transition-colors">X</Link>
                <span className="text-foreground/20">|</span>
                <Link href="https://linkedin.com" target="_blank" className="hover:text-foreground transition-colors">LinkedIn</Link>
                <span className="text-foreground/20">|</span>
                <Link href="tel:+919561894119" className="hover:text-foreground transition-colors lowercase tracking-normal font-bold text-foreground/60">+91 9561894119</Link>
                <span className="text-foreground/20">|</span>
                <Link href="mailto:info@arogyai.tech" className="hover:text-foreground transition-colors lowercase tracking-normal font-bold text-foreground/60">info@arogyai.tech</Link>
            </div>
        </footer>
    );
}