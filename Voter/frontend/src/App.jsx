import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CAInterface from "./components/CAInterface";
import VotingPage from "./components/VotingPage";
import VotingResults from "./components/Admin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CAInterface />} />
        <Route path="/voting" element={<VotingPage />} />
        <Route path="/Admin" element={<VotingResults />} />
      </Routes>
    </Router>
  );
}

export default App;
