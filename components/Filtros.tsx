"use client"

type Props = {
  supervisor: string
  setSupervisor: (value: string) => void
  supervisores: string[]
}

export function Filtros({
  supervisor,
  setSupervisor,
  supervisores
}: Props) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <select
        value={supervisor}
        onChange={e => setSupervisor(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="">Todos Supervisores</option>

        {supervisores.map(sup => (
          <option key={sup} value={sup}>
            {sup}
          </option>
        ))}
      </select>
    </div>
  )
}
