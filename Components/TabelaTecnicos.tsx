export function TabelaTecnicos({ data }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th>Técnico</th>
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
          {data.map(t => (
            <tr key={t.tecnico} className="border-t">
              <td className="font-medium">{t.tecnico}</td>
              <td>{t.agendado}</td>
              <td>{t.chegada}</td>
              <td>{t.concluida}</td>
              <td>{t.despachado}</td>
              <td>{t.deslocamento}</td>
              <td>{t.execucao}</td>
              <td className="font-bold">{t.total}</td>
              <td>{t.meta}</td>
              <td>{t.total >= t.meta ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
