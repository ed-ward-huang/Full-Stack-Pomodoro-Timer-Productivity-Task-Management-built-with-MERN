// import './App.css'
import Home from "./components/Home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/SignUp" element={<Signup/>}/>
          <Route path="/Home" element={<Home/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;