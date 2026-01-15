"use client"

type Tecnico = {
  tecnico: string
  agendado: number
  chegada: number
  concluida: number
  despachado: number
  deslocamento: number
  execucao: number
  total: number
  meta: number
}

export function TabelaTecnicos({ data }: { data: Tecnico[] }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-2 text-left">Técnico</th>
            <th>Agendado</th>
            <th>Chegada</th>
            <th>Concluída</th>
            <th>Despachado</th>
            <th>Em desloc.</th>
            <th>Execução</th>
            <th>Total</th>
            <th>Meta</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((t) => {
            const rotaCompleta = t.total >= t.meta

            return (
              <tr key={t.tecnico} className="border-t text-center">
                <td className="font-medium text-left px-2 py-1">
                  {t.tecnico}
                </td>

                <td>{t.agendado}</td>
                <td>{t.chegada}</td>
                <td>{t.concluida}</td>
                <td>{t.despachado}</td>
                <td>{t.deslocamento}</td>
                <td>{t.execucao}</td>

                <td className="font-bold">{t.total}</td>
                <td>{t.meta}</td>

                <td className="font-semibold">
                  {rotaCompleta ? (
                    <span className="text-green-700">
                      ROTA COMPLETA
                    </span>
                  ) : (
                    <span className="text-red-700">
                      NECESSÁRIO ENCAIXE
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
