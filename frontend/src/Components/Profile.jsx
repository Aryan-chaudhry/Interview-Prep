import { useEffect, useState } from "react";
import { useAuthStore } from "../Store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [result, setResult] = useState([]);
  const [knowledgeLevel, setKnowledgeLevel] = useState([]);
  const [confidenceLevel, setConfidenceLevel] = useState([]);
  const [InterviewScore, setInterviewScore] = useState([]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const getResult = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/getResult/${authUser?._id}`
      );
      setResult(response.data.data || []);
    } catch (error) {
      toast.error("Result not available!");
      console.log("error in getting result from backend", error);
    }
  };

  useEffect(() => {
    getResult();
  }, []);

  useEffect(() => {
    if (!result.length) return;

    const totalScoreArr = result.map((r) => r.totalScore || 0);
    const knowledgeArr = result.map((r) => r.knowledgeLevel || 0);
    const confidenceArr = result.map((r) => r.confidenceLevel || 0);

    setInterviewScore(totalScoreArr);
    setKnowledgeLevel(knowledgeArr);
    setConfidenceLevel(confidenceArr);
  }, [result]);

  // Rank calculation
  const rank = (() => {
    if (!InterviewScore.length) return "—";

    const avgTotal =
      InterviewScore.reduce((a, b) => a + b, 0) / InterviewScore.length;
    const avgKnowledge =
      knowledgeLevel.reduce((a, b) => a + b, 0) / knowledgeLevel.length;
    const avgConfidence =
      confidenceLevel.reduce((a, b) => a + b, 0) / confidenceLevel.length;

    const finalScore =
      avgTotal * 0.5 + avgKnowledge * 0.25 + avgConfidence * 0.25;

    if (finalScore >= 85) return "A+";
    if (finalScore >= 70) return "A";
    if (finalScore >= 55) return "B";
    return "C";
  })();

  /* ===================== STREAK LOGIC (NEW) ===================== */

  const interviewDays = new Set(
    result.map((r) => r.createdAt?.split("T")[0])
  );

  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 364);

  const days = [];
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    days.push({
      date: dateStr,
      active: interviewDays.has(dateStr),
      dayOfWeek: d.getDay(),
    });
  }

  const weeks = [];
  let week = [];

  days.forEach((day, index) => {
    if (index === 0) {
      for (let i = 0; i < day.dayOfWeek; i++) week.push(null);
    }
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length) weeks.push(week);

  const streak = (() => {
    let count = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].active) count++;
      else break;
    }
    return count;
  })();

  /* ===================== UI ===================== */

  return (
    <div className="pt-20 flex justify-center gap-10">
      {/* Profile Card */}
      <div className="max-w-2xl p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content p-2 rounded-full cursor-pointer transition-all ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.name}
              </p>
            </div>

            <div>
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <div className="bg-white rounded-full border-1 border-teal-600">
                  <span className="text-teal-500 px-5">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div className="bg-base-300 w-250 mt-8 rounded-xl h-180">
        {/* Row 1 */}
        <div className="w-full flex justify-center gap-10 px-10 h-50 mt-7">
          <div className="w-1/2 bg-base-200 rounded-lg flex flex-col items-center">
            {InterviewScore.length > 0 && (
              <Bar
                data={{
                  labels: result.map((r) =>
                    new Date(r.createdAt).toLocaleDateString()
                  ),
                  datasets: [
                    {
                      label: "Total Score",
                      data: InterviewScore,
                      backgroundColor: "teal",
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
                height={220}
                width={380}
              />
            )}
            <p className="text-gray-400 text-center">Score</p>
          </div>

          <div className="w-1/2 bg-base-200 rounded-lg flex flex-col items-center">
            {confidenceLevel.length > 0 && knowledgeLevel.length > 0 && (
              <Line
                data={{
                  labels: result.map((r) =>
                    new Date(r.createdAt).toLocaleDateString()
                  ),
                  datasets: [
                    {
                      label: "Confidence",
                      data: confidenceLevel,
                      borderColor: "red",
                      backgroundColor: "rgba(255, 99, 132, 0.2)",
                      tension: 0.3,
                    },
                    {
                      label: "Knowledge",
                      data: knowledgeLevel,
                      borderColor: "blue",
                      backgroundColor: "rgba(54, 162, 235, 0.2)",
                      tension: 0.3,
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
                height={220}
                width={380}
              />
            )}
            <p className="text-gray-400 text-center">Confidence & Knowledge</p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="w-full flex justify-center gap-10 px-10 h-50 mt-9">
          <div className="w-1/4 bg-base-200 rounded-lg">
            <p className="text-4xl font-bold text-center mt-8">{rank}</p>
            <p className="text-gray-400 text-center">Rank</p>
          </div>

          <div className="w-3/4 bg-base-200 rounded-lg">
            <p className="text-gray-400 text-center">Inbox</p>
          </div>
        </div>

        {/* Row 3 — GitHub Style Streak */}
        <div className="w-full flex justify-center gap-10 px-10 h-50 mt-9">
          <div className="w-full bg-base-200 rounded-lg p-6">
            <p className="text-gray-400 mb-3 text-center">
              Interview Activity (Last 1 Year)
            </p>

            <div className="flex gap-1 justify-center overflow-x-auto">
              {weeks.map((week, i) => (
                <div key={i} className="flex flex-col gap-1">
                  {week.map((day, j) =>
                    day ? (
                      <div
                        key={j}
                        title={day.date}
                        className={`w-3 h-3 ${
                          day.active ? "bg-green-600" : "bg-gray-200"
                        }`}
                      />
                    ) : (
                      <div key={j} className="w-3 h-3" />
                    )
                  )}
                </div>
              ))}
            </div>

            <p className="text-center text-gray-400">
              streak graph
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
