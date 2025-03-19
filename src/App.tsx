import { Routes, Route } from 'react-router-dom'
import NotFound from './NotFound/NotFound'
import LoginForm from './main/login_form'
import Activity1 from './activity/activity1'

function App() {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<LoginForm />} />
      <Route path="/activity1" element={<Activity1 />} />
    </Routes>
  )
}

export default App