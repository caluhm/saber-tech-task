import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type RegexValue = {
  id: string;
  regex: string;
};

const STORAGE_KEY = "regex-store";

function getStoredRegexes(): RegexValue[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function setStoredRegexes(regexes: RegexValue[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(regexes));
}

export function useRegexStore() {
  const queryClient = useQueryClient();

  const { data: regexes = [], isLoading } = useQuery<RegexValue[]>({
    queryKey: ["regexes"],
    queryFn: getStoredRegexes,
  });

  const createRegex = useMutation({
    mutationFn: (regexString: string) => {
      const newRegex: RegexValue = {
        id: crypto.randomUUID(),
        regex: regexString,
      };
      const updated = [...regexes, newRegex];
      setStoredRegexes(updated);
      return Promise.resolve(updated);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["regexes"], data);
    },
  });

  const updateRegex = useMutation({
    mutationFn: (updated: RegexValue) => {
      const newState = regexes.map((r) => (r.id === updated.id ? updated : r));
      setStoredRegexes(newState);
      return Promise.resolve(newState);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["regexes"], data);
    },
  });

  const deleteRegex = useMutation({
    mutationFn: (id: string) => {
      const current = getStoredRegexes();
      const newState = current.filter((r) => r.id !== id);
      setStoredRegexes(newState);
      return Promise.resolve(newState);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["regexes"], data);
    },
  });

  return {
    regexes,
    isLoading,
    createRegex: createRegex,
    updateRegex: updateRegex,
    deleteRegex: deleteRegex,
  };
}
