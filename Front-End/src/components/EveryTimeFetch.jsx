// src/components/EverytimeFetch.jsx

import { useState } from 'react'
import { fetchTimetable } from '../api/everytime'

export default function EverytimeFetch() {
  const [cookie, setCookie] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleFetch = async () => {
    if (!cookie) {
      alert('쿠키 입력해라')
      return
    }

    try {
      setLoading(true)

      const res = await fetchTimetable(cookie)

      setResult(res)
      alert('가져오기 성공')
    } catch (err) {
      console.error(err)
      alert(err?.message || '에러 발생')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Everytime 시간표 가져오기</h2>

      <textarea
        placeholder="쿠키 붙여넣기 etsid=...;x-et-device=... 형식"
        value={cookie}
        onChange={(e) => setCookie(e.target.value)}
        rows={4}
        style={{ width: '400px' }}
      />

      <br />

      <button onClick={handleFetch} disabled={loading}>
        {loading ? '불러오는 중...' : '시간표 가져오기'}
      </button>

      <div>
        <h3>결과</h3>
        <pre>{result}</pre>
      </div>
    </div>
  )
}