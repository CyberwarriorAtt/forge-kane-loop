---
mode: testing
name: Forge Full Flow
---

# Forge — Full User Journey

## 1. Landing
Open http://localhost:3000.
Assert the heading "Forge" is visible.
Assert the empty state or habit list is present.

## 2. Add first habit
Click "Add a habit".
Fill the name field with "Read 20 pages".
Select an emoji if available.
Submit the form by clicking "Create habit".
Assert a card containing "Read 20 pages" appears.

## 3. Add second habit
Click "Add a habit" again.
Type "Drink water" and create it.
Assert both "Read 20 pages" and "Drink water" are visible.

## 4. Complete one habit
On the "Read 20 pages" card, click the complete / check button.
Assert the card now shows a completed state (green check or similar).

## 5. Stats update
Assert the "Done today" counter shows at least 1.

## 6. Theme
Toggle the theme switch.
Assert the document or body has a dark class or the background color changes.

## 7. Delete
Hover or find the delete control on "Drink water" and delete it.
Assert "Drink water" is no longer visible.
Assert "Read 20 pages" remains.
