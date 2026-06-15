import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Flashcards } from "./Flashcards";
import { StoreProvider } from "../store";

// Flashcards faol kursning lug'atini ko'rsatadi — English'да vocab bor.
// active_course localStorage'дан o'qiladi (saveJSON формати = JSON.stringify).
beforeEach(() => {
  localStorage.setItem("active_course", JSON.stringify("english"));
});

function renderFlashcards() {
  return render(
    <StoreProvider>
      <Flashcards />
    </StoreProvider>
  );
}

describe("Flashcards — SRS oqimi", () => {
  it("birinchi karta va o'zlashtirilgan hisobi ko'rinadi", () => {
    renderFlashcards();
    // SRS bo'sh — barcha so'z navbatда, birinchisi 'hello'.
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(screen.getByText(/O'zlashtirilgan: 0 \//)).toBeInTheDocument();
  });

  it("kartani bosish ma'noни ko'rsatadi (ag'darish)", async () => {
    const user = userEvent.setup();
    const { container } = renderFlashcards();
    const card = container.querySelector<HTMLButtonElement>(".flashcard")!;
    await user.click(card);
    expect(screen.getByText("salom")).toBeInTheDocument(); // hello → salom
  });

  it("'Bilaman' baholanса keyingi kartaga o'tadi va SRS saqlanadi", async () => {
    const user = userEvent.setup();
    renderFlashcards();

    await user.click(screen.getByRole("button", { name: /Bilaman/ }));

    // Navbatdagi keyingi so'z ('please') ko'rinadi, 'hello' yo'qoladi.
    expect(screen.getByText("please")).toBeInTheDocument();
    expect(screen.queryByText("hello")).not.toBeInTheDocument();

    // SRS holati localStorage'га yozildi: 'hello' box 1 ('good').
    const srs = JSON.parse(localStorage.getItem("english_srs") || "{}");
    expect(srs.hello?.box).toBe(1);
  });

  it("navbatdagi so'zlar soni baholashдан keyin kamayadi", async () => {
    const user = userEvent.setup();
    const { container } = renderFlashcards();

    const queueCount = () => {
      const m = container.querySelector(".qscore")!.textContent!.match(/navbat\S*:\s*(\d+)/);
      return Number(m![1]);
    };
    const before = queueCount();
    await user.click(screen.getByRole("button", { name: /Oson/ }));
    expect(queueCount()).toBe(before - 1);
  });
});
