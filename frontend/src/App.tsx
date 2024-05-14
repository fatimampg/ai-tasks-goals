import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tasks from "./pages/Dashboard/Tasks";
import Goals from "./pages/Dashboard/Goals";
import HomePage from "./pages/HomePage/HomePage";
import Navbar from "./components/Navbar/Navbar";
import Register from "./auth/Register";
import SignIn from "./auth/SignIn";
import { Provider } from "react-redux";
import store from "./store";
import Progress from "./pages/Progress/Progress";
import Features from "./pages/Features/Features";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <div>
          <header>
            <Navbar />
          </header>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/features" element={<Features />} />
          </Routes>
        </div>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
