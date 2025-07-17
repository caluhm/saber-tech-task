"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";
import { EditMode } from "./edit-mode";
import { ApprovalMode } from "./approval-mode";

type Mode = "approval" | "edit";

export function Sidebar() {
  const [currentMode, setCurrentMode] = useState<Mode>("approval");

  return (
    <aside className="flex flex-col items-center gap-2.5 p-4 h-screen w-96 border-r text-left">
      <h2 className="font-semibold">Sabermine - Regex Dashboard</h2>
      <div className="w-full mb-6">
        Current Mode
        <Select
          defaultValue="approval"
          onValueChange={(val) => setCurrentMode(val as Mode)}
        >
          <SelectTrigger className="w-full" data-testid="mode-switcher-trigger">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="approval">Approval</SelectItem>
            <SelectItem value="edit">Edit</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-4 w-full">
        {currentMode === "approval" ? <ApprovalMode /> : <EditMode />}
      </div>
    </aside>
  );
}
