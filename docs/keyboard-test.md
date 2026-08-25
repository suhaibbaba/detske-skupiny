# Keyboard-only test script

Fifteen minutes, no mouse, no trackpad. Run it against a real dataset - most of
what this catches is content-shaped.

Move your pointing device out of reach. If you touch it, start the section
again.

**Setup.** `npm run dev:web`, open `http://localhost:3000`, click once in the
page to focus the document, then put the mouse down. In Safari, turn on
Preferences → Advanced → "Press Tab to highlight each item on a webpage" first;
without it Safari skips links entirely.

Throughout: **you must be able to see where you are at all times.** A 3px dark
purple ring, offset 2px. If focus ever vanishes, that is a bug - note the
element and carry on.

## 1. Home - the skip link and the header

| #   | Do                                                | Expect                                                                                                                                                                     |
| --- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | `Tab` once from the top of the page               | A "Skip to content" pill slides into the top-left corner and is focused. It is the **first** stop, before the logo.                                                        |
| 1.2 | `Enter`                                           | The page jumps past the header. Focus is on `<main>` (check in devtools: `document.activeElement.tagName` is `MAIN`), and no ring is drawn around the whole page.          |
| 1.3 | `Tab` again                                       | The next stop is the first link **inside** the content, not back up in the header.                                                                                         |
| 1.4 | Reload, then `Tab` past the skip link             | Logo, then each nav item, then the language switcher, then the CTA - left to right, matching what you see. Nothing focusable is skipped and nothing invisible takes focus. |
| 1.5 | `Tab` to the language switcher, `Enter` / `Space` | The listbox opens. `↑`/`↓` move between Čeština and English; `Esc` closes it and returns focus to the control.                                                             |
| 1.6 | `Tab` to the end of the page                      | Focus reaches the footer links and then leaves the document. It never gets stuck in a loop.                                                                                |

## 2. Home - the map

| #   | Do                                                | Expect                                                                                                              |
| --- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 2.1 | With a screen reader on, `Tab` into the map area  | It announces as a region with a name ("Map of childcare groups"), and the sentence about the list below is read.    |
| 2.2 | Region pills above the map: `Tab` to one, `Enter` | The map filters. If the combination has no places, a message appears over the map rather than an empty grey canvas. |

The map canvas itself is not keyboard operable, and that is the documented
decision - the list below it is the equivalent. See `docs/a11y.md`.

## 3. Catalog - filters and the list

Navigate to a catalog page (`/katalog/...`) using only the keyboard.

| #   | Do                                                                                                          | Expect                                                                                                                                              |
| --- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1 | `Tab` into the search box, type three letters                                                               | The list narrows after a beat. Focus stays in the input - it is not stolen by the re-render.                                                        |
| 3.2 | `Tab` into the filter sidebar, `Space` on a category                                                        | It toggles, the URL gains the filter, and `?page=` disappears from the URL if it was there.                                                         |
| 3.3 | Keep filtering until the list is empty                                                                      | A heading, a hint, and a focusable "Clear all" button appear in the grid. With a screen reader on, the empty state is announced without navigating. |
| 3.4 | `Tab` to "Clear all", `Enter`                                                                               | Filters clear and the list comes back.                                                                                                              |
| 3.5 | Scroll to the bottom with `End` / `Page Down` so more results load, then `Tab` to a school card and `Enter` | The school page opens.                                                                                                                              |
| 3.6 | `Alt`/`Cmd` + `←` (back)                                                                                    | You are back in the catalog, **at the same scroll position**, with the same results loaded - not at the top, not on page one.                       |

## 4. Mobile viewport - the drawer

Resize to 390px wide (devtools device toolbar), reload.

| #   | Do                                                    | Expect                                                                    |
| --- | ----------------------------------------------------- | ------------------------------------------------------------------------- |
| 4.1 | `Tab` to the hamburger, `Enter`                       | The drawer opens and focus moves into it.                                 |
| 4.2 | `Tab` repeatedly                                      | Focus cycles **within** the drawer and does not reach the page behind it. |
| 4.3 | `Esc`                                                 | The drawer closes and focus returns to the hamburger.                     |
| 4.4 | Open it again and `Enter` on a nav link               | It navigates and the drawer closes.                                       |
| 4.5 | `Tab` to the filter button on a catalog page, `Enter` | Same three checks as 4.1-4.3 for the filter dialog.                       |

## 5. Contact form

| #   | Do                                                  | Expect                                                                                                                                                      |
| --- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5.1 | `Tab` through name, email, message, consent, submit | Every field is reachable in visual order and each shows a ring. The message textarea shows one too - it is the field that used to suppress it.              |
| 5.2 | `Space` on the consent checkbox                     | It toggles. The privacy policy link inside the label is a separate stop and does not toggle the box.                                                        |
| 5.3 | Submit with the form incomplete                     | The button is disabled and cannot be focused past - fill the form instead.                                                                                  |
| 5.4 | Fill it properly and `Enter` on the button          | The label becomes "Sending…", a spinner appears **beside** the label (the button must not change width), and the button is disabled.                        |
| 5.5 | Wait for the response                               | Focus moves to the result message at the top of the form and a screen reader reads it. `Tab` from there continues into the form, ready for another message. |

## 6. Map popup

| #   | Do                                                                                                                            | Expect                                                                       |
| --- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 6.1 | On a school page or the catalog, click a map marker (pointer allowed for this one step - the canvas is not keyboard operable) | The popup opens **and focus lands on its close button**, which shows a ring. |
| 6.2 | `Tab`                                                                                                                         | Focus moves to the school link inside the popup.                             |
| 6.3 | `Esc`                                                                                                                         | The popup closes.                                                            |
| 6.4 | Open another and `Enter` on the close button                                                                                  | Same result.                                                                 |

## What to do with a failure

Note the page, the element and what you expected. If it is something axe can
see, add it to `e2e/a11y.spec.ts`; if it is focus order, focus movement or a
trap - none of which axe checks - it belongs in a Playwright spec beside the
skip-link test in the same file.
