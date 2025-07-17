"use client";

import { Sidebar } from "./components/sidebar";
import { useDocumentStore } from "@/hooks/useDocumentStore";

export default function Home() {
  const { content } = useDocumentStore();

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex h-screen w-full p-4">
        <p>{content}</p>
      </main>
    </div>
  );
}
