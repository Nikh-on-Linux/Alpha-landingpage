"use client"
import { motion } from 'framer-motion'

/**
 * template.tsx — re-mounts on every navigation in Next.js App Router.
 * This is what makes transitions "persistent": the animation always fires
 * whether you're going forward or backward between pages.
 *
 * Using a full-size wrapper (not display:contents) so framer-motion
 * can apply translate/opacity transforms correctly.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex flex-col flex-1 min-h-full"
    >
      {children}
    </motion.div>
  )
}
