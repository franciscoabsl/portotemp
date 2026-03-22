import client from './client'

export const listar = () => client.get('/reservas').then(r => r.data)
export const buscar = (id) => client.get(`/reservas/${id}`).then(r => r.data)
export const listarPorImovel = (id) => client.get(`/reservas/imovel/${id}`).then(r => r.data)
export const criar = (data) => client.post('/reservas', data).then(r => r.data)
export const atualizar = (id, data) => client.put(`/reservas/${id}`, data).then(r => r.data)
export const atualizarStatus = (id, status) => client.patch(`/reservas/${id}/status?status=${status}`)
export const cancelar = (id, data) => client.post(`/reservas/${id}/cancelamento`, data).then(r => r.data)
export const buscarLimpeza = (id) => client.get(`/reservas/${id}/limpeza`).then(r => r.data)
export const atualizarLimpeza = (id, data) => client.put(`/reservas/${id}/limpeza`, data).then(r => r.data)
export const concluirLimpeza = (id) => client.patch(`/reservas/${id}/limpeza/concluir`).then(r => r.data)
export const registrarLavanderia = (id, data) => client.post(`/reservas/${id}/lavanderia`, data).then(r => r.data)
export const gerarLinkWhatsApp = (id, tipo, idioma = 'PT') =>
  client.get(`/reservas/${id}/whatsapp?tipo=${tipo}&idioma=${idioma}`).then(r => r.data)
