"use client";

import SentenceLibrary from "@/components/sentence-library";

export default function SentencesPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <SentenceLibrary showHeader={true} />
    </div>
  );
}
