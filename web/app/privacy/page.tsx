import content from "@/markdowns/PRIVACY_POLICY.md";
import { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

// Remove HTML comments from markdown
const cleanedContent = content.replace(/<!--[\s\S]*?-->/g, "");

export const metadata: Metadata = {
  title: "QuizCrew - Privacy Policy",
  description:
    "Create, share, and take engaging quizzes with multiple formats. Perfect for students, educators, and lifelong learners.",
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-accent/15 shadow-sm px-[32px] py-[24px]">
        <div className="max-w-4xl mx-auto flex items-center gap-[12px]">
          <Link
            href="/"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-[32px] py-[64px]">
        <article className="prose prose-slate max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-4xl font-bold mb-[32px] text-foreground">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-3xl font-bold mt-[48px] mb-[24px] text-foreground">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-2xl font-bold mt-[32px] mb-[16px] text-foreground">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-muted-foreground mb-[16px] leading-relaxed">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-[24px] mb-[16px] text-muted-foreground space-y-[8px]">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-[24px] mb-[16px] text-muted-foreground space-y-[8px]">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">
                  {children}
                </strong>
              ),
              a: ({ children, href }) => (
                <a href={href} className="text-primary hover:underline">
                  {children}
                </a>
              ),
            }}
          >
            {cleanedContent}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
