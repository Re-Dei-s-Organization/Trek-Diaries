'use client'

import { Session } from 'next-auth';
//overall layout of the web app
// add global navbar here
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  session: Session
}

export const metadata = {
  title: 'TrekDiaries',
  description: 'Social media app for hikers and trekkers',
}
// export default function RootLayout({ children }: { children: ReactNode}) {
export default function RootLayout({ children, session }: IProps) {
  return (
    <html lang="en">
      <body>
        <SessionProvider session={ session }>
          { children }
        </SessionProvider>
      </body>
    </html>
  )
}
