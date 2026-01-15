import "./globals.css"

export const metadata = {
  title: "Dashboard PG",
  description: "Produção x Meta"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="w-full min-h-screen m-0 p-0 overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
