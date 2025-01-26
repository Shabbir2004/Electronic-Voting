import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CAInterface from "./components/CAInterface";
import VotingPage from "./components/VotingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CAInterface />} />
        <Route path="/voting" element={<VotingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
