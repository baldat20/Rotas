"use client"

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts"

export function ProducaoChart({ data }: { data: any[] }) {
  if (!data.length) return null

  const chartData = data.map(t => ({
    tecnico: t.tecnico,
    producao: t.total,
    meta: t.meta
  }))

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-4">Produção × Meta por Técnico</h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <XAxis dataKey="tecnico" hide />
          <YAxis />
          <Tooltip />
          <Bar dataKey="producao" fill="#2563eb" name="Produção" />
          <Bar dataKey="meta" fill="#16a34a" name="Meta" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
