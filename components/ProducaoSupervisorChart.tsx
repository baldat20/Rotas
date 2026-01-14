"use client"

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts"

export function ProducaoSupervisorChart({ data }: { data: any[] }) {
  if (!data.length) return null

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-4">Produção × Meta por Supervisor</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="supervisor" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="producao" fill="#2563eb" name="Produção" />
          <Bar dataKey="meta" fill="#16a34a" name="Meta" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
