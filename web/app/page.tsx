import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      <header className="flex justify-between items-center px-[32px] py-[24px] bg-accent/15 shadow-sm">
        <div className="flex items-center gap-[12px]">
          <img
            src="/logo.png"
            alt="QuizCrew"
            width={40}
            height={40}
            className="rounded-full overflow-hidden"
          />
          <span className="text-xl font-bold text-foreground">QuizCrew</span>
        </div>
        <nav className="flex gap-[32px] items-center">
          <Link
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#about"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="#privacy"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex flex-col justify-center items-center px-[32px] py-[80px] text-center">
          <img
            src="/logo.png"
            alt="QuizCrew Logo"
            width={120}
            height={120}
            className="rounded-full overflow-hidden"
          />
          <h1 className="text-5xl font-bold mt-[32px] mb-[16px] text-foreground">
            Master Your Knowledge with QuizCrew
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-[48px]">
            Create, share, and take engaging quizzes with multiple formats.
            Perfect for students, educators, and lifelong learners.
          </p>
          <div className="flex gap-[16px] items-center">
            <a
              className="rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium px-[32px] py-[16px]"
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download on Android
            </a>
            {/* <a
              className="rounded-full border border-border hover:bg-muted transition-colors font-medium px-[32px] py-[16px]"
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download on iOS
            </a> */}
          </div>
        </section>

        <section id="features" className="px-[32px] py-[80px] bg-primary/10">
          <h2 className="text-4xl font-bold text-center mb-[64px] text-foreground">
            Features
          </h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-[48px]">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-[16px]">
                <span className="text-secondary-foreground text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-bold mb-[8px] text-foreground">
                Multiple Quiz Formats
              </h3>
              <p className="text-muted-foreground">
                Create MCQs, True/False questions, and drag-and-drop quizzes to
                suit any learning style.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-[16px]">
                <span className="text-accent-foreground text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold mb-[8px] text-foreground">
                Shareable Quizzes
              </h3>
              <p className="text-muted-foreground">
                Share your quiz creations with other users and groups.
                Collaborate and learn together.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-[16px]">
                <span className="text-primary-foreground text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-[8px] text-foreground">
                Track Progress
              </h3>
              <p className="text-muted-foreground">
                Monitor your learning journey with detailed analytics and
                performance insights.
              </p>
            </div>
          </div>
        </section>

        <section id="about" className="px-[32px] py-[80px] bg-background">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-[24px] text-foreground">
              About QuizCrew
            </h2>
            <p className="text-xl text-muted-foreground mb-[32px]">
              QuizCrew is your ultimate companion for interactive learning.
              Whether you&apos;re a student preparing for exams, an educator
              creating engaging content, or someone who loves to test their
              knowledge, QuizCrew makes learning fun and effective.
            </p>
            <p className="text-lg text-muted-foreground">
              Built with modern technology and designed for seamless user
              experience across all devices.
            </p>
          </div>
        </section>

        <section id="privacy" className="px-[32px] py-[80px] bg-primary/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-[24px] text-foreground">
              Your Privacy Matters
            </h2>
            <p className="text-xl text-muted-foreground mb-[32px]">
              We take your data protection seriously. QuizCrew complies with the
              Data Privacy Act of 2012 (Republic Act No. 10173) and implements
              industry-standard security measures to protect your personal
              information.
            </p>
            <Link
              href="/privacy"
              className="inline-block rounded-full border border-border hover:bg-card transition-colors font-medium px-[32px] py-[16px]"
            >
              Read Privacy Policy
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
