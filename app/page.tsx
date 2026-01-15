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
     FILTRO POR SUPERVISOR
  ======================= */
  const dadosFiltrados = supervisorSelecionado
    ? dados.filter(d => d.supervisor === supervisorSelecionado)
    : dados

  /* =======================
     FILTRO DE ROTA (META > 0)
  ======================= */
  const dadosComRota = dadosFiltrados.filter(d => d.meta > 0)

  /* =======================
     KPIs
  ======================= */
  const totalGeral = dadosComRota.reduce((s, d) => s + d.total, 0)

  const metaGeral = dadosComRota.reduce(
    (s, d) => s + (d.status === "ATIVO" ? d.meta : 0),
    0
  )

  const foraMeta = dadosComRota.filter(
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
      if (d.meta === 0) return acc

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
      <main className="min-h-screen flex items-center justify-center">
        <p>Carregando dashboard...</p>
      </main>
    )
  }

  /* =======================
     RENDER
  ======================= */
  return (
    <main
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: "#8dc9eb" }}
    >
      {/* 🔵 TOPO */}
      <div
        className="p-6 shadow space-y-4"
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

      {/* 🔽 CONTEÚDO FLEXÍVEL */}
      <div className="flex-1 flex flex-col space-y-8">
        {/* 🟡 SUPERVISOR */}
        {!supervisorSelecionado && (
          <>
            <PillTitle color="yellow">
              Produção × Meta por Supervisor
            </PillTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pb-6 flex-1">
          <div className="bg-white rounded-xl p-4 shadow overflow-auto">
            <TabelaTecnicos data={dadosComRota} />
          </div>

          <div className="bg-white rounded-xl p-4 shadow flex flex-col flex-1">
            <StatusBarChart data={dadosComRota} />
          </div>
        </div>
      </div>
    </main>
  )
}
