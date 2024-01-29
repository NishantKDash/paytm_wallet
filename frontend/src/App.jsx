
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Send from './components/Send'
import Signin from './components/Signin'
import Signup from './components/Signup'
function App() {

  return (
    <div>
       <BrowserRouter>
         <Routes>
            <Route path = '/' element={<Dashboard></Dashboard>}></Route>
            <Route path = '/signup' element={<Signup></Signup>}></Route>
            <Route path = '/signin' element={<Signin></Signin>}></Route>
            <Route path = '/send' element = {<Send></Send>}></Route>
         </Routes>
       </BrowserRouter>
    </div>
  )
}

export default App
