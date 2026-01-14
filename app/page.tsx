"use client"

import { useEffect, useState } from "react"

import { SummaryCards } from "../components/SummaryCards"
import { SummarySupervisorCards } from "../components/SummarySupervisorCards"
import { ProducaoSupervisorChart } from "../components/ProducaoSupervisorChart"
import { ProducaoChart } from "../components/ProducaoChart"
import { TabelaTecnicos } from "../components/TabelaTecnicos"
import { Filtros } from "../components/Filtros"
import { StatusBarChart } from "../components/StatusBarChart"

import { getDashboardData } from "../lib/api"

/* =======================
   TIPAGEM
======================= */
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

/* =======================
   TÍTULO COM GRADIENTE
======================= */
function SectionTitle({ children }: { children: string }) {
  return (
    <div
      className="text-center text-white font-semibold py-2 rounded-full mb-4"
      style={{
        background: "linear-gradient(90deg, #ffde59, #ff914d, #ff914d)"
      }}
    >
      {children}
    </div>
  )
}

/* =======================
   PAGE
======================= */
export default function Dashboard() {
  const [dados, setDados] = useState<Tecnico[]>([])
  const [loading, setLoading] = useState(true)
  const [supervisorSelecionado, setSupervisorSelecionado] = useState("")

  /* 🔹 BUSCA DADOS (BACKEND 100% VALIDADO) */
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

  /* 🔹 SUPERVISORES */
  const supervisores = Array.from(
    new Set(dados.map(d => d.supervisor).filter(Boolean))
  ).sort()

  /* 🔹 FILTRO */
  const dadosFiltrados = supervisorSelecionado
    ? dados.filter(d => d.supervisor === supervisorSelecionado)
    : dados

  /* 🔹 KPIs */
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

  /* 🔹 CONSOLIDADO POR SUPERVISOR */
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
    <main
      className="min-h-screen p-6 space-y-6"
      style={{ backgroundColor: "#8dc9eb" }}
    >
      {/* 🔵 BARRA SUPERIOR */}
      <div
        className="rounded-xl p-6 shadow"
        style={{ backgroundColor: "#ddf0fa" }}
      >
        <Filtros
          supervisor={supervisorSelecionado}
          setSupervisor={setSupervisorSelecionado}
          supervisores={supervisores}
        />

        {supervisorSelecionado && (
          <div className="mt-4">
            <SummaryCards
              total={totalGeral}
              meta={metaGeral}
              percentual={percentual}
              foraMeta={foraMeta}
              supervisor={supervisorSelecionado}
            />
          </div>
        )}
      </div>

      {/* 🟠 SUPERVISOR */}
      {!supervisorSelecionado && (
        <>
          <SectionTitle>Produção × Meta por Supervisor</SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-4 shadow">
              <SummarySupervisorCards data={resumoPorSupervisor} />
            </div>

            <div className="bg-white rounded-xl p-4 shadow">
              <ProducaoSupervisorChart data={resumoPorSupervisor} />
            </div>
          </div>
        </>
      )}

      {/* 🟠 TÉCNICO */}
      <SectionTitle>Produção × Meta por Técnico</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-4 shadow overflow-auto">
          <TabelaTecnicos data={dadosFiltrados} />
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <StatusBarChart data={dadosFiltrados} />
        </div>
      </div>
    </main>
  )
}
