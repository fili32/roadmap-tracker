import { render, screen, within } from "@testing-library/react";
import { roadmap } from "../data/roadmap";
import Home from "./page";

describe("Overview page", () => {
  beforeEach(() => localStorage.clear());

  it("renders a card linking to every week", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1, name: "Roadmap Tracker" })).toBeInTheDocument();

    const cards = screen.getAllByRole("link", { name: /^Week \d+/ });
    expect(cards).toHaveLength(roadmap.length);

    roadmap.forEach((week, i) => {
      const card = cards[i];
      expect(card).toHaveAttribute("href", `/week/${week.id}`);
      expect(within(card).getByRole("heading", { level: 2, name: week.title })).toBeInTheDocument();
      expect(within(card).getByText(`0/${week.topics.length} topics done`)).toBeInTheDocument();
    });
  });

  it("shows the total progress bar at 0%", () => {
    render(<Home />);

    const total = roadmap.flatMap((w) => w.topics).length;
    expect(screen.getByRole("progressbar", { name: "Total progress" })).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
    expect(screen.getByText(`0 / ${total} topics · 0%`)).toBeInTheDocument();
  });

  it("has no checkboxes on the overview", () => {
    render(<Home />);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
