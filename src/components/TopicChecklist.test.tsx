import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { resetProgressStore } from "../hooks/useProgress";
import type { Week } from "../types";
import TopicChecklist from "./TopicChecklist";
import WeekProgress from "./WeekProgress";

const STORAGE_KEY = "roadmap-progress";

const week: Week = {
  id: 1,
  title: "Fixture week",
  topics: [
    { id: "t1", title: "First topic" },
    { id: "t2", title: "Second topic" },
    { id: "t3", title: "Third topic" },
  ],
};
const total = week.topics.length;

// useProgress caches progress in a module-level store, so clearing
// localStorage alone isn't enough: reset both before every test.
beforeEach(() => {
  localStorage.clear();
  resetProgressStore();
});

// The week page renders these two together: the checklist changes progress,
// WeekProgress shows "x/y topics done" and the Done badge.
function renderWeek() {
  render(
    <>
      <WeekProgress week={week} />
      <TopicChecklist week={week} />
    </>,
  );
  return userEvent.setup();
}

describe("Marking a week as done", () => {
  it("shows the Done badge once every topic is checked", async () => {
    const user = renderWeek();

    expect(screen.getByText(`0/${total} topics done`)).toBeInTheDocument();
    expect(screen.queryByText("Done")).not.toBeInTheDocument();

    for (const topic of week.topics) {
      await user.click(screen.getByRole("checkbox", { name: topic.title }));
    }

    for (const checkbox of screen.getAllByRole("checkbox")) {
      expect(checkbox).toBeChecked();
    }
    expect(screen.getByText(`${total}/${total} topics done`)).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("does not show Done while topics are still open", async () => {
    const user = renderWeek();
    expect(screen.getByText(`0/${total} topics done`)).toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: "First topic" }));

    expect(screen.getByText(`1/${total} topics done`)).toBeInTheDocument();
    expect(screen.queryByText("Done")).not.toBeInTheDocument();
  });

  it("removes Done again when a topic is unchecked (keyboard)", async () => {
    const user = renderWeek();
    expect(screen.getByText(`0/${total} topics done`)).toBeInTheDocument();

    for (const topic of week.topics) {
      await user.click(screen.getByRole("checkbox", { name: topic.title }));
    }
    expect(screen.getByText("Done")).toBeInTheDocument();

    const first = screen.getByRole("checkbox", { name: "First topic" });
    first.focus();
    await user.keyboard(" ");

    expect(first).not.toBeChecked();
    expect(screen.getByText(`${total - 1}/${total} topics done`)).toBeInTheDocument();
    expect(screen.queryByText("Done")).not.toBeInTheDocument();
  });

  it("saves progress to localStorage", async () => {
    const user = renderWeek();
    expect(screen.getByText(`0/${total} topics done`)).toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: "First topic" }));

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}")).toEqual({
      t1: true,
    });
  });
});
