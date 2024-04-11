import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tasks from "./pages/Tasks";
import Goals from "./pages/Goals";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import Register from "./auth/Register";
import SignIn from "./auth/SignIn";
import { Provider } from "react-redux";
import store from "./store";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <div>
          <header>
            <Navbar />
          </header>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signin" element={<SignIn />} />
            {/* <Route path="/profile" element={<Profile />} />
             */}
          </Routes>
        </div>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
