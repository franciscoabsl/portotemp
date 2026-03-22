import client from './client'

export const listar = () => client.get('/hospedes').then(r => r.data)
export const buscar = (id) => client.get(`/hospedes/${id}`).then(r => r.data)
export const criar = (data) => client.post('/hospedes', data).then(r => r.data)
export const atualizar = (id, data) => client.put(`/hospedes/${id}`, data).then(r => r.data)
