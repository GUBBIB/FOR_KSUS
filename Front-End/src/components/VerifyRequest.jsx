import { useState } from 'react'
import { requestVerify } from '../api/auth'

export default function VerifyRequest() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    try {
      const res = await requestVerify({ email })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message)
      }

      setMessage('인증 메일 전송 완료')

    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div>
      <h2>학교 인증</h2>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="학교 이메일 @ks.ac.kr"
      />

      <button onClick={handleSubmit}>인증 요청</button>

      <p>{message}</p>
    </div>
  )
}