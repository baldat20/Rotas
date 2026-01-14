type Props = {
  total: number
  meta: number
  percentual: number
  foraMeta: number
  supervisor?: string
}

export function SummaryCards({
  total,
  meta,
  percentual,
  foraMeta,
  supervisor
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card
        title={supervisor ? "Produção do Supervisor" : "Produção Total"}
        value={total}
      />
      <Card
        title={supervisor ? "Meta do Supervisor" : "Meta Total"}
        value={meta}
      />
      <Card title="% Atingimento" value={`${percentual}%`} />
      <Card
        title="Técnicos fora da meta"
        value={foraMeta}
        danger
      />
    </div>
  )
}

function Card({ title, value, danger = false }) {
  return (
    <div
      className={`rounded-xl p-4 shadow bg-white ${
        danger ? "border border-red-400" : ""
      }`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
