"use client"

import { useEffect, useState } from "react"

import { SummarySupervisorCards } from "../components/SummarySupervisorCards"
import { ProducaoSupervisorChart } from "../components/ProducaoSupervisorChart"
import { StatusBarChart } from "../components/StatusBarChart"
import { TabelaTecnicos } from "../components/TabelaTecnicos"
import { Filtros } from "../components/Filtros"

import { getDashboardData } from "../lib/api"

/* =======================
   TIPAGENS
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

type SupervisorResumo = {
  supervisor: string
  producao: number
  meta: number
  percentual: number
  foraMeta: number
}

/* =======================
   TÍTULO ESTILO PILL
======================= */
function PillTitle({
  children,
  color
}: {
  children: string
  color: "yellow" | "red"
}) {
  return (
    <div
      className="mx-auto w-fit px-6 py-2 text-sm font-semibold rounded-full mb-4"
      style={{
        backgroundColor: color === "yellow" ? "#ffcc4d" : "#ff3b30",
        color: "#000"
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

  /* =======================
     BUSCA DE DADOS
  ======================= */
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

  /* =======================
     SUPERVISORES
  ======================= */
  const supervisores = Array.from(
    new Set(dados.map(d => d.supervisor).filter(Boolean))
  ).sort()

  /* =======================
     FILTRO
  ======================= */
  const dadosFiltrados = supervisorSelecionado
    ? dados.filter(d => d.supervisor === supervisorSelecionado)
    : dados

  /* =======================
     KPIs
  ======================= */
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

  /* =======================
     RESUMO POR SUPERVISOR
  ======================= */
  const resumoPorSupervisor: SupervisorResumo[] = Object.values(
    dados.reduce((acc: Record<string, SupervisorResumo>, d) => {
      const sup = d.supervisor || "Sem Supervisor"

      if (!acc[sup]) {
        acc[sup] = {
          supervisor: sup,
          producao: 0,
          meta: 0,
          foraMeta: 0,
          percentual: 0
        }
      }

      acc[sup].producao += d.total

      if (d.status === "ATIVO") {
        acc[sup].meta += d.meta
        if (d.total < d.meta) acc[sup].foraMeta += 1
      }

      return acc
    }, {})
  ).map((r) => ({
    ...r,
    percentual: r.meta
      ? Math.round((r.producao / r.meta) * 100)
      : 0
  }))

  /* =======================
     LOADING
  ======================= */
  if (loading) {
    return (
      <main className="p-6">
        <p>Carregando dashboard...</p>
      </main>
    )
  }

  /* =======================
     RENDER
  ======================= */
  return (
    <main
      className="min-h-screen p-6 space-y-8"
      style={{ backgroundColor: "#8dc9eb" }}
    >
      {/* 🔵 TOPO */}
      <div
        className="rounded-xl p-6 shadow space-y-4"
        style={{ backgroundColor: "#bfe4f4" }}
      >
        <div className="flex items-center gap-4">
          <span className="font-semibold">Supervisão</span>

          <Filtros
            supervisor={supervisorSelecionado}
            setSupervisor={setSupervisorSelecionado}
            supervisores={supervisores}
          />
        </div>

        {supervisorSelecionado && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
            <div>Produção: <strong>{totalGeral}</strong></div>
            <div>Meta: <strong>{metaGeral}</strong></div>
            <div>Atingimento: <strong>{percentual}%</strong></div>
            <div>Fora da meta: <strong>{foraMeta}</strong></div>
          </div>
        )}
      </div>

      {/* 🟡 SUPERVISOR */}
      {!supervisorSelecionado && (
        <>
          <PillTitle color="yellow">
            Produção × Meta por Supervisor
          </PillTitle>

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

      {/* 🔴 TÉCNICO */}
      <PillTitle color="red">
        Produção × Meta por Técnico
      </PillTitle>

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
