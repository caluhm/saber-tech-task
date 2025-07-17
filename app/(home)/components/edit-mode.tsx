"use client";

import { Button } from "@/components/ui/button";

import { RegexFormDialog } from "./regex-form-dialog";
import { Edit2, Trash } from "lucide-react";
import { RegexValue, useRegexStore } from "@/hooks/useRegexStore";
import { useDocumentStore } from "@/hooks/useDocumentStore";
import { parseRegex } from "@/lib/utils";

export function EditMode() {
  const { content, setMatches, matches } = useDocumentStore();
  const { regexes, deleteRegex } = useRegexStore();

  const updateRegexMatches = (regexToUpdate: RegexValue[]) => {
    const latestMatches = regexToUpdate.map((regex) => {
      const parsedRegex = parseRegex(regex.regex);
      if (!parsedRegex) {
        console.log(`Invalid regex: ${regex.regex}`);
        return [];
      }

      const { pattern, flags } = parsedRegex;
      const re = new RegExp(pattern, flags);
      const matchResults = content.match(re);

      if (!matchResults) return [];

      // Dedupplicate any matches so we don't store duplicates
      const uniqueMatches = Array.from(new Set(matchResults));
      return uniqueMatches.map((match) => {
        // Check if this match was previously approved
        const existingMatch = matches.find(
          (m) => m.regex.id === regex.id && m.match === match
        );

        return {
          approved: existingMatch?.approved || false,
          regex,
          match,
        };
      });
    });

    const flattenedMatches = latestMatches.flat();
    setMatches(flattenedMatches);
  };

  const handleDeleteRegex = async (id: string) => {
    const newRegexes = await deleteRegex.mutateAsync(id);
    updateRegexMatches(newRegexes);
  };

  return (
    <>
      <RegexFormDialog onSubmittedAction={updateRegexMatches}>
        <Button className="w-full">Create Regex</Button>
      </RegexFormDialog>
      {regexes.map((regex) => (
        <div
          key={regex.id}
          className="flex items-center justify-between rounded border py-2 px-4"
        >
          <code>{regex.regex}</code>
          <div className="flex gap-2">
            <RegexFormDialog
              onSubmittedAction={updateRegexMatches}
              regexToEdit={regex}
            >
              <Button
                size="icon"
                variant="outline"
                data-testid={`edit-regex-${regex.regex}`}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </RegexFormDialog>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => handleDeleteRegex(regex.id)}
              data-testid={`delete-regex-${regex.regex}`}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </>
  );
}
