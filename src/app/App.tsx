import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { ModuleSidebar } from './components/ModuleSidebar';
import { LessonViewer } from './components/LessonViewer';
import { LizardMascot } from './components/LizardMascot';
import { CongratulationsPage } from './components/CongratulationsPage';
import { UserProfilePanel } from './components/UserProfilePanel';

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'interactive' | 'pdf';
  duration: string;
  completed: boolean;
  videoUrl?: string;
  content?: string;
}

export interface Module {
  id: number;
  title: string;
  completionPercentage: number;
  lessons: Lesson[];
}

// All modules start at 0% with no lessons completed.
// Progress is calculated dynamically as students complete lessons.
// Do NOT pre-set completionPercentage or completed:true here —
// this data represents a brand-new student who has just received access after payment.
const mockModules: Module[] = [
  {
    id: 0,
    title: 'Meet Yourself',
    completionPercentage: 0,
    lessons: [
      // READING: NigerianTeacherLesson.tsx renders this as a long-form article
      { id: '0-1', title: 'The Nigerian Teacher Narrative', type: 'pdf', duration: '8 min', completed: false },
    ],
  },
  {
    id: 1,
    title: 'Teaching the Teacher',
    completionPercentage: 0,
    lessons: [
      // INTERACTIVE: EngagementScenarios.tsx handles this
      { id: '1-1', title: 'Engagement Techniques', type: 'interactive', duration: '25 min', completed: false },
      // INTERACTIVE: ClassroomManagement.tsx handles this
      { id: '1-2', title: 'Classroom Management', type: 'interactive', duration: '15 min', completed: false },
      // AUDIO: Vocal delivery & articulation — YouTube embed
      { id: '1-4', title: 'Communication — Vocal Delivery & Articulation', type: 'audio', duration: '22 min', completed: false, videoUrl: 'https://www.youtube.com/embed/gyIxVwQ98Bg' },
      // HTML: Lesson Planning Resources — rendered via LessonPlanningGuide.tsx + public/lessons/module-2-lesson-4.html
      { id: '1-6', title: 'Lesson Planning Resources', type: 'pdf', duration: '8 min', completed: false },
      // QUIZ: Module2Quiz.tsx handles this
      { id: '1-7', title: 'Module Quiz', type: 'interactive', duration: '20 min', completed: false },
    ],
  },
  {
    id: 2,
    title: 'AI in Online Teaching',
    completionPercentage: 0,
    lessons: [
      // VIDEO: Introduction to AI Tools — replace videoUrl with recorded intro video embed
      { id: '2-0', title: 'Introduction to AI Tools for Teachers', type: 'audio', duration: '14:15', completed: false, videoUrl: 'https://www.youtube.com/embed/HODL3erTx2k' },
      // INTERACTIVE: AIToolsLesson.tsx handles this as a carousel of tool cards — add real tool logos in /src/imports/
      { id: '2-1', title: 'AI Tools for ESL Teaching', type: 'interactive', duration: '30 min', completed: false },
      // READING: AIEthicsLesson.tsx renders this as a long-form article — add images/diagrams inside that component
      { id: '2-2', title: 'AI Ethics in Education', type: 'pdf', duration: '8 min', completed: false },
      // AUDIO: Future of AI in Teaching — replace with audio file/podcast embed URL
      { id: '2-3', title: 'Future of AI in Teaching', type: 'audio', duration: '', completed: false },
      // QUIZ: Module3Quiz.tsx handles this — update questions/answers inside that component
      { id: '2-4', title: 'Module Quiz', type: 'interactive', duration: '15 min', completed: false },
    ],
  },
  {
    id: 3,
    title: 'Getting Hired',
    completionPercentage: 0,
    lessons: [
      // INTERACTIVE: Module2Interactive.tsx handles this — add certification checklist/carousel content inside
      { id: '3-0', title: 'Getting Certified', type: 'interactive', duration: '15 min', completed: false },
      // READING: PortfolioLesson.tsx renders this — add portfolio template images/examples inside that component
      { id: '3-1', title: 'Build Your Portfolio', type: 'pdf', duration: '10 min', completed: false },
      // READING/PDF: IntroVideoLesson.tsx handles this — add sample intro video screenshots/tips inside
      { id: '3-2', title: 'Interview Preparation & Intro Video', type: 'pdf', duration: '4 min', completed: false },
      // VIDEO: Finding Online Teaching Jobs — replace videoUrl with recorded walkthrough video embed
      { id: '3-3', title: 'Finding Online Teaching Jobs', type: 'video', duration: '10:45', completed: false, videoUrl: 'https://www.youtube.com/embed/mo4vSeuSFwk' },
      // QUIZ: Module4Quiz.tsx handles this — update questions/answers inside that component
      { id: '3-4', title: 'Module Quiz', type: 'interactive', duration: '10 min', completed: false },
    ],
  },
  {
    id: 4,
    title: 'Teaching Platforms',
    completionPercentage: 0,
    lessons: [
      // INTERACTIVE: TeachingPlatformsLesson.tsx handles this
      { id: '4-1', title: 'Platform Tools & Features', type: 'interactive', duration: '25 min', completed: false },
      // READING/PDF: Setting Up Your Profile
      { id: '4-2', title: 'Setting Up Your Profile', type: 'pdf', duration: '8 min', completed: false },
    ],
  },
  {
    id: 5,
    title: 'Managing Me',
    completionPercentage: 0,
    lessons: [
      // READING: ManagingMeBodyLesson.tsx handles this
      { id: '5-1', title: 'Managing My Body', type: 'pdf', duration: '10 min', completed: false },
      // AUDIO: ManagingMeMindLesson.tsx handles this
      { id: '5-2', title: 'Managing My Mind & Social Life', type: 'audio', duration: '', completed: false },
      // QUIZ: Module6Quiz.tsx — FINAL LESSON; completing this triggers the congratulations screen
      { id: '5-3', title: 'Module Quiz', type: 'interactive', duration: '10 min', completed: false },
    ],
  },
];

