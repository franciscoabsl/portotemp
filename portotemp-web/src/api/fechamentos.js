import client from './client'

export const listar = () => client.get('/fechamentos').then(r => r.data)
export const buscar = (id) => client.get(`/fechamentos/${id}`).then(r => r.data)
export const listarPorProprietario = (id) => client.get(`/fechamentos/proprietario/${id}`).then(r => r.data)
export const gerar = (proprietarioId, mes, ano) =>
  client.post(`/fechamentos/gerar?proprietarioId=${proprietarioId}&mes=${mes}&ano=${ano}`).then(r => r.data)
export const fechar = (id) => client.patch(`/fechamentos/${id}/fechar`).then(r => r.data)
export const excluir = (id) => client.delete(`/fechamentos/${id}`)

export const downloadPdf = async (imovelId, mes, ano) => {
  const response = await client.get(
    `/imoveis/${imovelId}/calendario-limpeza?mes=${mes}&ano=${ano}`,
    { responseType: 'blob' }
  )
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `calendario-limpeza-${mes}-${ano}.pdf`)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
