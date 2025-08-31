"use client"

import FuturisticScene from '@/components/FuturisticScene'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="h-screen relative overflow-hidden">
      <FuturisticScene />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-4 left-4 md:top-10 md:left-10 text-white z-10"
      >
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">Earth 3D</h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-4 right-4 md:bottom-10 md:right-10 text-white z-10"
      >
        <p className="text-xs md:text-sm">Piero Marcos</p>
      </motion.div>
    </div>
  )
}