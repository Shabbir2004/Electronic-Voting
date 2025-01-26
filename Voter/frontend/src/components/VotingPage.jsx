import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VotingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [candidates, setCandidates] = useState([
    { id: 1, name: "Candidate A", party: "Blue Party" },
    { id: 2, name: "Candidate B", party: "Red Party" },
    { id: 3, name: "Candidate C", party: "Green Party" },
  ]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const userCertificate = localStorage.getItem("userCertificate");
    if (!userCertificate) {
      navigate("/");
      return;
    }

    const userData = JSON.parse(userCertificate);
    setEmail(userData.email);
  }, [navigate]);

  const handleVote = async () => {
    if (!selectedCandidate) {
      alert("Please select a candidate");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/voting/cast-vote",
        {
          email,
          candidateId: selectedCandidate.id,
        }
      );

      alert(response.data.message);
      navigate("/result"); // Optional: redirect to results page
    } catch (error) {
      console.error("Voting error:", error);
      alert(error.response?.data?.error || "Voting failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Cast Your Vote
        </h2>
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`p-4 border rounded-md cursor-pointer ${
                selectedCandidate?.id === candidate.id
                  ? "bg-blue-100 border-blue-500"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedCandidate(candidate)}
            >
              <h3 className="font-semibold">{candidate.name}</h3>
              <p className="text-sm text-gray-600">{candidate.party}</p>
            </div>
          ))}
          <button
            onClick={handleVote}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
            disabled={!selectedCandidate}
          >
            Cast Vote
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotingPage;
