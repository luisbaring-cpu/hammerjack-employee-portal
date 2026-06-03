import React, { useState } from 'react';
import { 
  CheckCircle, AlertTriangle, User, 
  FileText, LogOut, ArrowRight, X, Clock, PlayCircle, Shield
} from 'lucide-react';

// Brand Colors
const BRAND = {
  navy: '#0A243F',
  orange: '#FE6000',
  white: '#F1F1F1',
  periwinkle: '#969DF8',
  skyBlue: '#B0E9F8',
};

// Mock Data for the Employee
const EMPLOYEE_NAME = "David Chen";
const EMPLOYEE_ROLE = "Bookkeeper";

const PENDING_ASSESSMENTS = [
  { id: 101, title: "AU Taxation - Q2 Update", category: "AU Taxation", time: "20 mins", questions: 5, due: "Friday" },
  { id: 102, title: "Data Privacy Protocol 2026", category: "Compliance", time: "10 mins", questions: 3, due: "Next Week" }
];

const COMPLETED_ASSESSMENTS = [
  { id: 201, title: "Xero/MYOB Advanced Functions", score: 85, date: "May 15, 2026" },
  { id: 202, title: "BAS / IAS Preparation Basics", score: 75, date: "April 02, 2026" }
];

// Mock Questions for the AU Taxation Assessment
const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "Under the latest 2026 ATO guidelines, what is the instant asset write-off threshold for small businesses?",
    options: ["$20,000", "$30,000", "$150,000", "There is no threshold limit"],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "When calculating GST turnover, which of the following is NOT included?",
    options: ["Export sales", "Input taxed sales", "Sales made within Australia", "GST-free sales"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "For a company with an aggregated turnover of less than $50 million, what is the base rate entity tax rate?",
    options: ["30%", "27.5%", "25%", "22.5%"],
    correctAnswer: 2
  }
];

