import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loremIpsum } from "lorem-ipsum";
import { RegexValue } from "./useRegexStore";

export type RegexMatch = {
  approved: boolean;
  regex: RegexValue;
  match: string;
};

export type Document = {
  content: string;
  matches: RegexMatch[];
};

const STORAGE_KEY = "document-store";

function saveToStorage(doc: Document) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
}

function loadFromStorage(): Document {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);

  const defaultDoc = {
    content: loremIpsum({ count: 15 }),
    matches: [],
  };

  saveToStorage(defaultDoc);

  return defaultDoc;
}

export function useDocumentStore() {
  const queryClient = useQueryClient();

  const { data: document = { content: "", matches: [] } } = useQuery<Document>({
    queryKey: ["document"],
    queryFn: () => Promise.resolve(loadFromStorage()),
  });

  const setMatches = useMutation({
    mutationFn: async (matches: RegexMatch[]) => {
      const updated = { ...document, matches };
      saveToStorage(updated);
      return updated;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["document"], data);
    },
  });

  return {
    content: document.content,
    matches: document.matches,
    setMatches: (matches: RegexMatch[]) => setMatches.mutate(matches),
  };
}
