import FeedbackForm from "@/components/FeedbackForm";

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative bg-[#0a0a0a]">
      {/* Background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <FeedbackForm />
      </div>

      <footer className="mt-20 text-center text-foreground/20 text-xs">
        <p>© {new Date().getFullYear()} AI & Machine Learning Club, Oriental College of Technology, Bhopal.</p>
        <p className="mt-1">Built with Next.js, Appwrite & Vercel</p>
      </footer>
    </main>
  );
}
