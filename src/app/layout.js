import { Inter } from 'next/font/google'

import '../../css/globals.css'
import '../../css/styles1.css'
import '../../css/styles2.css'
import '../../css/media.css'

import { NextAuthProvider } from '../../components/middlewareAuths/nextAuthProvider'
import {Analytics} from '@vercel/analytics/react'
// import 'bootstrap/dist/css/bootstrap.min.css'
import '../../css/bootstrap/css/bootstrap.min.css'
// import '../../css/bootstrap/js/bootstrap.min.js'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import {config} from '@fortawesome/fontawesome-svg-core'

config.autoAddCss=false

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Butchery System - Home',
  description: 'P.O.S solution for your butchery business',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/logo.ico',
        href: '/logo.ico',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/logo.ico',
        href: '/logo.ico',
      },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={'bg-primary'}>
      <NextAuthProvider>
        {children}
        <Analytics />
      </NextAuthProvider>
      </body>
    </html>
  )
}

