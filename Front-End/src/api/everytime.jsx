// src/api/everytime.js

const API_BASE = '/api/v1/everytime'

export const fetchTimetable = async (cookie) => {
  const res = await fetch(`${API_BASE}/fetch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cookie }),
    credentials: 'include', // 로그인 쿠키 쓰면 필수
  })

  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw err || { message: '요청 실패' }
  }

  return res.text() // 응답이 string이라 text()
}