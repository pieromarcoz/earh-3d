import './globals.css'
import { JetBrains_Mono } from 'next/font/google'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata = {
  title: 'Piero Marcos - 3D Earth Visualization',
  description: 'Interactive photorealistic Earth visualization built with Next.js, React Three Fiber, and Three.js featuring dynamic lighting and real-time rendering',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${jetbrainsMono.className}`}>
      <body className="bg-black text-white font-mono">{children}</body>
    </html>
  )
}