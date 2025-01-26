import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CAInterface = () => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = email;

    try {
      const response = await axios.post("http://localhost:5000/ca/generate", {
        userId,
        email,
        pin,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userCertificate", JSON.stringify(response.data));

      navigate("/voting");
    } catch (error) {
      console.error("Certificate generation error:", error);
      alert(
        `Error: ${
          error.response?.data?.details || "Failed to generate certificate"
        }`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-300 to-pink-200 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden transform transition-all duration-500 hover:scale-105">
          <div className="px-10 py-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
            <h2 className="text-4xl font-extrabold text-center text-white mb-4 drop-shadow-lg">
              Digital Certificate
            </h2>
            <p className="text-center text-indigo-200 text-lg font-medium mb-6">
              Empowering Secure Voter Registration
            </p>
          </div>
          <form onSubmit={handleSubmit} className="px-10 py-8 space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 shadow-md placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secure PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 shadow-md placeholder-gray-400"
                placeholder="Enter 4-6 digit PIN"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold
              hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition duration-300 transform hover:scale-105
              focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-purple-400 shadow-lg hover:shadow-2xl"
            >
              Generate Certificate
            </button>
          </form>
          <div className="px-10 py-6 bg-gray-100 text-center text-sm text-gray-500 border-t border-gray-200">
            Your data is{" "}
            <span className="font-semibold text-gray-700">encrypted</span> and
            securely stored.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CAInterface;
