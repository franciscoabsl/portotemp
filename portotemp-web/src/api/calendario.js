import client from './client'

export const gerarPdf = async (imovelId, mes, ano) => {
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
