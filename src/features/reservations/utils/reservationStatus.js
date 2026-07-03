const normalizeStatus = (status) => {
  const normalized = String(status || 'PENDIENTE').trim().toUpperCase()

  if (normalized === 'CANCELED') return 'CANCELADA'
  if (normalized === 'DONE') return 'COMPLETADA'

  return normalized
}

export const parseReservationDateTime = (reservation) => {
  const dateValue = reservation?.fecha || reservation?.reservation_date || reservation?.date || ''
  const timeValue = reservation?.hora || reservation?.reservation_time || reservation?.time || '00:00'

  if (!dateValue) return null

  const timePart = typeof timeValue === 'string' && timeValue.length >= 5 ? timeValue.slice(0, 5) : '00:00'
  const candidate = new Date(`${dateValue}T${timePart}`)

  return Number.isNaN(candidate.getTime()) ? null : candidate
}

export const getReservationDisplayStatus = (reservation, now = new Date()) => {
  const rawStatus = normalizeStatus(
    reservation?.estado || reservation?.status || reservation?.state || reservation?.reservation_status
  )

  if (rawStatus === 'CANCELADA' || rawStatus === 'COMPLETADA') {
    return rawStatus
  }

  const reservationDateTime = parseReservationDateTime(reservation)
  if (reservationDateTime && now >= reservationDateTime) {
    return 'LISTA'
  }

  return rawStatus || 'PENDIENTE'
}

// Adaptación de estilos para React Native
export const getReservationStatusStyles = (status) => {
  const normalized = normalizeStatus(status)

  const styles = {
    PENDIENTE: { borderColor: 'rgba(161, 161, 170, 0.4)', backgroundColor: 'rgba(161, 161, 170, 0.1)', color: '#000' },
    CONFIRMADA: { borderColor: 'rgba(52, 211, 153, 0.4)', backgroundColor: 'rgba(52, 211, 153, 0.1)', color: '#000' },
    LISTA: { borderColor: 'rgba(34, 211, 238, 0.4)', backgroundColor: 'rgba(34, 211, 238, 0.1)', color: '#000' },
    CANCELADA: { borderColor: 'rgba(248, 113, 113, 0.4)', backgroundColor: 'rgba(248, 113, 113, 0.1)', color: '#000' },
    COMPLETADA: { borderColor: 'rgba(96, 165, 250, 0.4)', backgroundColor: 'rgba(96, 165, 250, 0.1)', color: '#000' },
  }

  return styles[normalized] || { borderColor: 'rgba(252, 240, 202, 0.3)', backgroundColor: 'rgba(0, 0, 0, 0.2)', color: '#000' }
}

export const normalizeReservationStatus = normalizeStatus