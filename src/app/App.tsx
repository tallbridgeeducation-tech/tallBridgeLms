import { Video, Headphones, Play, FileText, CheckCircle, BookOpen } from 'lucide-react';
import { useRef, useEffect } from 'react';
import type { Lesson } from '../App';

// Save/restore native video playback position per lesson ID
function getSavedTime(lessonId: string): number {
  return parseFloat(localStorage.getItem(`tbi_vpos_${lessonId}`) || '0');
}
function saveTime(lessonId: string, time: number) {
  localStorage.setItem(`tbi_vpos_${lessonId}`, String(Math.floor(time)));
}
import { NigerianTeacherLesson } from './NigerianTeacherLesson';
import { Module2Interactive } from './Module2Interactive';
import { EngagementScenarios } from './EngagementScenarios';
import { PortfolioLesson } from './PortfolioLesson';
import { ClassroomManagement } from './ClassroomManagement';
import { AIToolsLesson } from './AIToolsLesson';
import { AIEthicsLesson } from './AIEthicsLesson';
import { TeachingPlatformsLesson } from './TeachingPlatformsLesson';
import { IntroVideoLesson } from './IntroVideoLesson';
import { ManagingMeBodyLesson } from './ManagingMeBodyLesson';
import { ManagingMeMindLesson } from './ManagingMeMindLesson';
import { Module2Quiz } from './Module2Quiz';
import { Module3Quiz } from './Module3Quiz';
import { Module4Quiz } from './Module4Quiz';
import { LessonPlanningGuide } from './LessonPlanningGuide';
import { Module6Quiz } from './Module6Quiz';
import { logo } from '../assets';

interface LessonViewerProps {
  lesson: Lesson | null;
  onComplete: (lessonId: string) => void;
  onCorrectAnswer?: () => void;
  onWrongAnswer?: () => void;
}

