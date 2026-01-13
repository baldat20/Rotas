function Card({ title, value, danger = false }) {
  return (
    <div className={`rounded-xl p-4 shadow bg-white ${danger && "border border-red-400"}`}>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

export function SummaryCards({ total, meta, foraMeta }) {
  const percentual = meta ? Math.round((total / meta) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card title="Total Geral" value={total} />
      <Card title="Meta Total" value={meta} />
      <Card title="% Atingimento" value={`${percentual}%`} />
      <Card title="Técnicos fora da meta" value={foraMeta} danger />
    </div>
  )
}
