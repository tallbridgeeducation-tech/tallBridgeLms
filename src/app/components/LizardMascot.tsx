import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { X } from 'lucide-react';

interface LizardMascotProps {
  isWalking: boolean;
  isCelebrating: boolean;
  isDying?: boolean;
  isDancing?: boolean;
  isGraduating?: boolean;
}

type BubbleView = 'welcome' | 'pomodoro' | 'liveclass' | 'support';
type PomodoroPhase = 'study' | 'break';

export function LizardMascot({ isWalking, isCelebrating, isDying = false, isDancing = false, isGraduating = false }: LizardMascotProps) {
  const confettiRef = useRef<HTMLDivElement>(null);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleView, setBubbleView] = useState<BubbleView>('welcome');
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroPhase, setPomodoroPhase] = useState<PomodoroPhase>('study');
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [cycleCount, setCycleCount] = useState(1);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (isCelebrating && confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          x: rect.left / window.innerWidth,
          y: rect.top / window.innerHeight,
        },
        colors: ['#84CC16', '#6667AB', '#F5D5E0'],
      });
    }
  }, [isCelebrating]);

  // Pomodoro timer logic
  useEffect(() => {
    if (!pomodoroActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Switch phases
          if (pomodoroPhase === 'study') {
            setPomodoroPhase('break');
            return 5 * 60; // 5 minutes break
          } else {
            setPomodoroPhase('study');
            setCycleCount((c) => c + 1);
            return 20 * 60; // 20 minutes study
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroPhase]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = pomodoroPhase === 'study' ? 20 * 60 : 5 * 60;
    return ((total - timeLeft) / total) * 100;
  };

  const handleStartPomodoro = () => {
    setBubbleView('pomodoro');
    setPomodoroActive(true);
    setPomodoroPhase('study');
    setTimeLeft(20 * 60);
    setCycleCount(1);
    setIsMinimized(false);
  };

  const handleStopPomodoro = () => {
    setPomodoroActive(false);
    setBubbleView('welcome');
    setTimeLeft(20 * 60);
    setCycleCount(1);
    setIsMinimized(false);
  };

  const handleContinuePomodoro = () => {
    // Just continue the cycle, it's already running
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setShowBubble(false);
  };

  return (
    <motion.div
      ref={confettiRef}
      className="fixed bottom-24 right-4 z-50 touch-auto cursor-grab"
      drag
      dragMomentum={false}
      dragElastic={0.1}
      whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
      dragConstraints={{
        top: -window.innerHeight + 160,
        left: -(window.innerWidth - 80),
        right: 0,
        bottom: 60,
      }}
    >
      {/* Minimized Indicator */}
      {isMinimized && pomodoroActive && !showBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-full mb-2 right-0 bg-[#421869] rounded-full px-3 py-1.5 shadow-lg cursor-pointer"
          onClick={() => {
            setShowBubble(true);
            setIsMinimized(false);
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#96D74C] rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-medium">{formatTime(timeLeft)}</span>
          </div>
        </motion.div>
      )}

      {/* Chat Bubble */}
      <AnimatePresence>
        {showBubble && !isDying && !isDancing && !isWalking && !isCelebrating && !isGraduating && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute bottom-full mb-4 right-0 w-64 bg-[#421869] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#721CB8] px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#96D74C] rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">Liz</span>
              </div>
              <button
                onClick={() => {
                  if (pomodoroActive) {
                    handleMinimize();
                  } else {
                    setShowBubble(false);
                    setBubbleView('welcome');
                  }
                }}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-3">
              {bubbleView === 'welcome' && (
                <div className="space-y-3">
                  <div className="text-white text-xs">
                    <p className="font-medium mb-0.5">Hey there! 👋</p>
                    <p className="text-white/80">How can I help you today?</p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleStartPomodoro}
                      className="w-full bg-[#96D74C] hover:bg-[#9ACC33] text-[#421869] px-3 py-2 rounded-full font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      📚 Start Studying (Pomodoro)
                    </button>
                    <button
                      onClick={() => setBubbleView('liveclass')}
                      className="w-full bg-[#96D74C] hover:bg-[#9ACC33] text-[#421869] px-3 py-2 rounded-full font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      🎓 Join Live Class
                    </button>
                    <button
                      onClick={() => setBubbleView('support')}
                      className="w-full bg-[#96D74C] hover:bg-[#9ACC33] text-[#421869] px-3 py-2 rounded-full font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      💬 Contact Support
                    </button>
                  </div>
                </div>
              )}

              {bubbleView === 'pomodoro' && (
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-white/60 text-[10px] mb-1 uppercase tracking-wider font-medium">
                      {pomodoroPhase === 'study' ? '📚 Study Time' : '☕ Break Time'}
                    </div>
                    <div className="text-white/80 text-[10px] mb-3">Cycle {cycleCount}</div>

                    {/* Circular Progress */}
                    <div className="relative w-36 h-36 mx-auto mb-3">
                      <svg className="transform -rotate-90 w-full h-full">
                        {/* Background circle */}
                        <circle
                          cx="72"
                          cy="72"
                          r="66"
                          stroke="#721CB8"
                          strokeWidth="6"
                          fill="none"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="72"
                          cy="72"
                          r="66"
                          stroke="#96D74C"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 66}`}
                          strokeDashoffset={`${2 * Math.PI * 66 * (1 - getProgress() / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-white">{formatTime(timeLeft)}</div>
                        <div className="text-[10px] text-white/60 mt-0.5">
                          {pomodoroPhase === 'study' ? '20:00' : '05:00'}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleStopPomodoro}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                      >
                        Stop
                      </button>
                      <button
                        onClick={handleContinuePomodoro}
                        className="flex-1 bg-[#96D74C] hover:bg-[#9ACC33] text-[#421869] px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                      >
                        Keep Going
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {bubbleView === 'liveclass' && (
                <div className="space-y-2">
                  <div className="text-white text-xs">
                    <p className="font-medium mb-0.5">🎓 Live Classes</p>
                    <p className="text-white/80 text-[11px] mb-2">
                      No live classes scheduled at the moment. Check back soon!
                    </p>
                    <div className="bg-[#721CB8] rounded-lg p-2 text-[11px] text-white/70">
                      Next class: <span className="text-[#96D74C]">Coming Soon</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setBubbleView('welcome')}
                    className="w-full bg-[#96D74C] hover:bg-[#9ACC33] text-[#421869] px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                  >
                    ← Back
                  </button>
                </div>
              )}

              {bubbleView === 'support' && (
                <div className="space-y-2">
                  <div className="text-white text-xs">
                    <p className="font-medium mb-0.5">💬 Contact Support</p>
                    <p className="text-white/80 text-[11px] mb-2">
                      We're here to help. Reach out and a member of our team will get back to you.
                    </p>
                    <div className="space-y-1.5 text-[11px]">

                      {/* Email */}
                      <a
                        href="mailto:support@tallbridgeeducation.com"
                        className="flex items-center gap-2 bg-[#721CB8] hover:bg-[#5a1690] rounded-lg p-2 transition-colors no-underline"
                      >
                        <span className="text-base leading-none">✉️</span>
                        <div>
                          <div className="text-white/60 text-[10px]">Email</div>
                          <div className="text-[#96D74C]">support@tallbridgeeducation.com</div>
                        </div>
                      </a>

                      {/* Phone */}
                      <a
                        href="tel:+2348164591710"
                        className="flex items-center gap-2 bg-[#721CB8] hover:bg-[#5a1690] rounded-lg p-2 transition-colors no-underline"
                      >
                        <span className="text-base leading-none">📞</span>
                        <div>
                          <div className="text-white/60 text-[10px]">Phone</div>
                          <div className="text-[#96D74C]">+234 816 459 1710</div>
                        </div>
                      </a>

                      {/* WhatsApp with pre-filled message */}
                      <a
                        href={`https://wa.me/2348164591710?text=${encodeURIComponent('Good day, Tall Bridge Support. I am a student on the Tall Bridge Institute LMS and I have a concern I would like help with.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] rounded-lg p-2 transition-colors no-underline"
                      >
                        <span className="text-base leading-none">💬</span>
                        <div>
                          <div className="text-white/80 text-[10px]">WhatsApp</div>
                          <div className="text-white font-medium">Message us on WhatsApp</div>
                        </div>
                      </a>

                    </div>
                  </div>
                  <button
                    onClick={() => setBubbleView('welcome')}
                    className="w-full bg-[#96D74C] hover:bg-[#9ACC33] text-[#421869] px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                  >
                    ← Back
                  </button>
                </div>
              )}
            </div>

            {/* Chat bubble tail */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#421869] transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lizard Mascot */}
      <AnimatePresence mode="wait">
        {isGraduating && (
          <motion.div
            key="graduating"
            initial={{ x: -window.innerWidth, y: 0, scale: 1 }}
            animate={{
              x: [
                -window.innerWidth,
                window.innerWidth - 200,
                window.innerWidth - 200,
                -100,
                -100,
                0
              ],
              y: [0, 0, 0, 0, 0, 0],
              rotate: [0, 0, 0, 0, 360, 0],
              scale: [1, 1, 1, 1, 1.2, 1]
            }}
            transition={{
              duration: 6,
              times: [0, 0.35, 0.4, 0.65, 0.85, 1],
              ease: 'easeInOut'
            }}
            className="fixed bottom-24 right-4 z-50 pointer-events-none"
          >
            <motion.svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              animate={{
                scaleX: [1, 1, -1, -1, 1],
              }}
              transition={{
                duration: 6,
                times: [0, 0.4, 0.41, 0.65, 1]
              }}
            >
              <ellipse cx="60" cy="60" rx="25" ry="20" fill="#84CC16" />
              <circle cx="75" cy="50" r="15" fill="#84CC16" />
              <path d="M 77 48 Q 80 45 83 48" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 70 52 Q 75 56 80 52" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
              <motion.path
                d="M 35 60 Q 20 65 15 55"
                stroke="#84CC16"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                animate={{
                  d: [
                    'M 35 60 Q 20 65 15 55',
                    'M 35 60 Q 20 55 15 65',
                    'M 35 60 Q 20 65 15 55'
                  ]
                }}
                transition={{ duration: 0.3, repeat: Infinity }}
              />
              <motion.ellipse
                cx="50"
                cy="75"
                rx="4"
                ry="8"
                fill="#6B9B0F"
                animate={{ scaleY: [1, 0.8, 1], y: [0, 2, 0] }}
                transition={{ duration: 0.25, repeat: Infinity }}
              />
              <motion.ellipse
                cx="70"
                cy="75"
                rx="4"
                ry="8"
                fill="#6B9B0F"
                animate={{ scaleY: [0.8, 1, 0.8], y: [2, 0, 2] }}
                transition={{ duration: 0.25, repeat: Infinity }}
              />
              <circle cx="55" cy="58" r="2" fill="#6B9B0F" opacity="0.6" />
              <circle cx="65" cy="62" r="2" fill="#6B9B0F" opacity="0.6" />
              {/* Graduation cap */}
              <path d="M 75 30 L 70 45 L 80 45 Z" fill="#6667AB" />
              <circle cx="75" cy="28" r="3" fill="#F5D5E0" />
            </motion.svg>

            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#96D74C] px-3 py-1 rounded-full shadow-lg text-xs font-medium text-[#421869] whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              You did it! 🎓
            </motion.div>
          </motion.div>
        )}

        {isDying && (
          <motion.div
            key="dying"
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: [1, 1, 1, 1, 1],
              scale: [1, 1.1, 0.9, 0.95, 1],
              rotate: [0, -10, 90, 90, 0],
              y: [0, -20, 40, 40, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, times: [0, 0.15, 0.3, 0.75, 1] }}
            className="relative cursor-grab active:cursor-grabbing"
            onClick={() => setShowBubble(!showBubble)}
          >
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <ellipse cx="60" cy="60" rx="25" ry="20" fill="#84CC16" opacity="0.7" />
              <circle cx="75" cy="50" r="15" fill="#84CC16" opacity="0.7" />
              <path d="M 77 46 L 81 50 M 81 46 L 77 50" stroke="black" strokeWidth="2" strokeLinecap="round" />
              <path d="M 70 54 Q 75 51 80 54" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 35 60 Q 20 65 15 70" stroke="#84CC16" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.7" />
              <ellipse cx="50" cy="75" rx="4" ry="8" fill="#6B9B0F" opacity="0.7" />
              <ellipse cx="70" cy="75" rx="4" ry="8" fill="#6B9B0F" opacity="0.7" />
              <circle cx="55" cy="58" r="2" fill="#6B9B0F" opacity="0.4" />
              <circle cx="65" cy="62" r="2" fill="#6B9B0F" opacity="0.4" />
            </svg>

            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 px-3 py-1 rounded-full shadow-lg text-xs font-medium text-white whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Oops! 💀
            </motion.div>
          </motion.div>
        )}

        {isDancing && (
          <motion.div
            key="dancing"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative cursor-grab active:cursor-grabbing"
            onClick={() => setShowBubble(!showBubble)}
          >
            <motion.svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              animate={{
                rotate: [0, -5, 5, -5, 5, 0],
                y: [0, -10, 0, -10, 0],
              }}
              transition={{ duration: 0.8, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
            >
              <ellipse cx="60" cy="60" rx="25" ry="20" fill="#84CC16" />
              <circle cx="75" cy="50" r="15" fill="#84CC16" />
              <motion.g animate={{ scaleY: [1, 0.3, 1] }} transition={{ duration: 0.3, repeat: 2 }}>
                <circle cx="80" cy="48" r="3" fill="white" />
                <circle cx="81" cy="48" r="1.5" fill="black" />
              </motion.g>
              <path d="M 70 52 Q 75 56 80 52" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
              <motion.path
                d="M 35 60 Q 20 65 15 55"
                stroke="#84CC16"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                animate={{
                  d: [
                    'M 35 60 Q 20 65 15 55',
                    'M 35 60 Q 20 55 15 65',
                    'M 35 60 Q 20 65 15 55'
                  ]
                }}
                transition={{ duration: 0.2, repeat: 4 }}
              />
              <motion.ellipse
                cx="50"
                cy="75"
                rx="4"
                ry="8"
                fill="#6B9B0F"
                animate={{ scaleX: [1, 1.3, 1], x: [0, -2, 0] }}
                transition={{ duration: 0.4, repeat: 2 }}
              />
              <motion.ellipse
                cx="70"
                cy="75"
                rx="4"
                ry="8"
                fill="#6B9B0F"
                animate={{ scaleX: [1, 1.3, 1], x: [0, 2, 0] }}
                transition={{ duration: 0.4, repeat: 2, delay: 0.2 }}
              />
              <circle cx="55" cy="58" r="2" fill="#6B9B0F" opacity="0.6" />
              <circle cx="65" cy="62" r="2" fill="#6B9B0F" opacity="0.6" />
            </motion.svg>

            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#84CC16] px-3 py-1 rounded-full shadow-lg text-xs font-medium text-white whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Correct! ✨
            </motion.div>
          </motion.div>
        )}

        {isWalking && !isDying && !isDancing && (
          <motion.div
            key="walking"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="relative cursor-grab active:cursor-grabbing"
            onClick={() => setShowBubble(!showBubble)}
          >
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <motion.ellipse
                cx="60"
                cy="60"
                rx="25"
                ry="20"
                fill="#84CC16"
                animate={{ scaleY: [1, 0.95, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <motion.circle
                cx="75"
                cy="50"
                r="15"
                fill="#84CC16"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <circle cx="80" cy="48" r="3" fill="white" />
              <circle cx="81" cy="48" r="1.5" fill="black" />
              <motion.path
                d="M 35 60 Q 20 65 15 55"
                stroke="#84CC16"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                animate={{ d: ['M 35 60 Q 20 65 15 55', 'M 35 60 Q 20 55 15 65', 'M 35 60 Q 20 65 15 55'] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <motion.ellipse
                cx="50"
                cy="75"
                rx="4"
                ry="8"
                fill="#6B9B0F"
                animate={{ scaleY: [1, 0.8, 1], y: [0, 2, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <motion.ellipse
                cx="70"
                cy="75"
                rx="4"
                ry="8"
                fill="#6B9B0F"
                animate={{ scaleY: [0.8, 1, 0.8], y: [2, 0, 2] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <circle cx="55" cy="58" r="2" fill="#6B9B0F" opacity="0.6" />
              <circle cx="65" cy="62" r="2" fill="#6B9B0F" opacity="0.6" />
            </svg>

            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg text-xs font-medium text-gray-700 whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Loading...
            </motion.div>
          </motion.div>
        )}

        {isCelebrating && (
          <motion.div
            key="celebrating"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative cursor-grab active:cursor-grabbing"
            onClick={() => setShowBubble(!showBubble)}
          >
            <motion.svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.6, repeat: 3 }}
            >
              <ellipse cx="60" cy="60" rx="25" ry="20" fill="#84CC16" />
              <circle cx="75" cy="50" r="15" fill="#84CC16" />
              <path d="M 77 48 Q 80 45 83 48" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 70 52 Q 75 56 80 52" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
              <motion.path
                d="M 35 60 Q 20 65 15 55"
                stroke="#84CC16"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                animate={{ d: ['M 35 60 Q 20 65 15 55', 'M 35 60 Q 20 45 15 35', 'M 35 60 Q 20 65 15 55'] }}
                transition={{ duration: 0.3, repeat: 6 }}
              />
              <ellipse cx="50" cy="75" rx="4" ry="8" fill="#6B9B0F" />
              <ellipse cx="70" cy="75" rx="4" ry="8" fill="#6B9B0F" />
              <circle cx="55" cy="58" r="2" fill="#6B9B0F" opacity="0.6" />
              <circle cx="65" cy="62" r="2" fill="#6B9B0F" opacity="0.6" />
              <path d="M 75 30 L 70 45 L 80 45 Z" fill="#6667AB" />
              <circle cx="75" cy="28" r="3" fill="#F5D5E0" />
            </motion.svg>

            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#84CC16] px-3 py-1 rounded-full shadow-lg text-xs font-medium text-white whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Great job! 🎉
            </motion.div>
          </motion.div>
        )}

        {!isWalking && !isCelebrating && !isDying && !isDancing && !isGraduating && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="cursor-grab active:cursor-grabbing"
            onClick={() => {
              if (isMinimized && pomodoroActive) {
                setShowBubble(true);
                setIsMinimized(false);
              } else {
                setShowBubble(!showBubble);
              }
            }}
          >
            <motion.svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ellipse cx="60" cy="60" rx="25" ry="20" fill="#84CC16" />
              <circle cx="75" cy="50" r="15" fill="#84CC16" />
              <motion.g
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4 }}
              >
                <circle cx="80" cy="48" r="3" fill="white" />
                <circle cx="81" cy="48" r="1.5" fill="black" />
              </motion.g>
              <path d="M 35 60 Q 20 65 15 55" stroke="#84CC16" strokeWidth="8" fill="none" strokeLinecap="round" />
              <ellipse cx="50" cy="75" rx="4" ry="8" fill="#6B9B0F" />
              <ellipse cx="70" cy="75" rx="4" ry="8" fill="#6B9B0F" />
              <circle cx="55" cy="58" r="2" fill="#6B9B0F" opacity="0.6" />
              <circle cx="65" cy="62" r="2" fill="#6B9B0F" opacity="0.6" />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
