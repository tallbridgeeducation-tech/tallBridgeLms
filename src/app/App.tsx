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
    completionPercentage: 0, // starts at 0% for every new student
    lessons: [
      // VIDEO: Replace videoUrl with the actual uploaded welcome video URL (e.g. Vimeo/YouTube embed link)
      { id: '0-0', title: 'Welcome to Tall Bridge Education', type: 'video', duration: '5:30', completed: false },
      // READING: NigerianTeacherLesson.tsx renders this as a long-form article — add images/illustrations there
      { id: '0-1', title: 'The Nigerian Teacher Narrative', type: 'pdf', duration: '8 min', completed: false },
      // INTERACTIVE: Discovering Your Teaching Style — add quiz/carousel content in a dedicated component
      { id: '0-2', title: 'Discovering Your Teaching Style', type: 'interactive', duration: '15 min', completed: false },
      // AUDIO: Replace with actual audio file URL (MP3/podcast embed) for the reflection exercise
      { id: '0-3', title: 'Reflection Exercise', type: 'audio', duration: '', completed: false },
    ],
  },
  {
    id: 1,
    title: 'Teaching the Teacher',
    completionPercentage: 0,
    lessons: [
      // VIDEO: Pedagogy Fundamentals — replace videoUrl with recorded lecture embed
      { id: '1-0', title: 'Pedagogy Fundamentals', type: 'video', duration: '15:30', completed: false },
      // INTERACTIVE: EngagementScenarios.tsx handles this — add scenario images/illustrations inside that component
      { id: '1-1', title: 'Engagement Techniques', type: 'interactive', duration: '25 min', completed: false },
      // INTERACTIVE: ClassroomManagement.tsx handles this — add scenario content/images inside that component
      { id: '1-2', title: 'Classroom Management', type: 'interactive', duration: '15 min', completed: false },
      // VIDEO: Communication verbal vs non-verbal — replace videoUrl with recorded video embed
      { id: '1-3', title: 'Communication — Verbal vs Non-Verbal', type: 'video', duration: '18:45', completed: false },
      // AUDIO: Vocal delivery & articulation — replace with audio file/podcast embed URL
      { id: '1-4', title: 'Communication — Vocal Delivery & Articulation', type: 'audio', duration: '22 min', completed: false, videoUrl: 'https://www.youtube.com/embed/gyIxVwQ98Bg' },
      // VIDEO: Body language & gestures — replace videoUrl with recorded video embed
      { id: '1-5', title: 'Communication — Body Language & Gestures', type: 'video', duration: '16:30', completed: false },
      // READING/PDF: Lesson Planning Guide — replace with embedded PDF viewer or downloadable PDF link
      { id: '1-6', title: 'Lesson Planning Guide', type: 'pdf', duration: '12 min', completed: false },
      // QUIZ: Module2Quiz.tsx handles this — update questions/answers inside that component
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
      // VIDEO: Teaching Platforms intro — replace videoUrl with platform walkthrough video embed
      { id: '4-0', title: 'Introduction to Teaching Platforms', type: 'video', duration: '10:00', completed: false },
      // INTERACTIVE: TeachingPlatformsLesson.tsx handles this — add platform screenshots/demo content inside
      { id: '4-1', title: 'Platform Tools & Features', type: 'interactive', duration: '25 min', completed: false },
      // READING/PDF: Setting Up Your Profile — replace with embedded PDF or step-by-step illustrated guide
      { id: '4-2', title: 'Setting Up Your Profile', type: 'pdf', duration: '8 min', completed: false },
    ],
  },
  {
    id: 5,
    title: 'Managing Me',
    completionPercentage: 0,
    lessons: [
      // VIDEO: How to Manage Me — replace videoUrl with recorded video embed
      { id: '5-0', title: 'How to Manage Me', type: 'video', duration: '12:00', completed: false },
      // READING: ManagingMeBodyLesson.tsx renders this — add wellness/body-care images inside that component
      { id: '5-1', title: 'Managing My Body', type: 'pdf', duration: '10 min', completed: false },
      // AUDIO: ManagingMeMindLesson.tsx renders this — add meditation/mindfulness audio embed inside that component
      { id: '5-2', title: 'Managing My Mind & Social Life', type: 'audio', duration: '', completed: false },
      // QUIZ: Module6Quiz.tsx handles this — this is the final lesson; completing it triggers the congratulations page
      { id: '5-3', title: 'Module Quiz', type: 'interactive', duration: '10 min', completed: false },
    ],
  },
];

export default function App() {
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
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
    setIsLoading(true);
    setTimeout(() => {
      setSelectedLesson(lesson);
      setIsLoading(false);
    }, 1000);
  };

  const handleLessonComplete = (moduleId: number, lessonId: string) => {
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