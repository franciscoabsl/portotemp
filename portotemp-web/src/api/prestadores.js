import client from './client'

export const listar = () => client.get('/prestadores').then(r => r.data)
export const criar  = (data) => client.post('/prestadores', data).then(r => r.data)
export const atualizar = (id, data) => client.put(`/prestadores/${id}`, data).then(r => r.data)
export const excluir = (id) => client.delete(`/prestadores/${id}`)
