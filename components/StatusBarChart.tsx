"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

export function StatusBarChart({ data }: { data: any[] }) {
  if (!data.length) return null

  // 🔹 Formata dados para o gráfico
  const chartData = data.map(t => ({
    tecnico: t.tecnico,
    Agendado: t.agendado,
    "Chegada no Local": t.chegada,
    Concluída: t.concluida,
    "Em execução": t.execucao,
    Despachado: t.despachado
  }))

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-4">
        Ordens por Técnico (Status)
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="tecnico"
            interval={0}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* 🔹 BARRAS EMPILHADAS */}
          <Bar dataKey="Agendado" stackId="a" fill="#2563eb" />
          <Bar dataKey="Chegada no Local" stackId="a" fill="#f59e0b" />
          <Bar dataKey="Concluída" stackId="a" fill="#16a34a" />
          <Bar dataKey="Em execução" stackId="a" fill="#9333ea" />
          <Bar dataKey="Despachado" stackId="a" fill="#dc2626" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
