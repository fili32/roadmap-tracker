import type { Week } from "../types";
import { calculateProgress } from "./calculateProgress";

const weeks: Week[] = [
  {
    id: 1,
    title: "Week one",
    topics: [
      { id: "a", title: "A" },
      { id: "b", title: "B" },
    ],
  },
  {
    id: 2,
    title: "Week two",
    topics: [{ id: "c", title: "C" }],
  },
];

describe("calculateProgress", () => {
  it("returns 0 done when nothing is checked", () => {
    expect(calculateProgress(weeks, {})).toEqual({ done: 0, total: 3 });
  });

  it("counts checked topics across all weeks", () => {
    expect(calculateProgress(weeks, { a: true, c: true })).toEqual({
      done: 2,
      total: 3,
    });
  });

  it("does not count topics marked false", () => {
    expect(calculateProgress(weeks, { a: true, b: false })).toEqual({
      done: 1,
      total: 3,
    });
  });

  it("ignores progress for topics that are not in the given weeks", () => {
    expect(
      calculateProgress([weeks[1]], { a: true, b: true, c: true }),
    ).toEqual({
      done: 1,
      total: 1,
    });
  });

  it("returns 0/0 for an empty list of weeks", () => {
    expect(calculateProgress([], { a: true })).toEqual({ done: 0, total: 0 });
  });

  it("returns done === total when every topic is checked", () => {
    expect(calculateProgress(weeks, { a: true, b: true, c: true })).toEqual({
      done: 3,
      total: 3,
    });
  });
});
