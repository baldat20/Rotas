type Props = {
  data: {
    supervisor: string
    producao: number
    meta: number
    percentual: number
    foraMeta: number
  }[]
}

export function SummarySupervisorCards({ data }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {data.map(s => (
        <div
          key={s.supervisor}
          className="bg-white rounded-xl shadow p-4"
        >
          <h3 className="font-semibold text-lg mb-2">
            {s.supervisor}
          </h3>

          <p>Produção: <b>{s.producao}</b></p>
          <p>Meta: <b>{s.meta}</b></p>
          <p>Atingimento: <b>{s.percentual}%</b></p>
          <p className="text-red-600">
            Fora da meta: <b>{s.foraMeta}</b>
          </p>
        </div>
      ))}
    </div>
  )
}
