import { type ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head />
      <body>{children}</body>
    </html>
  )
}
