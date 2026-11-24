import { expect, test } from "@playwright/test";
import { roadmap } from "../src/data/roadmap";

const totalTopics = roadmap.flatMap((week) => week.topics).length;

// Each test runs in a fresh browser context, so localStorage starts empty.

test("overview shows all weeks and a progress bar at 0%", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Roadmap Tracker", level: 1 })).toBeVisible();

  const progressBar = page.getByRole("progressbar", { name: "Total progress" });
  await expect(progressBar).toHaveAttribute("aria-valuenow", "0");
  await expect(page.getByText(`0 / ${totalTopics} topics · 0%`)).toBeVisible();

  for (const week of roadmap) {
    const card = page.getByRole("link", { name: new RegExp(`^Week ${week.id}\\b`) });
    await expect(card).toBeVisible();
    await expect(card).toContainText(week.title);
    await expect(card).toContainText(`0/${week.topics.length} topics done`);
  }
  await expect(page.getByRole("link", { name: /^Week \d+\b/ })).toHaveCount(roadmap.length);
});

test("clicking a week card opens that week's page", async ({ page }) => {
  const week = roadmap[2];
  await page.goto("/");

  await page.getByRole("link", { name: new RegExp(`^Week ${week.id}\\b`) }).click();

  await expect(page).toHaveURL(`/week/${week.id}`);
  await expect(page.getByRole("heading", { name: week.title, level: 1 })).toBeVisible();
  await expect(page.getByRole("checkbox")).toHaveCount(week.topics.length);
  for (const topic of week.topics) {
    await expect(page.getByLabel(topic.title, { exact: true })).not.toBeChecked();
  }
  await expect(page.getByRole("link", { name: /Back to overview/ })).toBeVisible();
});

test("checking topics updates the week and total progress", async ({ page }) => {
  const week = roadmap[3];
  const [first, second] = week.topics;
  const weekTotal = week.topics.length;

  await page.goto(`/week/${week.id}`);
  await expect(page.getByText(`0/${weekTotal} topics done`)).toBeVisible();

  // One topic with the mouse...
  await page.getByLabel(first.title, { exact: true }).click();
  await expect(page.getByLabel(first.title, { exact: true })).toBeChecked();
  await expect(page.getByText(`1/${weekTotal} topics done`)).toBeVisible();

  // ...and one with the keyboard.
  const secondBox = page.getByLabel(second.title, { exact: true });
  await secondBox.focus();
  await page.keyboard.press("Space");
  await expect(secondBox).toBeChecked();
  await expect(page.getByText(`2/${weekTotal} topics done`)).toBeVisible();

  await page.getByRole("link", { name: /Back to overview/ }).click();
  await expect(page).toHaveURL("/");

  const card = page.getByRole("link", { name: new RegExp(`^Week ${week.id}\\b`) });
  await expect(card).toContainText(`2/${weekTotal} topics done`);

  const percent = Math.round((2 / totalTopics) * 100);
  await expect(page.getByRole("progressbar", { name: "Total progress" })).toHaveAttribute(
    "aria-valuenow",
    String(percent),
  );
  await expect(page.getByText(`2 / ${totalTopics} topics · ${percent}%`)).toBeVisible();
});

test("progress survives a page reload", async ({ page }) => {
  const week = roadmap[0];
  const topic = page.getByLabel(week.topics[0].title, { exact: true });

  await page.goto(`/week/${week.id}`);
  await topic.click();
  await expect(topic).toBeChecked();

  await page.reload();
  await expect(topic).toBeChecked();
  await expect(page.getByText(`1/${week.topics.length} topics done`)).toBeVisible();

  await page.goto("/");
  await page.reload();
  await expect(
    page.getByRole("link", { name: new RegExp(`^Week ${week.id}\\b`) }),
  ).toContainText(`1/${week.topics.length} topics done`);
  await expect(page.getByText(`1 / ${totalTopics} topics ·`)).toBeVisible();
});

test("an unknown week id shows the not-found page", async ({ page }) => {
  const response = await page.goto("/week/99");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  await expect(page.getByText("This page could not be found.")).toBeVisible();
  await expect(page.getByRole("checkbox")).toHaveCount(0);
});

test("checking every topic of a week marks only that week as Done", async ({ page }) => {
  const week = roadmap[4];

  await page.goto(`/week/${week.id}`);
  for (const topic of week.topics) {
    await page.getByLabel(topic.title, { exact: true }).click();
  }
  await expect(page.getByText(`${week.topics.length}/${week.topics.length} topics done`)).toBeVisible();

  await page.getByRole("link", { name: /Back to overview/ }).click();
  await expect(page).toHaveURL("/");

  for (const w of roadmap) {
    const card = page.getByRole("link", { name: new RegExp(`^Week ${w.id}\\b`) });
    // exact: true so the label "Done" can't match the lowercase "topics done".
    const doneLabel = card.getByText("Done", { exact: true });
    if (w.id === week.id) await expect(doneLabel).toBeVisible();
    else await expect(doneLabel).toHaveCount(0);
  }
});
