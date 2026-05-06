// src/api/auth.js
const API_BASE = '/api/v1/auth'

export const register = (data) => {
  return fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export const requestVerify = (data) => {
  return fetch('/api/v1/auth/student/verify-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
}

export const verifyCode = (data) => {
  return fetch(`${API_BASE}/student/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export const login = (data) => {
  return fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}