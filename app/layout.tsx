import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EBITDA Dashboard',
  description: 'Gestisci i tuoi progetti e monitora il fatturato',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
