import client from './client'

export const listar = () => client.get('/proprietarios').then(r => r.data)
export const buscar = (id) => client.get(`/proprietarios/${id}`).then(r => r.data)
export const criar = (data) => client.post('/proprietarios', data).then(r => r.data)
export const atualizar = (id, data) => client.put(`/proprietarios/${id}`, data).then(r => r.data)
export const inativar = (id) => client.delete(`/proprietarios/${id}`)
