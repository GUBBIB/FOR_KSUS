// src/components/VerifyCode.jsx
import { useState } from 'react'
import { verifyCode } from '../api/auth'

export default function VerifyCode() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  const handleSubmit = async () => {
    const res = await verifyCode({ email, code })
    const text = await res.text()
    alert(text)
  }

  return (
    <div>
      <h2>인증 코드 검증</h2>
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleSubmit}>검증</button>
    </div>
  )
}