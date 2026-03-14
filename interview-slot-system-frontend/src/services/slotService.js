import api from './api'

export const getAvailableSlots = async () => {
  const response = await api.get('/slots/available')
  return response.data
}

export const getSlotsByJob = async (jobId) => {
  const response = await api.get(`/slots/job/${jobId}`)
  return response.data
}

export const createSlot = async (data) => {
  const response = await api.post('/slots', data)
  return response.data
}

export const bookSlot = async (data) => {
  const response = await api.post('/interviews/book', data)
  return response.data
}

export const getMyInterviews = async (candidateId) => {
  const response = await api.get(`/interviews/candidate/${candidateId}`)
  return response.data
}

export const completeInterview = async (id) => {
  const response = await api.patch(`/interviews/${id}/complete`)
  return response.data
}

export const submitFeedback = async (data) => {
  const response = await api.post('/interviews/feedback', data)
  return response.data
}

export const getReports = async () => {
  const response = await api.get('/reports/summary')
  return response.data
}