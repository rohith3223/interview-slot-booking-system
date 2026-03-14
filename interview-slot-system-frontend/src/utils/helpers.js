export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export const getStatusBadge = (status) => {
  const badges = {
    AVAILABLE: 'success',
    BOOKED: 'warning',
    CANCELLED: 'danger',
    COMPLETED: 'secondary',
    SCHEDULED: 'primary',
    OPEN: 'success',
    CLOSED: 'danger',
    ON_HOLD: 'warning',
    SELECTED: 'success',
    REJECTED: 'danger',
    NEXT_ROUND: 'info',
  }
  return badges[status] || 'secondary'
}

export const getRoleBadge = (role) => {
  const badges = {
    ADMIN: 'danger',
    HR: 'warning',
    INTERVIEWER: 'primary',
    CANDIDATE: 'success',
  }
  return badges[role] || 'secondary'
}