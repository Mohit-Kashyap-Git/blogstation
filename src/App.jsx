import { useEffect, useState } from 'react'
import { account } from './lib/appwrite'

function App() {
  const [status, setStatus] = useState('Checking Appwrite connection...')

  useEffect(() => {
    account
      .get()
      .then(() => setStatus('Connected (a session already exists)'))
      .catch((err) => {
        // A 401 means Appwrite answered and we're simply not logged in.
        if (err.code === 401) setStatus('Connected to Appwrite (guest, 401 is expected)')
        else setStatus(`Connection problem: ${err.message}`)
      })
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <h1 className="text-xl font-bold text-sky-400">{status}</h1>
    </div>
  )
}

export default App