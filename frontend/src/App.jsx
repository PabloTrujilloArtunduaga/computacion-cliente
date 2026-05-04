import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage"
import LoginPages from "./pages/LoginPages";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<h1>Home Page</h1>} />
        <Route path='/login' element={< LoginPages/>} />
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/tasks' element={<h1>Task Page</h1>} />
        <Route path='/add-task' element={<h1>New Task</h1>} />
        <Route path='/tasks/:id' element={<h1>Update task</h1>} />
        <Route path='/profile' element={<h1>Profile</h1>} />
      </Routes>
    </BrowserRouter>

    </AuthProvider>
  );
}

export default App;