// Inject Brand Fonts
const FontStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Rubik:wght@400;500;600&display=swap');
    .font-montserrat { font-family: 'Montserrat', sans-serif; }
    .font-rubik { font-family: 'Rubik', sans-serif; }
  `}} />
);

export default function EmployeePortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeAssessment, setActiveAssessment] = useState(null);
  
  // Assessment State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(null);

  const startAssessment = (assessment) => {
    setActiveAssessment(assessment);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(null);
  };

  const handleAnswerSelect = (optionIndex) => {
    setAnswers({ ...answers, [currentQuestionIndex]: optionIndex });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate Score
      setIsSubmitting(true);
      setTimeout(() => {
        let correctCount = 0;
        MOCK_QUESTIONS.forEach((q, index) => {
          if (answers[index] === q.correctAnswer) correctCount++;
        });
        const finalScore = Math.round((correctCount / MOCK_QUESTIONS.length) * 100);
        setScore(finalScore);
        setIsSubmitting(false);
      }, 1500);
    }
  };

  const returnToDashboard = () => {
    setActiveAssessment(null);
    setScore(null);
  };

  if (!isAuthenticated) {
    return (
      <>
        <FontStyles />
        <LoginScreen onLogin={() => setIsAuthenticated(true)} />
      </>
    );
  }

  // --- VIEW 3: ASSESSMENT COMPLETE ---
  if (score !== null) {
    return (
      <>
        <FontStyles />
        <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center font-rubik p-6">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-10 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-[#B0E9F8]/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield size={48} className="text-[#0A243F]" />
            </div>
            
            <h1 className="font-montserrat font-bold text-3xl text-[#0A243F] mb-2">Assessment Complete!</h1>
            <p className="text-[#0A243F]/70 mb-8">Your results for "{activeAssessment.title}" have been securely saved and synced with your competency profile.</p>
            
            <div className="bg-[#F1F1F1] rounded-xl p-6 mb-8 border border-[#0A243F]/10">
              <div className="text-sm font-bold text-[#0A243F]/60 uppercase tracking-widest mb-1">Final Score</div>
              <div className="font-montserrat font-bold text-6xl text-[#FE6000]">{score}%</div>
            </div>

            <button 
              onClick={returnToDashboard}
              className="w-full py-4 bg-[#0A243F] text-white rounded-xl font-bold font-montserrat hover:bg-[#0A243F]/90 transition-colors shadow-lg"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  // --- VIEW 2: ACTIVE ASSESSMENT (Distraction-Free) ---
  if (activeAssessment) {
    const question = MOCK_QUESTIONS[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / MOCK_QUESTIONS.length) * 100;
    const isAnswered = answers[currentQuestionIndex] !== undefined;

    return (
      <>
        <FontStyles />
        <div className="min-h-screen bg-[#F1F1F1] flex flex-col font-rubik">
          {/* Assessment Header */}
          <header className="bg-white border-b border-[#0A243F]/10 h-20 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div>
              <span className="text-[#FE6000] font-medium text-xs tracking-widest uppercase mb-1 block">Active Assessment</span>
              <h2 className="font-montserrat font-bold text-xl text-[#0A243F]">{activeAssessment.title}</h2>
            </div>
            <button 
              onClick={returnToDashboard}
              className="text-[#0A243F]/40 hover:text-[#FE6000] flex items-center gap-2 text-sm font-bold transition-colors"
            >
              <X size={18} /> Exit (Progress will be lost)
            </button>
          </header>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-[#0A243F]/10">
            <div 
              className="h-full bg-[#FE6000] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Question Container */}
          <main className="flex-1 flex flex-col items-center justify-center p-6 py-12">
            <div className="max-w-3xl w-full animate-in slide-in-from-right duration-300">
              
              <div className="mb-8">
                <span className="bg-[#0A243F] text-white font-bold font-montserrat text-sm px-4 py-1.5 rounded-full mb-4 inline-block">
                  Question {currentQuestionIndex + 1} of {MOCK_QUESTIONS.length}
                </span>
                <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-[#0A243F] leading-tight mt-4">
                  {question.question}
                </h1>
              </div>

              <div className="space-y-4">
                {question.options.map((option, index) => {
                  const isSelected = answers[currentQuestionIndex] === index;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 group ${
                        isSelected 
                          ? 'border-[#FE6000] bg-[#FE6000]/5 shadow-md' 
                          : 'border-[#0A243F]/10 bg-white hover:border-[#969DF8] hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-[#FE6000]' : 'border-[#0A243F]/20 group-hover:border-[#969DF8]'
                      }`}>
                        {isSelected && <div className="w-3 h-3 bg-[#FE6000] rounded-full"></div>}
                      </div>
                      <span className={`text-lg font-medium ${isSelected ? 'text-[#0A243F]' : 'text-[#0A243F]/80'}`}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-12 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  disabled={!isAnswered || isSubmitting}
                  className="px-8 py-4 bg-[#FE6000] text-white rounded-xl font-bold font-montserrat hover:bg-[#e05600] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  ) : currentQuestionIndex === MOCK_QUESTIONS.length - 1 ? (
                    <>Submit Assessment <CheckCircle size={20} /></>
                  ) : (
                    <>Next Question <ArrowRight size={20} /></>
                  )}
                </button>
              </div>

            </div>
          </main>
        </div>
      </>
    );
  }

  // --- VIEW 1: DASHBOARD (The Lobby) ---
  return (
    <>
      <FontStyles />
      <div className="flex h-screen bg-[#F1F1F1] font-rubik">
        {/* Simple Sidebar */}
        <div className="w-64 bg-[#0A243F] text-white hidden md:flex flex-col">
          <div className="h-20 flex items-center px-8">
            <span className="font-montserrat font-bold text-2xl tracking-tight text-white">hammerjack</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium bg-[#969DF8] text-[#0A243F] transition-colors">
              <FileText size={20} /> My Assessments
            </button>
          </nav>
          <div className="p-4">
            <button onClick={() => setIsAuthenticated(false)} className="flex items-center justify-center gap-2 px-4 py-3 w-full bg-white/5 hover:bg-white/10 text-[#B0E9F8] rounded-lg transition-colors font-medium">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-20 bg-white flex items-center justify-end px-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold font-montserrat text-[#0A243F]">{EMPLOYEE_NAME}</div>
                <div className="text-xs text-[#FE6000] font-medium">Employee Portal</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#0A243F] text-white flex items-center justify-center font-bold font-montserrat">
                DC
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto space-y-10">
              
              {/* Hero Greeting */}
              <div>
                <span className="text-[#FE6000] font-medium text-sm tracking-wide uppercase mb-1 block">
                  Action Required
                </span>
                <h1 className="text-3xl font-bold font-montserrat text-[#0A243F]">
                  Welcome back, {EMPLOYEE_NAME.split(' ')[0]}.
                </h1>
                <p className="text-[#0A243F]/70 mt-2 text-lg">
                  You have <strong className="text-[#0A243F]">{PENDING_ASSESSMENTS.length} pending assessment(s)</strong> to complete.
                </p>
              </div>

              {/* Pending Assessments Grid */}
              <div>
                <h2 className="font-montserrat font-bold text-xl text-[#0A243F] mb-4">To Do</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {PENDING_ASSESSMENTS.map((task) => (
                    <div key={task.id} className="bg-white rounded-2xl p-6 shadow-sm border border-transparent hover:border-[#969DF8] transition-all flex flex-col justify-between h-48">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="bg-[#B0E9F8]/30 text-[#0A243F] px-3 py-1 rounded-full text-xs font-bold">
                            {task.category}
                          </span>
                          <span className="flex items-center gap-1 text-[#FE6000] text-xs font-bold">
                            <AlertTriangle size={14} /> Due {task.due}
                          </span>
                        </div>
                        <h3 className="font-montserrat font-bold text-[#0A243F] text-lg leading-tight">{task.title}</h3>
                        <p className="text-sm text-[#0A243F]/60 mt-2 flex items-center gap-2">
                          <Clock size={14} /> Est. {task.time} • {task.questions} Questions
                        </p>
                      </div>
                      <button 
                        onClick={() => startAssessment(task)}
                        className="mt-4 w-full bg-[#0A243F] text-white py-2.5 rounded-lg font-bold font-montserrat hover:bg-[#FE6000] transition-colors flex justify-center items-center gap-2"
                      >
                        <PlayCircle size={18} /> Start Assessment
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completed Assessments List */}
              <div>
                <h2 className="font-montserrat font-bold text-xl text-[#0A243F] mb-4">Completed History</h2>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#F1F1F1]">
                  {COMPLETED_ASSESSMENTS.map((item, idx) => (
                    <div key={item.id} className={`p-6 flex items-center justify-between ${idx !== COMPLETED_ASSESSMENTS.length - 1 ? 'border-b border-[#F1F1F1]' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <CheckCircle size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold font-montserrat text-[#0A243F]">{item.title}</h4>
                          <p className="text-xs text-[#0A243F]/60 mt-1">Completed on {item.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-[#0A243F]/50 uppercase tracking-widest mb-1">Score</div>
                        <div className="font-montserrat font-bold text-xl text-[#0A243F]">{item.score}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </>
  );
}

// Reused Branded Login Screen (Tailored for Employee)
function LoginScreen({ onLogin }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0A243F] flex items-center justify-center relative overflow-hidden font-rubik">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FE6000] rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#969DF8] rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 mx-4">
        <div className="p-10">
          <div className="text-center mb-10">
            <h1 className="font-montserrat font-bold text-3xl text-[#0A243F] tracking-tight">hammerjack</h1>
            <p className="text-sm text-[#0A243F]/60 mt-2 font-medium">Employee Assessment Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#0A243F] font-montserrat mb-2">Work Email</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A243F]/50" />
                <input 
                  type="email" 
                  required
                  defaultValue="david.chen@hammerjack.com"
                  className="w-full pl-12 pr-4 py-3 bg-[#F1F1F1] border-2 border-transparent text-[#0A243F] rounded-xl focus:outline-none focus:border-[#FE6000] transition-colors"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-[#FE6000] text-white rounded-xl font-bold font-montserrat hover:bg-[#e05600] transition-colors shadow-lg flex justify-center items-center gap-2 mt-4"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Sign In Securely <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
