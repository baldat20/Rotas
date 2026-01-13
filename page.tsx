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
