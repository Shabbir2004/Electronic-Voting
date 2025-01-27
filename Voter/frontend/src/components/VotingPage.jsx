import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const VotingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/candidates");
        setCandidates(response.data);
      } catch (error) {
        console.error("Failed to fetch candidates", error);
        toast.error("Unable to load candidates. Please try again later.");
      }
    };

    fetchCandidates();
  }, []);

  useEffect(() => {
    const savedUserEmail = localStorage.getItem("UserEmail");
    if (savedUserEmail) {
      setUserEmail(savedUserEmail);
    } else {
      toast.error("User email not found. Please log in again.");
    }
  }, []);

  useEffect(() => {
    const userCertificate = localStorage.getItem("userCertificate");
    if (!userCertificate) {
      navigate("/");
      return;
    }

    const userData = JSON.parse(userCertificate);
    setEmail(userData.email);
  }, [navigate]);

  const handleConfirmVote = async (selectedCandidate, userEmail) => {
    if (!userEmail) {
      toast.error("User email is required.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/vote", {
        email: userEmail,
        candidateId: selectedCandidate._id,
      });

      toast.success("Vote cast successfully!");
      navigate("/Admin") ;

      setSelectedCandidate(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Vote submission failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 flex items-center justify-center p-4">
      <Toaster />
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-indigo-700">
          Cast Your Vote
        </h2>
        <div className="space-y-6">
          {candidates.map((candidate) => (
            <div
              key={candidate._id} // Use _id from MongoDB
              className={`p-6 border-2 rounded-xl cursor-pointer shadow-sm transition-transform transform ${
                selectedCandidate?._id === candidate._id
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent scale-105"
                  : "bg-gray-50 border-gray-300 hover:scale-105 hover:shadow-lg"
              }`}
              onClick={() => setSelectedCandidate(candidate)}
            >
              <img
                src={candidate.photo}
                alt={candidate.name}
                className="w-16 h-16 object-cover rounded-full mb-4"
              />
              <h3
                className={`text-lg font-bold ${
                  selectedCandidate?._id === candidate._id
                    ? "text-white"
                    : "text-gray-800"
                }`}
              >
                {candidate.name}
              </h3>
              <p
                className={`text-sm ${
                  selectedCandidate?._id === candidate._id
                    ? "text-white/80"
                    : "text-gray-600"
                }`}
              >
                {candidate.partyName}
              </p>
              <p
                className={`text-xs ${
                  selectedCandidate?._id === candidate._id
                    ? "text-white/70"
                    : "text-gray-500"
                }`}
              >
                {candidate.description}
              </p>
            </div>
          ))}
          <button
            onClick={() => handleConfirmVote(selectedCandidate, userEmail)}
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
