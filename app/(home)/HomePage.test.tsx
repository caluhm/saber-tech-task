import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./page";

// I assume one of the shadcn/radix components is using this, but it's unsupported in jsdom
window.HTMLElement.prototype.scrollIntoView = () => {};

const createRegex = "/hello/i";
const updateRegex = "/world/i";

describe("HomePage Integration Tests", () => {
  beforeEach(() => {
    // Clear localStorage before each test, otherwise state persists between tests and can cause errors as it expects a clean slate
    localStorage.clear();
  });

  describe("Success Cases", () => {
    it("should create a new regex", async () => {
      render(<Home />, { wrapper: TestWrapper });

      await changeMode({ mode: "edit" });
      await createRegexFromEditMode({ regex: createRegex });
    });

    it("should update an existing regex", async () => {
      render(<Home />, { wrapper: TestWrapper });

      await changeMode({ mode: "edit" });
      await createRegexFromEditMode({ regex: createRegex });

      const editRegexButton = screen.getByTestId(`edit-regex-${createRegex}`);
      fireEvent.click(editRegexButton);

      const regexInput = screen.getByDisplayValue(createRegex);
      fireEvent.change(regexInput, { target: { value: updateRegex } });

      const updateButton = screen.getByRole("button", { name: "Update" });
      fireEvent.click(updateButton);

      await waitFor(() => {
        const regexItem = screen.getByText("/world/i");
        expect(regexItem).toBeInTheDocument();
      });
    });

    it("should delete a regex", async () => {
      render(<Home />, { wrapper: TestWrapper });

      await changeMode({ mode: "edit" });
      await createRegexFromEditMode({ regex: createRegex });

      const deleteRegexButton = screen.getByTestId(
        `delete-regex-${createRegex}`
      );
      fireEvent.click(deleteRegexButton);

      await waitFor(() => {
        const regexItem = screen.queryByText(createRegex);
        expect(regexItem).not.toBeInTheDocument();
      });
    });
  });

  describe("Validation Cases", () => {
    it("should show an error on the form input when creating a regex with an invalid pattern", async () => {
      render(<Home />, { wrapper: TestWrapper });

      await changeMode({ mode: "edit" });

      const createButton = screen.getByRole("button", {
        name: "Create Regex",
      });
      fireEvent.click(createButton);

      const regexInput = screen.getByPlaceholderText("/hello/i");
      const invalidRegex = "/invalid";
      fireEvent.change(regexInput, { target: { value: invalidRegex } });

      const saveButton = screen.getByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/invalid regular expression/i);
        expect(errorMessage).toBeInTheDocument();
      });

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should show an error on the form input when updating a regex with an invalid pattern", async () => {
      render(<Home />, { wrapper: TestWrapper });

      await changeMode({ mode: "edit" });
      await createRegexFromEditMode({ regex: createRegex });

      const editRegexButton = screen.getByTestId(`edit-regex-${createRegex}`);
      fireEvent.click(editRegexButton);

      const regexInput = screen.getByDisplayValue(createRegex);
      const invalidRegex = "invalid-pattern";
      fireEvent.change(regexInput, { target: { value: invalidRegex } });

      const updateButton = screen.getByRole("button", { name: "Update" });
      fireEvent.click(updateButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/invalid regular expression/i);
        expect(errorMessage).toBeInTheDocument();
      });

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      const originalRegex = screen.getByText(createRegex);
      expect(originalRegex).toBeInTheDocument();
    });
  });
});

function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const changeMode = async ({ mode }: { mode: "edit" | "approval" }) => {
  const modeSelect = screen.getByTestId("mode-switcher-trigger");
  fireEvent.click(modeSelect);

  const editModeOption = await screen.findByRole("option", {
    name: mode === "edit" ? "Edit" : "Approval",
  });
  fireEvent.click(editModeOption);
};

const createRegexFromEditMode = async ({ regex }: { regex: string }) => {
  const createButton = screen.getByRole("button", {
    name: "Create Regex",
  });
  fireEvent.click(createButton);

  const regexInput = screen.getByPlaceholderText("/hello/i");
  fireEvent.change(regexInput, { target: { value: regex } });

  const saveButton = screen.getByRole("button", { name: "Save" });
  fireEvent.click(saveButton);

  await waitFor(() => {
    const regexItem = screen.getByText(regex);
    expect(regexItem).toBeInTheDocument();
  });
};
