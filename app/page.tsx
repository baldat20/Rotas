"use client"

import { useState } from "react"
import { SummaryCards } from "@/components/SummaryCards"
import { ProducaoChart } from "@/components/ProducaoChart"
import { TabelaTecnicos } from "@/components/TabelaTecnicos"
import { Filtros } from "@/components/Filtros"
import { dadosMock } from "@/lib/mockData"

export default function Dashboard() {
  const [supervisor, setSupervisor] = useState("")
  const [data, setData] = useState("")

  const dados = dadosMock.filter(d =>
    !supervisor || d.supervisor === supervisor
  )

  const total = dados.reduce((s, d) => s + d.total, 0)
  const meta = dados.reduce((s, d) => s + d.meta, 0)
  const foraMeta = dados.filter(d => d.total < d.meta).length

  return (
    <main className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <Filtros
        supervisor={supervisor}
        setSupervisor={setSupervisor}
        data={data}
        setData={setData}
      />

      <SummaryCards total={total} meta={meta} foraMeta={foraMeta} />

      <ProducaoChart data={dados} />

      <TabelaTecnicos data={dados} />
    </main>
  )
}

useEffect(() => {
  getDashboardData().then(setDados)
}, [])

const totalGeral = dadosFiltrados.reduce(
  (s, d) => s + (Number(d["Total geral"]) || 0),
  0
)

const metaGeral = dadosFiltrados.reduce(
  (s, d) => s + (Number(d["Meta"]) || 0),
  0
)

const foraMeta = dadosFiltrados.filter(
  d => Number(d["Total geral"]) < Number(d["Meta"])
).length

const percentual = metaGeral
  ? Math.round((totalGeral / metaGeral) * 100)
  : 0
