import { useEffect, useState } from "react";
import { useAuthStore } from "../Store/useAuthStore";
import { Camera, Mail, User, Star, Trash2, X, Reply } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
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
  ArcElement,
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
  const BASE_RANK = 3000000;

  if (!InterviewScore.length) return BASE_RANK;

  const avgTotal =
    InterviewScore.reduce((a, b) => a + b, 0) / InterviewScore.length;

  const avgKnowledge =
    knowledgeLevel.reduce((a, b) => a + b, 0) / knowledgeLevel.length;

  const avgConfidence =
    confidenceLevel.reduce((a, b) => a + b, 0) / confidenceLevel.length;

  // Weighted performance score
  const performanceScore =
    avgTotal * 0.5 + avgKnowledge * 0.25 + avgConfidence * 0.25;

  // Normalize to 0–1 (since total is out of 125)
  const normalized = Math.min(performanceScore / 125, 1);

  // Rank improvement up to ~2.5M
  const rankImprovement = Math.floor(normalized * 2500000);

  return Math.max(BASE_RANK - rankImprovement, 1);
})();


  // email setup in inbox 
  // Build inbox mails from `result` (backend data)
  const inboxMails = result.map((r, index) => {
    const score = r.totalScore || 0;
    const confidence = r.confidenceLevel || 0;
    const knowledge = r.knowledgeLevel || 0;

    return {
      id: index,
      from: "AI Interview System",
      subject: `${authUser?.name}, Interview Feedback – Score ${score}/125`,
      preview: `Score ${score}/125 · Confidence ${confidence} · Knowledge ${knowledge}`,
      date: new Date(r.createdAt).toLocaleString(),
      body: `
Hi ${authUser?.name},\n\nHere is your detailed interview feedback:\n\n• Total Score: ${score} / 125\n• Confidence Level: ${confidence}\n• Knowledge Level: ${knowledge}\n\n${
        score >= 100
          ? "Excellent performance. You are among the top candidates globally."
          : score >= 70
          ? "Good performance. Improving confidence can significantly boost your rank."
          : "Needs improvement. Focus on fundamentals and structured answers."
      }\n\nRecommendation:\nComplete more interviews to improve your global rank and consistency.\n\nRegards,\nAI Interview Evaluation Engine\n      `,
    };
  });

  const [mailList, setMailList] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const [readIds, setReadIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // initialize mailList when backend data arrives
  useEffect(() => {
    // show newest messages first
    const sorted = [...inboxMails].sort((a, b) => b.id - a.id);
    setMailList(sorted);
    if (sorted.length > 0) setSelectedMail(sorted[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const handleMailClick = (mail) => {
    setSelectedMail(mail);
    if (!readIds.includes(mail.id)) setReadIds((prev) => [...prev, mail.id]);
  };

  const filteredMails = mailList.filter((m) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      m.subject.toLowerCase().includes(q) ||
      m.preview.toLowerCase().includes(q) ||
      m.from.toLowerCase().includes(q)
    );
  });

  const removeMail = (id) => {
    setMailList((prev) => prev.filter((m) => m.id !== id));
    if (selectedMail?.id === id) {
      const idx = mailList.findIndex((m) => m.id === id);
      const next = mailList[idx + 1] || mailList[idx - 1] || null;
      setSelectedMail(next);
    }
  };

  const archiveMail = (id) => {
    // local archive: same as remove for now
    removeMail(id);
  };

  const handleReply = () => {
    toast.success("Reply to Interview Engine is freezed!")
  }

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
                      label: "Interview Score (out of 125)",
                      data: InterviewScore,
                      backgroundColor: "#14b8a6", // teal-500 (premium look)
                      borderRadius: 8,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 125,
                      ticks: {
                        stepSize: 25,
                      },
                      title: {
                        display: true,
                        text: "Score ( /125 )",
                      },
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (ctx) => `${ctx.raw} / 125`,
                      },
                    },
                    legend: {
                      labels: {
                        font: { weight: "600" },
                      },
                    },
                  },
                }}
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
                      backgroundColor: "red",
                      tension: 0.3,
                    },
                    {
                      label: "Knowledge",
                      data: knowledgeLevel,
                      borderColor: "blue",
                      backgroundColor: "blue",
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
          <div className="w-1/4 bg-base-200 rounded-lg flex justify-center item-center">
            <div className="w-1/4 bg-base-200 rounded-lg flex flex-col items-center justify-center">
              <div className="w-40 h-40">
                <Doughnut
                  data={{
                    labels: ["Improved", "Remaining"],
                    datasets: [
                      {
                        data: [
                          3000000 - rank,
                          rank,
                        ],
                        backgroundColor: ["#14b8a6", "#e5e7eb"],
                        borderWidth: 0,
                        cutout: "75%",
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      tooltip: { enabled: true },
                      legend: { display: false },
                    },
                  }}
                />
              </div>

              <div className="absolute text-center">
                <p className="text-sm text-gray-400">Global Rank</p>
                <p className="text-2xl font-medium text-teal-500">
                  {rank.toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm">
                  out of 3000000
                </p>

              </div>
            </div>

          </div>

          <div className="w-3/4 bg-white rounded-lg">
            {/* <p className="text-gray-400 text-center">Inbox</p> */}
            <div className="w-full h-full bg-white mt-3  relative">
              {/* List view (full width) */}
              <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="checkbox checkbox-xs" />
                  <div className="text-sm font-semibold text-black">Inbox</div>
                  <div className="text-xs text-gray-400">{mailList.length} messages</div>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Search mail"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-sm input-bordered w-64 bg-base-200 text-sm"
                  />
                </div>
              </div>

              <div className="max-h-96 overflow-auto">
                {filteredMails.length === 0 && (
                  <div className="p-4 text-sm text-gray-500">No messages</div>
                )}

                {filteredMails.map((mail) => {
                  const isRead = readIds.includes(mail.id);
                  return (
                    <div
                      key={mail.id}
                      onClick={() => handleMailClick(mail)}
                      className={`flex items-center gap-3 px-4 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                        selectedMail?.id === mail.id ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="w-8 text-center text-sm text-gray-500">{isRead ? '' : '●'}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex items-center gap-3">
                            <div className="font-medium truncate">{mail.from}</div>
                            <div className="text-sm text-gray-400 truncate">{mail.preview}</div>
                          </div>
                          <div className="text-xs text-gray-400">{mail.date}</div>
                        </div>
                        <div className="mt-2">
                          <div className={`text-base font-semibold truncate ${isRead ? 'text-gray-700' : 'text-black'}`}>{mail.subject}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Full message overlay (opens on click) */}
              {selectedMail && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6" onClick={() => setSelectedMail(null)}>
                  <div className="bg-white shadow-2xl rounded-lg overflow-hidden max-h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
                    <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
                      <div className="flex-1">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{selectedMail.subject}</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="font-medium text-gray-700">{selectedMail.from}</div>
                          <div>•</div>
                          <div>{selectedMail.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button onClick={handleReply} className="btn btn-ghost btn-sm"><Reply className="w-4 h-4" /> Reply</button>
                        <button onClick={() => archiveMail(selectedMail.id)} className="btn btn-ghost btn-sm"><Trash2 className="w-4 h-4" /></button>
                        <button onClick={() => { removeMail(selectedMail.id); }} className="btn btn-ghost btn-sm">Delete</button>
                        <button onClick={() => setSelectedMail(null)} className="btn btn-ghost btn-sm"><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="px-6 py-4 overflow-auto h-[calc(80vh-88px)]">
                      <div className="prose max-w-none text-gray-700">
                        <pre className="whitespace-pre-wrap break-words text-sm">{selectedMail.body}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
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
