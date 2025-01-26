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

      alert("Vote submitted successfully!");
      navigate("/"); // Redirect to CAInterface
    } catch (error) {
      console.error("Voting error:", error);
      alert(error.response?.data?.error || "Voting failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-indigo-700">
          Cast Your Vote
        </h2>
        <div className="space-y-6">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`p-6 border-2 rounded-xl cursor-pointer shadow-sm transition-transform transform ${
                selectedCandidate?.id === candidate.id
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent scale-105"
                  : "bg-gray-50 border-gray-300 hover:scale-105 hover:shadow-lg"
              }`}
              onClick={() => setSelectedCandidate(candidate)}
            >
              <h3
                className={`text-lg font-bold ${
                  selectedCandidate?.id === candidate.id
                    ? "text-white"
                    : "text-gray-800"
                }`}
              >
                {candidate.name}
              </h3>
              <p
                className={`text-sm ${
                  selectedCandidate?.id === candidate.id
                    ? "text-white/80"
                    : "text-gray-600"
                }`}
              >
                {candidate.party}
              </p>
            </div>
          ))}
          <button
            onClick={handleVote}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            disabled={!selectedCandidate}
          >
            {selectedCandidate ? "Submit Your Vote" : "Select a Candidate"}
          </button>
        </div>
        <div className="text-center mt-6 text-gray-500 text-sm">
          Your vote is confidential and securely recorded.
        </div>
      </div>
    </div>
  );
};

export default VotingPage;