export function LessonViewer({ lesson, onComplete, onCorrectAnswer, onWrongAnswer }: LessonViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Restore saved playback position when lesson changes, save on time update
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !lesson) return;
    const saved = getSavedTime(lesson.id);
    if (saved > 0) el.currentTime = saved;
    const onTimeUpdate = () => saveTime(lesson.id, el.currentTime);
    el.addEventListener('timeupdate', onTimeUpdate);
    return () => el.removeEventListener('timeupdate', onTimeUpdate);
  }, [lesson?.id]);

  if (!lesson) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <div className="text-center max-w-sm sm:max-w-md px-4 sm:px-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
            <img
              src={logo}
              alt="Tall Bridge Institute"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Welcome to Tall Bridge Institute</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-3">
            Select a lesson from the sidebar to begin your learning journey.
          </p>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Good luck!
          </p>
        </div>
      </div>
    );
  }

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return <Video size={20} />;
      case 'audio':
        return <Headphones size={20} />;
      case 'interactive':
        return <Play size={20} />;
      case 'pdf':
        return <FileText size={20} />;
    }
  };

  const getLessonTypeLabel = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return 'Video Lesson';
      case 'audio':
        return 'Audio Lesson';
      case 'interactive':
        return 'Interactive Exercise';
      case 'pdf':
        return 'Reading Material';
    }
  };

  // Lessons that render their own full-screen layout with a built-in header —
  // the LessonViewer top bar is hidden for these to prevent a duplicate title.
  const SELF_HEADED_LESSONS = new Set([
    '0-1', // NigerianTeacherLesson
    '1-1', // EngagementScenarios
    '1-2', // ClassroomManagement
    '1-6', // LessonPlanningGuide
    '1-7', // Module2Quiz
    '2-1', // AIToolsLesson
    '2-2', // AIEthicsLesson
    '2-4', // Module3Quiz
    '3-0', // Module2Interactive
    '3-1', // PortfolioLesson
    '3-2', // IntroVideoLesson
    '3-4', // Module4Quiz
    '4-1', // TeachingPlatformsLesson
    '5-1', // ManagingMeBodyLesson
    '5-2', // ManagingMeMindLesson
    '5-3', // Module6Quiz
  ]);

  const showHeader = !SELF_HEADED_LESSONS.has(lesson.id);

  return (
    <div className="h-full flex flex-col">
      {/* Header — hidden for lessons that manage their own title/header */}
      {showHeader && (
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6 relative">
        {/* Logo hidden on mobile — hamburger sits at the same top-left position */}
        <img
          src={logo}
          alt="Tall Bridge Institute"
          className="hidden sm:block absolute top-1/2 -translate-y-1/2 left-8 w-8 h-8 object-contain"
        />
        {/* pl-14 on mobile clears the fixed hamburger button; sm+ uses sidebar so normal padding */}
        <div className="flex items-start justify-between pl-14 sm:pl-10">
          <div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
              <div className="flex items-center gap-1.5">
                {getLessonIcon(lesson.type)}
                <span>{getLessonTypeLabel(lesson.type)}</span>
              </div>
              {lesson.duration && <><span>•</span><span>{lesson.duration}</span></>}
            </div>
            <h1 className="text-xl sm:text-3xl font-semibold text-gray-900">{lesson.title}</h1>
          </div>

          {lesson.completed && (
            <div className="flex items-center gap-1.5 sm:gap-2 bg-[#84CC16]/10 text-[#84CC16] px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
              <CheckCircle size={16} />
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">Completed</span>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#FAF9F6]">
        {/*
          ═══════════════════════════════════════════════════════════════════════════════
          MEDIA FOLDER STRUCTURE
          ───────────────────────────────────────────────────────────────────────────────
          Drop your media files into these folders before wiring them up:

          📁 public/videos/        ← MP4 or WebM files for self-hosted video
                                     OR store the YouTube/Vimeo embed URL in App.tsx
                                     Naming convention: mod{N}-lesson-{slug}.mp4
                                     e.g. public/videos/mod1-welcome.mp4
                                          public/videos/mod2-pedagogy-fundamentals.mp4
                                          public/videos/mod2-verbal-nonverbal.mp4
                                          public/videos/mod2-body-language.mp4
                                          public/videos/mod3-ai-intro.mp4
                                          public/videos/mod4-finding-jobs.mp4
                                          public/videos/mod5-platforms-intro.mp4
                                          public/videos/mod6-managing-me.mp4

          📁 public/audio/         ← MP3 files for self-hosted audio lessons
                                     Naming convention: mod{N}-lesson-{slug}.mp3
                                     e.g. public/audio/mod1-reflection-exercise.mp3
                                          public/audio/mod2-vocal-delivery.mp3
                                          public/audio/mod3-future-of-ai.mp3
                                          public/audio/mod6-managing-my-mind.mp3

          📁 public/pdfs/          ← PDF files for downloadable/embeddable reading material
                                     Naming convention: mod{N}-lesson-{slug}.pdf
                                     e.g. public/pdfs/mod2-lesson-planning-guide.pdf
                                          public/pdfs/mod5-setting-up-your-profile.pdf

          📁 public/images/        ← All image assets (lesson illustrations, screenshots, thumbnails)
                                     logo.png is already here — do NOT move or rename it
                                     e.g. public/images/mod1-nigerian-classroom.jpg
                                          public/images/mod4-portfolio-template.png
                                          public/images/mod6-wellness-sleep.jpg

          📁 src/imports/          ← Tool logos and Figma-imported assets (already in use by AIToolsLesson)
                                     e.g. src/imports/logo_suno-1.jpeg (already exists)
          ═══════════════════════════════════════════════════════════════════════════════

          MEDIA ROUTING — each lesson ID maps to a dedicated component below.
          Lessons without a dedicated component fall through to the generic type-based UI further down.

          HOW TO WIRE UP REAL MEDIA FOR EACH LESSON:
          ─────────────────────────────────────────────────────────────────────────────────
          MODULE 1 — Meet Yourself
            '0-0'  VIDEO   → set videoUrl: 'https://www.youtube.com/embed/VIDEO_ID'
                             OR videoUrl: '/videos/mod1-welcome.mp4' in App.tsx lesson data
            '0-1'  READING → NigerianTeacherLesson.tsx — add <img src="/images/..."> inside that file
            '0-2'  INTERACTIVE → no dedicated component yet; create one for the teaching-style quiz/carousel
            '0-3'  AUDIO   → uses generic audio block below
                             replace Play button with: <audio controls src="/audio/mod1-reflection-exercise.mp3" />

          MODULE 2 — Teaching the Teacher
            '1-0'  VIDEO   → set videoUrl in App.tsx → public/videos/mod2-pedagogy-fundamentals.mp4
            '1-1'  INTERACTIVE → EngagementScenarios.tsx — add scenario images from public/images/ inside
            '1-2'  INTERACTIVE → ClassroomManagement.tsx — add scenario images from public/images/ inside
            '1-3'  VIDEO   → set videoUrl in App.tsx → public/videos/mod2-verbal-nonverbal.mp4
            '1-4'  AUDIO   → uses generic audio block below
                             replace Play button with: <audio controls src="/audio/mod2-vocal-delivery.mp3" />
            '1-5'  VIDEO   → set videoUrl in App.tsx → public/videos/mod2-body-language.mp4
            '1-6'  READING/PDF → uses generic pdf block below
                             replace content with: <iframe src="/pdfs/mod2-lesson-planning-guide.pdf" />
            '1-7'  QUIZ    → Module2Quiz.tsx — update questions and CORRECT_ANSWERS array inside that file

          MODULE 3 — AI in Online Teaching
            '2-0'  VIDEO   → set videoUrl in App.tsx → public/videos/mod3-ai-intro.mp4
            '2-1'  INTERACTIVE → AIToolsLesson.tsx — add tool logos to src/imports/ and update logo paths
            '2-2'  READING → AIEthicsLesson.tsx — add diagrams from public/images/ inside that file
            '2-3'  AUDIO   → uses generic audio block below
                             replace Play button with: <audio controls src="/audio/mod3-future-of-ai.mp3" />
            '2-4'  QUIZ    → Module3Quiz.tsx — update questions and CORRECT_ANSWERS array inside that file

          MODULE 4 — Getting Hired
            '3-0'  INTERACTIVE → Module2Interactive.tsx — add certification visuals from public/images/
            '3-1'  READING → PortfolioLesson.tsx — add portfolio screenshots from public/images/ inside
            '3-2'  READING → IntroVideoLesson.tsx — add intro-video tips/screenshots from public/images/
            '3-3'  VIDEO   → set videoUrl in App.tsx → public/videos/mod4-finding-jobs.mp4
            '3-4'  QUIZ    → Module4Quiz.tsx — update questions and CORRECT_ANSWERS array inside that file

          MODULE 5 — Teaching Platforms
            '4-0'  VIDEO   → set videoUrl in App.tsx → public/videos/mod5-platforms-intro.mp4
            '4-1'  INTERACTIVE → TeachingPlatformsLesson.tsx — add platform screenshots from public/images/
            '4-2'  READING/PDF → uses generic pdf block below
                             replace content with: <iframe src="/pdfs/mod5-setting-up-your-profile.pdf" />

          MODULE 6 — Managing Me
            '5-0'  VIDEO   → set videoUrl in App.tsx → public/videos/mod6-managing-me.mp4
            '5-1'  READING → ManagingMeBodyLesson.tsx — add wellness images from public/images/ inside
            '5-2'  AUDIO   → ManagingMeMindLesson.tsx — see audio comment in that file
                             use: <audio controls src="/audio/mod6-managing-my-mind.mp3" />
            '5-3'  QUIZ    → Module6Quiz.tsx — FINAL LESSON; completing this triggers the congratulations screen
          ─────────────────────────────────────────────────────────────────────────────────
        */}
        {lesson.id === '0-1' ? (
          <NigerianTeacherLesson onComplete={() => onComplete(lesson.id)} />
        ) : lesson.id === '3-0' ? (
          <Module2Interactive onComplete={() => onComplete(lesson.id)} />
        ) : lesson.id === '1-1' ? (
          <EngagementScenarios
            onComplete={() => onComplete(lesson.id)}
            onCorrectAnswer={onCorrectAnswer}
            onWrongAnswer={onWrongAnswer}
          />
        ) : lesson.id === '3-1' ? (
          <PortfolioLesson onComplete={() => onComplete(lesson.id)} />
        ) : lesson.id === '1-2' ? (
          <ClassroomManagement onComplete={() => onComplete(lesson.id)} />
        ) : lesson.id === '1-6' ? (
          <LessonPlanningGuide onComplete={() => onComplete(lesson.id)} />
        ) : lesson.id === '1-7' ? (
          <Module2Quiz
            onComplete={() => onComplete(lesson.id)}
            onCorrectAnswer={onCorrectAnswer}
            onWrongAnswer={onWrongAnswer}
          />
        ) : lesson.id === '2-1' ? (
          <AIToolsLesson onComplete={() => onComplete(lesson.id)} />
        ) : lesson.id === '2-2' ? (
          <AIEthicsLesson onComplete={() => onComplete(lesson.id)} />
        ) : lesson.id === '2-4' ? (
          <Module3Quiz
            onComplete={() => onComplete(lesson.id)}
            onCorrectAnswer={onCorrectAnswer}
            onWrongAnswer={onWrongAnswer}
          />
        ) : lesson.id === '3-2' ? (
          <IntroVideoLesson onComplete={() => onComplete(lesson.id)} />
        ) : lesson.id === '3-4' ? (
          <Module4Quiz
            onComplete={() => onComplete(lesson.id)}
            onCorrectAnswer={onCorrectAnswer}
            onWrongAnswer={onWrongAnswer}
          />
        ) : lesson.id === '4-1' ? (
          <TeachingPlatformsLesson onComplete={() => onComplete(lesson.id)} />
        ) : lesson.id === '5-1' ? (
          <ManagingMeBodyLesson onComplete={() => onComplete(lesson.id)} />
        ) : lesson.id === '5-2' ? (
          <ManagingMeMindLesson onComplete={() => onComplete(lesson.id)} />
        ) : lesson.id === '5-3' ? (
          <Module6Quiz
            onComplete={() => onComplete(lesson.id)}
            onCorrectAnswer={onCorrectAnswer}
            onWrongAnswer={onWrongAnswer}
          />
        ) : (
          <div className="max-w-5xl mx-auto p-4 sm:p-8">
            {lesson.type === 'video' && (
            <div className="space-y-6">
              {lesson.videoUrl ? (
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video">
                  {lesson.videoUrl.includes('youtube.com') || lesson.videoUrl.includes('youtu.be') || lesson.videoUrl.includes('vimeo.com') ? (
                    <iframe
                      className="w-full h-full"
                      src={lesson.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/').replace('watch?v=', 'embed/')}
                      title={lesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      className="w-full h-full"
                      src={lesson.videoUrl}
                      controls
                      controlsList="nodownload"
                      playsInline
                    />
                  )}
                </div>
              ) : (
                // VIDEO PLACEHOLDER — no videoUrl set for this lesson yet.
                // To add the real video: set videoUrl on this lesson in App.tsx to the YouTube/Vimeo embed URL.
                // Example: videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID'
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-[#6667AB] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play size={32} className="text-white ml-1" />
                      </div>
                      <p className="text-white/80 text-sm">Video coming soon</p>
                      <p className="text-white/60 text-xs mt-1">{lesson.duration}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                <h3 className="font-semibold text-base sm:text-lg mb-3 text-gray-900">About this lesson</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                  This video lesson covers essential concepts and practical skills you'll need to
                  master. Take notes as you watch, and don't hesitate to pause and rewind as needed.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200">
                  {lesson.videoUrl && (
                    <a
                      href={lesson.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#6667AB] hover:bg-[#5557AB] text-white px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm font-medium transition-colors inline-block"
                    >
                      Watch on YouTube
                    </a>
                  )}
                  {!lesson.completed && (
                    <button
                      onClick={() => onComplete(lesson.id)}
                      className="border border-[#6667AB] text-[#6667AB] hover:bg-[#6667AB]/5 px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      Mark as Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {lesson.type === 'audio' && (
            <div className="space-y-4 sm:space-y-6">
              {lesson.videoUrl ? (
                /* YouTube-hosted audio — embed as a player */
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={lesson.videoUrl}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                /* Placeholder shown until an audio URL is provided */
                <div className="bg-gradient-to-br from-[#6667AB] to-[#8B87C8] rounded-xl p-6 sm:p-12 text-white shadow-xl">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                      <Headphones size={32} />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">{lesson.title}</h3>
                      <p className="text-white/80 mb-4 text-sm sm:text-base">Audio Lesson • {lesson.duration}</p>
                      <p className="text-white/60 text-sm">Audio coming soon</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                <h3 className="font-semibold text-base sm:text-lg mb-3 text-gray-900">Listening Guide</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Find a quiet space, put on your headphones, and immerse yourself in the content.
                  You can pause and rewind as needed.
                </p>
                {!lesson.completed && (
                  <div className="pt-4 border-t border-gray-100 mt-4">
                    <button
                      onClick={() => onComplete(lesson.id)}
                      className="border border-[#6667AB] text-[#6667AB] hover:bg-[#6667AB]/5 px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      Mark as Complete
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {lesson.type === 'interactive' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-[#F5D5E0] to-[#E5C5D0] rounded-xl p-5 sm:p-8 shadow-lg">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#6667AB] rounded-full flex items-center justify-center flex-shrink-0">
                    <Play size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Interactive Exercise</h3>
                    <p className="text-sm sm:text-base text-gray-700">Hands-on learning activity</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 sm:p-6 mb-4">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                    This interactive lesson includes exercises, quizzes, and practical activities
                    designed to reinforce your learning. Engage with the content actively for the
                    best results.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Activity 1</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Complete the self-assessment quiz</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Activity 2</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Practice with real-world scenarios</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="bg-[#6667AB] hover:bg-[#5557AB] text-white px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm font-medium transition-colors">
                    Start Exercise
                  </button>
                  {!lesson.completed && (
                    <button
                      onClick={() => onComplete(lesson.id)}
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      Mark as Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {lesson.type === 'pdf' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-[#6667AB] text-white p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={22} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-xl font-semibold">{lesson.title}</h3>
                      <p className="text-white/80 text-xs sm:text-sm">Reading Material • {lesson.duration}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-8">
                  <div className="prose max-w-none">
                    {/*
                      READING / PDF PLACEHOLDER — replace the content below with real material.
                      Option A (inline article): write HTML/JSX content directly here (text, headers, images)
                      Option B (embedded PDF): <iframe src="/pdfs/lesson-filename.pdf" className="w-full h-[600px]" />
                      Option C (Google Drive PDF): <iframe src="https://drive.google.com/file/d/FILE_ID/preview" className="w-full h-[600px]" />
                      Option D (dedicated component): create a new .tsx file in /src/app/components/ and route to it
                        by lesson ID in LessonViewer.tsx (see the media routing comment block above)
                    */}
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                      Reading material for this lesson is coming soon. Check back once the PDF or article has been uploaded.
                    </p>

                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 mt-6 mb-3">Key Topics Covered:</h4>
                    <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                      <li>• Fundamental principles and best practices</li>
                      <li>• Real-world examples and case studies</li>
                      <li>• Step-by-step implementation guides</li>
                      <li>• Common pitfalls and how to avoid them</li>
                    </ul>

                    <div className="flex flex-wrap gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                      {/* PDF DOWNLOAD: replace href="#" with the real PDF file path or external URL */}
                      <button className="bg-[#6667AB] hover:bg-[#5557AB] text-white px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm font-medium transition-colors">
                        Download PDF
                      </button>
                      {!lesson.completed && (
                        <button
                          onClick={() => onComplete(lesson.id)}
                          className="border border-[#6667AB] text-[#6667AB] hover:bg-[#6667AB]/5 px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          Mark as Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
}
