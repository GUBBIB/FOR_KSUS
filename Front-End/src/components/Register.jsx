import { useState } from 'react'
import { register } from '../api/auth'

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    nickname: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setMessage('')

      const res = await register(form)

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || '회원가입 실패')
      }

      const data = await res.json()
      setMessage('회원가입 성공')
      console.log(data)

    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>회원가입</h2>

      <input name="email" placeholder="email" onChange={handleChange} />
      <input name="password" type="password" placeholder="password" onChange={handleChange} />
      <input name="name" placeholder="name" onChange={handleChange} />
      <input name="nickname" placeholder="nickname" onChange={handleChange} />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? '처리중...' : '회원가입'}
      </button>

      <p>{message}</p>
    </div>
  )
}