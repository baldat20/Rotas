export async function getDashboardData() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
    cache: "no-store"
  })

  if (!res.ok) throw new Error("Erro ao buscar dados")

  return res.json()
}
