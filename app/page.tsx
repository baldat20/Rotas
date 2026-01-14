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

  // 🔹 Busca e NORMALIZA dados da API
  useEffect(() => {
    getDashboardData()
      .then((data) => {
        const normalizado = data.map((d: any) => ({
          // 🔑 nomes usados pelos componentes
          tecnico: d["Nome do Técnico"],
          supervisor: d["Supervisor"],

          agendado: Number(d["Agendado"]) || 0,
          chegada: Number(d["Chegada no Local"]) || 0,
          concluida: Number(d["Concluída"]) || 0,
          despachado: Number(d["Despachado"]) || 0,
          deslocamento: Number(d["Em deslocamento"]) || 0,
          execucao: Number(d["Em execução"]) || 0,

          total: Number(d["Total geral"]) || 0,
          meta: Number(d["Meta"]) || 0,
          status: d["Status Técnico"] || "ATIVO"
        }))

        setDados(normalizado)
      })
      .finally(() => setLoading(false))
  }, [])

  // 🔹 Filtro por supervisor (já usando dados normalizados)
  const dadosFiltrados = supervisorSelecionado
    ? dados.filter(d => d.supervisor === supervisorSelecionado)
    : dados

  // 🔹 Produção total
  const totalGeral = dadosFiltrados.reduce(
    (s, d) => s + d.total,
    0
  )

  // 🔹 Meta total (somente ATIVOS)
  const metaGeral = dadosFiltrados.reduce(
    (s, d) => s + (d.status === "ATIVO" ? d.meta : 0),
    0
  )

  // 🔹 Técnicos fora da meta
  const foraMeta = dadosFiltrados.filter(
    d => d.status === "ATIVO" && d.total < d.meta
  ).length

  // 🔹 Percentual de atingimento
  const percentual = metaGeral
    ? Math.round((totalGeral / metaGeral) * 100)
    : 0

  // 🔹 Resumo consolidado por Supervisor
  const resumoPorSupervisor = Object.values(
    dados.reduce((acc: any, d: any) => {
      const sup = d.supervisor || "Sem Supervisor"

      if (!acc[sup]) {
        acc[sup] = {
          supervisor: sup,
          producao: 0,
          meta: 0,
          foraMeta: 0
        }
      }

      acc[sup].producao += d.total

      if (d.status === "ATIVO") {
        acc[sup].meta += d.meta
        if (d.total < d.meta) acc[sup].foraMeta += 1
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

      {/* 🟦 Cards */}
      {!supervisorSelecionado ? (
        <>
          <SummarySupervisorCards data={resumoPorSupervisor} />
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

      {/* 📊 Gráfico por Técnico */}
      <ProducaoChart data={dadosFiltrados} />

      {/* 📋 Tabela */}
      <TabelaTecnicos data={dadosFiltrados} />
    </main>
  )
}
