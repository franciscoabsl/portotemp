import client from './client'

export const listar = () => client.get('/fechamentos').then(r => r.data)
export const buscar = (id) => client.get(`/fechamentos/${id}`).then(r => r.data)
export const listarPorProprietario = (id) => client.get(`/fechamentos/proprietario/${id}`).then(r => r.data)
export const gerar = (proprietarioId, mes, ano) =>
  client.post(`/fechamentos/gerar?proprietarioId=${proprietarioId}&mes=${mes}&ano=${ano}`).then(r => r.data)
export const fechar = (id) => client.patch(`/fechamentos/${id}/fechar`).then(r => r.data)
export const excluir = (id) => client.delete(`/fechamentos/${id}`)
