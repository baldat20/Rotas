"use client"

"use client"

import { useEffect, useState } from "react"

import { SummaryCards } from "../components/SummaryCards"
import { SummarySupervisorCards } from "../components/SummarySupervisorCards"
import { ProducaoSupervisorChart } from "../components/ProducaoSupervisorChart"
import { ProducaoChart } from "../components/ProducaoChart"
import { TabelaTecnicos } from "../components/TabelaTecnicos"
import { Filtros } from "../components/Filtros"

import { getDashboardData } from "../lib/api"


export default function Dashboard() {
  // 🔹 Estados
  const [dados, setDados] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [supervisorSelecionado, setSupervisorSelecionado] = useState("")
  const [data, setData] = useState("")

  // 🔹 Busca dados da API
 useEffect(() => {
  getDashboardData()
    .then((data) => {
      const normalizado = data.map((d: any) => ({
        ...d,
        "Agendado": Number(d["Agendado"]) || 0,
        "Chegada no Local": Number(d["Chegada no Local"]) || 0,
        "Concluída": Number(d["Concluída"]) || 0,
        "Despachado": Number(d["Despachado"]) || 0,
        "Em deslocamento": Number(d["Em deslocamento"]) || 0,
        "Em execução": Number(d["Em execução"]) || 0,
        "Total geral": Number(d["Total geral"]) || 0,

        // defaults para o dashboard não quebrar
        "Meta": Number(d["Meta"]) || 0,
        "Status Técnico": d["Status Técnico"] || "ATIVO"
      }))

      setDados(normalizado)
    })
    .finally(() => setLoading(false))
}, [])


  // 🔹 Filtro por supervisor
  const dadosFiltrados = supervisorSelecionado
    ? dados.filter(d => d["Supervisor"] === supervisorSelecionado)
    : dados

  // 🔹 Produção total
  const totalGeral = dadosFiltrados.reduce(
    (s, d) => s + (Number(d["Total geral"]) || 0),
    0
  )

  // 🔹 Meta total (somente ATIVOS)
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

  // 🔹 Resumo consolidado por Supervisor
  const resumoPorSupervisor = Object.values(
    dados.reduce((acc: any, d: any) => {
      const sup = d["Supervisor"] || "Sem Supervisor"

      if (!acc[sup]) {
        acc[sup] = {
          supervisor: sup,
          producao: 0,
          meta: 0,
          foraMeta: 0
        }
      }

      acc[sup].producao += Number(d["Total geral"]) || 0

      if (d["Status Técnico"] === "ATIVO") {
        const metaTec = Number(d["Meta"]) || 0
        acc[sup].meta += metaTec

        if ((Number(d["Total geral"]) || 0) < metaTec) {
          acc[sup].foraMeta += 1
        }
      }

      return acc
    }, {})
  ).map((r: any) => ({
    ...r,
    percentual: r.meta
      ? Math.round((r.producao / r.meta) * 100)
      : 0
  }))

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

      {/* 🟦 Cards + Gráfico por Supervisor */}
      {!supervisorSelecionado ? (
        <>
          <SummarySupervisorCards data={resumoPorSupervisor} />

          {/* 📊 Produção x Meta por Supervisor */}
          <ProducaoSupervisorChart data={resumoPorSupervisor} />
        </>
      ) : (
        <SummaryCards
          total={totalGeral}
          meta={metaGeral}
          percentual={percentual}
          foraMeta={foraMeta}
          supervisor={supervisorSelecionado}
        />
      )}

      {/* 📊 Gráfico Produção x Meta por Técnico */}
      <ProducaoChart data={dadosFiltrados} />

      {/* 📋 Tabela por Técnico */}
      <TabelaTecnicos data={dadosFiltrados} />
    </main>
  )
}
