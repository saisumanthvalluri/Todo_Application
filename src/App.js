import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Todos from './Components/Todos'
import Login from './Components/Login';
import Register from './Components/Register';
import ForgotPassword from './Components/ForgotPassword';
import NotFound from './Components/NotFound';
import './App.css';

const App = () => (
    <Router>
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/sign-up' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/' element={<Todos />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
)

export default App