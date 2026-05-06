import Register from './components/Register'
import VerifyRequest from './components/VerifyRequest'
import VerifyCode from './components/VerifyCode'
import Login from './components/Login'
import EverytimeFetch from './components/EverytimeFetch'
import BuildingViewer from './components/BuildingViewer'

function App() {
  return (
    <div>
      <Register />
      <VerifyRequest />
      <VerifyCode />
      <Login />

      <EverytimeFetch />
      <BuildingViewer />
    </div>
  )
}

export default App