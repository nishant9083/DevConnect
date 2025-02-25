import './globals.css'
import { GeistSans } from 'geist/font/sans'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'DevConnect - Connect with Local Developers',
  description: 'Find and connect with developers in your area for collaboration and mentorship',
  keywords: ['developers', 'programming', 'collaboration', 'mentorship', 'coding'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.className} min-h-screen bg-background antialiased`}>
        <Providers>
          <div className="flex items-center min-h-screen flex-col">
            <Header />
            <main className="w-full">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}