import { Routes, Route } from 'react-router-dom'
import NotFound from './NotFound/NotFound'
import LoginForm from './main/login_form'
import Activity1 from './activity/activity1'
import RegistrationForm from './main/register_form'
import Mdl from './main/mdl'
import Mdl2 from './main/mdl2'

function App() {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<LoginForm />} />
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/activity1" element={<Activity1 />} />
      <Route path="/activity2" element={<Mdl />} />
      <Route path="/activity3" element={<Mdl2 />} />
    </Routes>
  )
}

export default App