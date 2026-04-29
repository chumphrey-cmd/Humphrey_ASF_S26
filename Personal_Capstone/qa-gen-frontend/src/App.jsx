import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateQuiz from "./pages/CreateQuiz.jsx";
import Quiz from "./pages/Quiz.jsx";

function App () {
  return (
      <BrowserRouter>
          <NavBar/>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create" element={<CreateQuiz />} />
              <Route path="/quiz/:id" element={<Quiz />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;