export const ROLES = {
  ADMIN: 'ADMIN',
  ASSISTENTE: 'ASSISTENTE',
  PROPRIETARIO: 'PROPRIETARIO',
}

export const STATUS_RESERVA = {
  CONFIRMADA: { label: 'Confirmada', color: 'success' },
  EM_ANDAMENTO: { label: 'Em andamento', color: 'primary' },
  CONCLUIDA: { label: 'Concluída', color: 'neutral' },
  CANCELADA: { label: 'Cancelada', color: 'danger' },
}

export const ORIGEM_RESERVA = {
  AIRBNB: 'Airbnb',
  BOOKING: 'Booking',
  DIRETO: 'Direto',
}

export const STATUS_LIMPEZA = {
  PENDENTE: { label: 'Pendente', color: 'warning' },
  CONCLUIDA: { label: 'Concluída', color: 'success' },
}

export const TIPOS_TEMPLATE = {
  CONFIRMACAO: 'Confirmação',
  VESPERA_CHECKIN: 'Véspera do Check-in',
  BOAS_VINDAS: 'Boas-vindas',
  CHECKOUT: 'Check-out',
}

export const BASE_CALCULO = {
  BRUTO: 'Sobre valor bruto',
  LIQUIDO: 'Sobre valor líquido',
}