// ── Progress persistence helpers ───────────────────────────────────────────
// Completed lesson IDs are stored as a JSON array under 'tbi_progress'.
// Last-open lesson ID is stored under 'tbi_last_lesson'.
// This survives page refreshes, tab closes, and Paystack redirects to the subdomain.
function loadCompletedIds(): Set<string> {
  try {
    const raw = localStorage.getItem('tbi_progress');
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveCompletedIds(ids: Set<string>) {
  localStorage.setItem('tbi_progress', JSON.stringify([...ids]));
}

function hydrateModules(base: Module[], completedIds: Set<string>): Module[] {
  return base.map((module) => {
    const lessons = module.lessons.map((l) => ({
      ...l,
      completed: completedIds.has(l.id),
    }));
    const completedCount = lessons.filter((l) => l.completed).length;
    return {
      ...module,
      lessons,
      completionPercentage: Math.round((completedCount / lessons.length) * 100),
    };
  });
}

export default function App() {
  const [modules, setModules] = useState<Module[]>(() =>
    hydrateModules(mockModules, loadCompletedIds())
  );

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(() => {
    const lastId = localStorage.getItem('tbi_last_lesson');
    if (!lastId) return null;
    const completedIds = loadCompletedIds();
    for (const mod of mockModules) {
      const found = mod.lessons.find((l) => l.id === lastId);
      if (found) return { ...found, completed: completedIds.has(found.id) };
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showDying, setShowDying] = useState(false);
  const [showDancing, setShowDancing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [isGraduating, setIsGraduating] = useState(false);

  // ── Profile & appearance state ─────────────────────────────
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('tbi_name') || '');
  const [profilePicture, setProfilePicture] = useState<string | null>(() => localStorage.getItem('tbi_avatar') || null);
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem('tbi_dark') === 'true');

  useEffect(() => { localStorage.setItem('tbi_name', userName); }, [userName]);
  useEffect(() => { if (profilePicture) localStorage.setItem('tbi_avatar', profilePicture); }, [profilePicture]);
  useEffect(() => { localStorage.setItem('tbi_dark', String(darkMode)); }, [darkMode]);

  const handleLessonSelect = (lesson: Lesson) => {
    localStorage.setItem('tbi_last_lesson', lesson.id);
    setIsLoading(true);
    setTimeout(() => {
      setSelectedLesson(lesson);
      setIsLoading(false);
    }, 1000);
  };

  const handleLessonComplete = (moduleId: number, lessonId: string) => {
    // Persist the newly completed lesson ID immediately
    const completedIds = loadCompletedIds();
    completedIds.add(lessonId);
    saveCompletedIds(completedIds);

    setModules((prevModules) => {
      const updatedModules = prevModules.map((module) => {
        if (module.id === moduleId) {
          const updatedLessons = module.lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, completed: true } : lesson
          );
          const completedCount = updatedLessons.filter((l) => l.completed).length;
          const newPercentage = Math.round((completedCount / updatedLessons.length) * 100);

          // Check if module just completed
          if (newPercentage === 100 && module.completionPercentage < 100) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
          }

          return {
            ...module,
            lessons: updatedLessons,
            completionPercentage: newPercentage,
          };
        }
        return module;
      });
      return updatedModules;
    });

    // Mark the currently-viewed lesson as complete in the UI immediately
    setSelectedLesson((prev) => prev?.id === lessonId ? { ...prev, completed: true } : prev);

    // Check if this is the final lesson (5-3) - show congratulations page
    if (lessonId === '5-3') {
      setShowCongratulations(true);
      return;
    }

    // Find and navigate to the next lesson
    const currentModule = modules.find((m) => m.id === moduleId);
    if (currentModule) {
      const currentLessonIndex = currentModule.lessons.findIndex((l) => l.id === lessonId);

      // Check if there's a next lesson in the current module
      if (currentLessonIndex < currentModule.lessons.length - 1) {
        const nextLesson = currentModule.lessons[currentLessonIndex + 1];
        handleLessonSelect(nextLesson);
      } else {
        // Check if there's a next module
        const nextModule = modules.find((m) => m.id === moduleId + 1);
        if (nextModule && nextModule.lessons.length > 0) {
          handleLessonSelect(nextModule.lessons[0]);
        } else {
          // No next lesson, just update current lesson to show as completed
          if (selectedLesson && selectedLesson.id === lessonId) {
            setSelectedLesson({ ...selectedLesson, completed: true });
          }
        }
      }
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`flex h-screen font-['Inter',sans-serif] overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-[#0f0f1a]' : 'bg-[#FAF9F6]'}`}>
      {/* Mobile overlay backdrop — closes sidebar when tapped */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <ModuleSidebar
        modules={modules}
        selectedLesson={selectedLesson}
        onLessonSelect={(lesson) => {
          handleLessonSelect(lesson);
          if (window.innerWidth < 768) closeSidebar();
        }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        userName={userName}
        profilePicture={profilePicture}
        onProfileOpen={() => setProfileOpen(true)}
      />

      {/* Hamburger — always visible when sidebar is closed */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-3 left-3 z-50 bg-[#6667AB] hover:bg-[#5557AB] text-white p-3 rounded-xl shadow-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      )}

      <main className="flex-1 overflow-y-auto overflow-x-hidden relative min-w-0">
        {showCongratulations ? (
          <CongratulationsPage />
        ) : (
          <LessonViewer
            lesson={selectedLesson}
            onComplete={(lessonId) => {
              const moduleId = modules.findIndex((m) =>
                m.lessons.some((l) => l.id === lessonId)
              );
              if (moduleId !== -1) {
                handleLessonComplete(moduleId, lessonId);
              }
            }}
            onCorrectAnswer={() => {
              setShowDancing(true);
              setTimeout(() => setShowDancing(false), 1000);
            }}
            onWrongAnswer={() => {
              setShowDying(true);
              setTimeout(() => setShowDying(false), 4000);
            }}
          />
        )}
      </main>

      <LizardMascot
        isWalking={isLoading}
        isCelebrating={showCelebration}
        isDying={showDying}
        isDancing={showDancing}
        isGraduating={isGraduating}
      />

      <UserProfilePanel
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        userName={userName}
        onNameChange={setUserName}
        profilePicture={profilePicture}
        onProfilePictureChange={setProfilePicture}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode((d) => !d)}
        modules={modules}
      />
    </div>
  );
}
