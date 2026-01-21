import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function AboutSchool() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-primary text-white py-20 px-6 md:px-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
              Empowering Minds, Shaping Futures
            </h1>
            <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-2xl mx-auto">
              At EduTrack High, we believe in fostering a community of lifelong learners, critical thinkers, and compassionate leaders.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 space-y-16">
          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[#111418] dark:text-white">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                To provide a rigorous and supportive learning environment where every student is challenged to achieve their full potential. We are dedicated to nurturing the intellectual, social, and emotional growth of our students, preparing them to thrive in a dynamic global society.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-primary mb-4">Core Values</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">verified</span>
                  <span className="text-gray-700 dark:text-gray-200">Excellence in Education</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">verified</span>
                  <span className="text-gray-700 dark:text-gray-200">Integrity and Character</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">verified</span>
                  <span className="text-gray-700 dark:text-gray-200">Inclusivity and Respect</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">verified</span>
                  <span className="text-gray-700 dark:text-gray-200">Innovation and Creativity</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Stats / Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-4xl font-black text-primary mb-2">50+</div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Years of History</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-4xl font-black text-primary mb-2">1,200</div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Students Enrolled</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-4xl font-black text-primary mb-2">15:1</div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Student-Teacher Ratio</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-4xl font-black text-primary mb-2">100%</div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">College Acceptance</div>
            </div>
          </div>

          {/* Principal's Message */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Principal+Smith&background=137fec&color=fff&size=200" alt="Principal" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <blockquote className="text-xl font-medium text-[#111418] dark:text-white italic mb-4">
                "We are not just teaching subjects; we are igniting curiosity and building the foundation for a lifetime of success. Welcome to a place where every student matters."
              </blockquote>
              <div className="font-bold text-primary">Dr. Sarah Smith</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Principal, EduTrack High</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
