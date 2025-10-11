"use client";

import { requestAcctDeletion } from "@/services/requestAcctDeletion";
import { FirebaseError } from "firebase/app";
import Link from "next/link";
import { useState } from "react";

export default function AccountDeletion() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userInfo = {
      userAgent: navigator.userAgent || null,
      platform: navigator.platform || null,
      language: navigator.language || null,
      screenResolution:
        `${window.screen.width}x${window.screen.height}` || null,
    };

    const result = await requestAcctDeletion(email, userInfo);
    console.log(result);
    if (result instanceof FirebaseError) {
      alert(`Failed [${result.code}: ${result.message}]`);
    } else if (result instanceof Error) {
      alert(`Failed [${result.message}]`);
    } else if (result === true) {
      alert(`${email} account deletion request sent.`);
      setSubmitted(true);
    }
    setIsSubmitting(false);
  };

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
        <h1 className="text-4xl font-bold mb-[32px] text-foreground">
          Account Deletion Request
        </h1>

        {!submitted ? (
          <div className="space-y-[32px]">
            <div className="bg-card border border-border rounded-lg px-[32px] py-[24px]">
              <p className="text-muted-foreground mb-[16px] leading-relaxed">
                To request account deletion, please submit your email address
                below. We will process your request and permanently delete all
                your data associated with your QuizCrew account.
              </p>
              <p className="text-muted-foreground mb-[24px] leading-relaxed">
                <strong className="text-foreground">Note:</strong> You can also
                delete your account directly from the user settings in the
                QuizCrew app.
              </p>

              <form onSubmit={handleSubmit} className="space-y-[24px]">
                <div className="space-y-[8px]">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-[16px] py-[12px] border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your.email@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium px-[32px] py-[16px] disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Deletion Request"}
                </button>
              </form>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg px-[32px] py-[24px]">
              <h2 className="text-xl font-bold mb-[16px] text-amber-900">
                Important Information
              </h2>
              <ul className="list-disc pl-[24px] space-y-[8px] text-amber-800">
                <li>Account deletion is permanent and cannot be undone</li>
                <li>
                  All your quizzes, progress, and personal data will be deleted
                </li>
                <li>This process may take up to 30 days to complete</li>
                <li>
                  You will receive a confirmation email once the deletion is
                  complete
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg px-[32px] py-[24px]">
            <h2 className="text-2xl font-bold mb-[16px] text-green-900">
              Request Submitted Successfully
            </h2>
            <p className="text-green-800 mb-[16px] leading-relaxed">
              Thank you for submitting your account deletion request. We will
              process your request and send a confirmation email to{" "}
              <strong>{email}</strong> once the deletion is complete.
            </p>
            <p className="text-green-800 leading-relaxed">
              This process may take up to 30 days. If you have any questions,
              please contact our support team.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
