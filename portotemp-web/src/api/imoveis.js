import client from './client'

export const listar = () => client.get('/imoveis').then(r => r.data)
export const buscar = (id) => client.get(`/imoveis/${id}`).then(r => r.data)
export const listarPorProprietario = (id) => client.get(`/imoveis/proprietario/${id}`).then(r => r.data)
export const criar = (data) => client.post('/imoveis', data).then(r => r.data)
export const atualizar = (id, data) => client.put(`/imoveis/${id}`, data).then(r => r.data)
export const inativar = (id) => client.delete(`/imoveis/${id}`)
