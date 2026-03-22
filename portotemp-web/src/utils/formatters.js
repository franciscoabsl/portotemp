export const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0)

export const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR')
}

export const formatDateTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('pt-BR')
}

export const formatPhone = (phone) => {
  if (!phone) return '-'
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

export const mesNome = (mes) => {
  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
  return meses[mes - 1] ?? ''
}
