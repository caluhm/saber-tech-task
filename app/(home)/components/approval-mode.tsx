import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RegexMatch, useDocumentStore } from "@/hooks/useDocumentStore";

import { RegexValue, useRegexStore } from "@/hooks/useRegexStore";
import { useState } from "react";

export function ApprovalMode() {
  const [selectedRegex, setSelectedRegex] = useState<RegexValue["id"] | null>(
    null
  );
  const { regexes } = useRegexStore();
  const { matches, setMatches } = useDocumentStore();

  const approveMatch = (match: RegexMatch) => {
    const updatedMatches = matches.map((m) =>
      m.regex.id === match.regex.id && m.match === match.match
        ? { ...m, approved: true }
        : m
    );
    setMatches(updatedMatches);
  };

  const selectedMatches = selectedRegex
    ? matches.filter((match) => match.regex.id === selectedRegex)
    : [];
  const unapprovedMatches = selectedMatches.filter((match) => !match.approved);
  const approvedMatches = selectedMatches.filter((match) => match.approved);

  return (
    <>
      <div>
        Regexes
        <Select
          onValueChange={(val) => setSelectedRegex(val as RegexValue["id"])}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a regex" />
          </SelectTrigger>
          <SelectContent>
            {regexes.map((regex) => (
              <SelectItem key={regex.id} value={regex.id}>
                {regex.regex}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedRegex ? (
        <div className="space-y-6">
          {/* Unapproved Matches */}
          <div>
            <h3 className="text-lg font-semibold text-orange-600 mb-3">
              Pending Approval ({unapprovedMatches.length})
            </h3>
            {unapprovedMatches.length > 0 ? (
              <div className="space-y-2">
                {unapprovedMatches.map((match, index) => (
                  <div
                    key={`${match.match}-${index}`}
                    className="flex items-center justify-between rounded border py-2 px-4 bg-orange-50"
                  >
                    <code>{match.match}</code>
                    <Button
                      size="sm"
                      onClick={() => approveMatch(match)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No pending matches</p>
            )}
          </div>

          {/* Approved Matches */}
          <div>
            <h3 className="text-lg font-semibold text-green-600 mb-3">
              Approved ({approvedMatches.length})
            </h3>
            {approvedMatches.length > 0 ? (
              <div className="space-y-2">
                {approvedMatches.map((match, index) => (
                  <div
                    key={`${match.match}-${index}`}
                    className="flex items-center justify-between rounded border py-2 px-4 bg-green-50"
                  >
                    <code>{match.match}</code>
                    <span className="text-sm text-green-600 font-medium">
                      ✓ Approved
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No approved matches</p>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-4">No regex selected</p>
      )}
    </>
  );
}
