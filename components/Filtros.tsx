"use client"

type Props = {
  supervisor: string
  setSupervisor: (v: string) => void
  data: string
  setData: (v: string) => void
}

export function Filtros({ supervisor, setSupervisor, data, setData }: Props) {
  return (
    <div className="flex flex-wrap gap-4">
      <select
        value={supervisor}
        onChange={e => setSupervisor(e.target.value)}
        className="border rounded-lg p-2"
      >
        <option value="">Todos Supervisores</option>
        <option value="FABIO">FABIO</option>
        <option value="TIAGO">TIAGO</option>
        <option value="JOSE">JOSE</option>
      </select>

      <input
        type="date"
        value={data}
        onChange={e => setData(e.target.value)}
        className="border rounded-lg p-2"
      />
    </div>
  )
}
