"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { RegexValue, useRegexStore } from "@/hooks/useRegexStore";
import { useState } from "react";
import { parseRegex } from "@/lib/utils";

const formSchema = z.object({
  regex: z.string().refine(
    (value) => {
      // First check if it follows the /pattern/flags format
      const parsed = parseRegex(value);
      if (!parsed) return false;

      // Then validate that the pattern is a valid regex
      try {
        new RegExp(parsed.pattern, parsed.flags);
        return true;
      } catch {
        return false;
      }
    },
    {
      message:
        "Invalid regular expression. Use format /pattern/flags (e.g., /hello/i)",
    }
  ),
});

export function RegexFormDialog({
  children,
  onSubmittedAction,
  regexToEdit,
}: {
  children: React.ReactNode;
  onSubmittedAction: (regexes: RegexValue[]) => void;
  regexToEdit?: RegexValue;
}) {
  const [open, setOpen] = useState(false);
  const { createRegex, updateRegex } = useRegexStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      regex: regexToEdit?.regex || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { regex } = values;

    let newRegexes: RegexValue[] = [];

    if (regexToEdit) {
      newRegexes = await updateRegex.mutateAsync({ id: regexToEdit.id, regex });
    } else {
      newRegexes = await createRegex.mutateAsync(regex);
    }

    setOpen(false);
    form.reset();
    onSubmittedAction(newRegexes);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {regexToEdit ? "Edit Regex" : "Create Regex"}
          </DialogTitle>
          <DialogDescription>
            {regexToEdit
              ? "Update the regex pattern."
              : "Input a new regex pattern to create."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="regex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regex</FormLabel>
                  <FormControl>
                    <Input placeholder="/hello/i" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end gap-2.5">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">{regexToEdit ? "Update" : "Save"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
