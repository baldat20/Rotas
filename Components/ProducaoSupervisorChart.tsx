import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line
} from "recharts"

type Props = {
  data: {
    supervisor: string
    producao: number
    meta: number
  }[]
}

export function ProducaoSupervisorChart({ data }: Props) {
  return (
    <div className="bg-white p-4 rounded-xl shadow h-96">
      <h2 className="font-semibold mb-2">
        Produção × Meta por Supervisor
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="supervisor" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="producao" />
          <Line
            type="monotone"
            dataKey="meta"
            strokeWidth={3}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
