import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, Vote, UserCheck } from "lucide-react";

const VotingResults = () => {
  const [candidates, setCandidates] = useState([]);
  const [userStats, setUserStats] = useState({
    totalRegistered: 0,
    totalVoted: 0,
  });

  useEffect(() => {
    // Fetch candidates data
    const fetchCandidates = async () => {
      try {
        const response = await fetch("/api/candidates");
        const data = await response.json();
        setCandidates(data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    // Fetch user statistics
    const fetchUserStats = async () => {
      try {
        const response = await fetch("/api/users/stats");
        const data = await response.json();
        setUserStats(data);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchCandidates();
    fetchUserStats();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">E-Voting Results</h1>
        <p className="text-gray-600">Live election results and statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Users className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Total Registered</h2>
          </div>
          <p className="text-3xl font-bold">{userStats.totalRegistered}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Vote className="h-6 w-6 text-green-500" />
            <h2 className="text-xl font-semibold">Total Votes Cast</h2>
          </div>
          <p className="text-3xl font-bold">{userStats.totalVoted}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4 mb-4">
            <UserCheck className="h-6 w-6 text-purple-500" />
            <h2 className="text-xl font-semibold">Voter Turnout</h2>
          </div>
          <p className="text-3xl font-bold">
            {userStats.totalRegistered
              ? Math.round(
                  (userStats.totalVoted / userStats.totalRegistered) * 100
                )
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Results Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Vote Distribution</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={candidates}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="voteCount" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Results Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Detailed Results</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left">Photo</th>
                <th className="py-3 px-4 text-left">Candidate</th>
                <th className="py-3 px-4 text-left">Party</th>
                <th className="py-3 px-4 text-left">Votes</th>
                <th className="py-3 px-4 text-left">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img
                      src={candidate.photo || "/api/placeholder/40/40"}
                      alt={candidate.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-3 px-4">{candidate.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <img
                        src={candidate.logo || "/api/placeholder/20/20"}
                        alt={candidate.partyName}
                        className="w-5 h-5"
                      />
                      <span>{candidate.partyName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{candidate.voteCount}</td>
                  <td className="py-3 px-4">
                    {(
                      (candidate.voteCount / userStats.totalVoted) * 100 || 0
                    ).toFixed(1)}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VotingResults;
