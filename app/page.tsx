"use client"

import { useEffect, useState } from "react"

import { SummaryCards } from "../components/SummaryCards"
import { SummarySupervisorCards } from "../components/SummarySupervisorCards"
import { ProducaoSupervisorChart } from "../components/ProducaoSupervisorChart"
import { ProducaoChart } from "../components/ProducaoChart"
import { StatusBarChart } from "../components/StatusBarChart"
import { TabelaTecnicos } from "../components/TabelaTecnicos"
import { Filtros } from "../components/Filtros"

import { getDashboardData } from "../lib/api"

type Tecnico = {
  tecnico: string
  supervisor: string
  agendado: number
  chegada: number
  concluida: number
  despachado: number
  deslocamento: number
  execucao: number
  total: number
  meta: number
  status: string
}

export default function Dashboard() {
  // 🔹 Estados
  const [dados, setDados] = useState<Tecnico[]>([])
  const [loading, setLoading] = useState(true)
  const [supervisorSelecionado, setSupervisorSelecionado] = useState("")

  // 🔹 Busca dados da API (já tratados no Apps Script)
  useEffect(() => {
    getDashboardData()
      .then((data) => {
        const normalizado: Tecnico[] = data.map((d: any) => ({
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

  // 🔹 Supervisores únicos
  const supervisores = Array.from(
    new Set(dados.map(d => d.supervisor).filter(Boolean))
  ).sort()

  // 🔹 Filtro por supervisor
  const dadosFiltrados = supervisorSelecionado
    ? dados.filter(d => d.supervisor === supervisorSelecionado)
    : dados

  // 🔹 Indicadores
  const totalGeral = dadosFiltrados.reduce((s, d) => s + d.total, 0)

  const metaGeral = dadosFiltrados.reduce(
    (s, d) => s + (d.status === "ATIVO" ? d.meta : 0),
    0
  )

  const foraMeta = dadosFiltrados.filter(
    d => d.status === "ATIVO" && d.total < d.meta
  ).length

  const percentual = metaGeral
    ? Math.round((totalGeral / metaGeral) * 100)
    : 0

  // 🔹 Consolidação por Supervisor
  const resumoPorSupervisor = Object.values(
    dados.reduce((acc: any, d) => {
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
      {/* 🔽 Filtro */}
      <Filtros
        supervisor={supervisorSelecionado}
        setSupervisor={setSupervisorSelecionado}
        supervisores={supervisores}
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

      {/* 📊 Produção x Meta por Técnico */}
      <ProducaoChart data={dadosFiltrados} />

      {/* 📊 Ordens por Técnico (Status) */}
      <StatusBarChart data={dadosFiltrados} />

      {/* 📋 Tabela */}
      <TabelaTecnicos data={dadosFiltrados} />
    </main>
  )
}
