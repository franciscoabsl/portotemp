import client from './client'

export const listar = () => client.get('/despesas').then(r => r.data)
export const listarPorImovel = (id) => client.get(`/despesas/imovel/${id}`).then(r => r.data)
export const criar = (data) => client.post('/despesas', data).then(r => r.data)
export const atualizar = (id, data) => client.put(`/despesas/${id}`, data).then(r => r.data)
export const excluir = (id) => client.delete(`/despesas/${id}`)
