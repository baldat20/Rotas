"use client"

import { useEffect, useState } from "react"
import { SummaryCards } from "@/components/SummaryCards"
import { ProducaoChart } from "@/components/ProducaoChart"
import { TabelaTecnicos } from "@/components/TabelaTecnicos"
import { Filtros } from "@/components/Filtros"
import { getDashboardData } from "@/lib/api"

export default function Dashboard() {
  // 🔹 Estados
  const [dados, setDados] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [supervisorSelecionado, setSupervisorSelecionado] = useState("")
  const [data, setData] = useState("")

  // 🔹 Busca dados da API
  useEffect(() => {
    getDashboardData()
      .then(setDados)
      .finally(() => setLoading(false))
  }, [])

  // 🔹 Filtro por supervisor
  const dadosFiltrados = supervisorSelecionado
    ? dados.filter(
        d => d["Supervisor"] === supervisorSelecionado
      )
    : dados

  // 🔹 Cálculos — Produção
  const totalGeral = dadosFiltrados.reduce(
    (s, d) => s + (Number(d["Total geral"]) || 0),
    0
  )

  // 🔹 Cálculos — Meta (somente ATIVOS)
  const metaGeral = dadosFiltrados.reduce(
    (s, d) =>
      s +
      (d["Status Técnico"] === "ATIVO"
        ? Number(d["Meta"]) || 0
        : 0),
    0
  )

  // 🔹 Técnicos fora da meta (somente ATIVOS)
  const foraMeta = dadosFiltrados.filter(
    d =>
      d["Status Técnico"] === "ATIVO" &&
      Number(d["Total geral"]) < Number(d["Meta"])
  ).length

  // 🔹 Percentual de atingimento
  const percentual = metaGeral
    ? Math.round((totalGeral / metaGeral) * 100)
    : 0

  if (loading) {
    return (
      <main className="p-6">
        <p>Carregando dashboard...</p>
      </main>
    )
  }

  return (
    <main className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 🔽 Filtros */}
      <Filtros
        supervisor={supervisorSelecionado}
        setSupervisor={setSupervisorSelecionado}
        data={data}
        setData={setData}
      />

      {/* 🟦 Cards de resumo */}
      <SummaryCards
        total={totalGeral}
        meta={metaGeral}
        percentual={percentual}
        foraMeta={foraMeta}
        supervisor={supervisorSelecionado}
      />

      {/* 📊 Gráfico Produção x Meta */}
      <ProducaoChart data={dadosFiltrados} />

      {/* 📋 Tabela por Técnico */}
      <TabelaTecnicos data={dadosFiltrados} />
    </main>
  )
}
