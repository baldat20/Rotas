import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line
} from "recharts"

export function ProducaoChart({ data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow h-96">
      <h2 className="font-semibold mb-2">
        Produção × Meta por Técnico
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="Nome do Técnico" hide />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Total geral" />
          <Line
            type="monotone"
            dataKey="Meta"
            strokeWidth={3}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
