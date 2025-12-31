import type { ParagraphDropdownData, ParagraphBlank } from "@/types/task";

export function parseParagraphToBlanks(
  text: string,
  existingBlanks: ParagraphBlank[] = []
): ParagraphDropdownData {
  let count = 0;
  const blanks: ParagraphBlank[] = [];

  const paragraph = text.replace(/__/g, () => {
    count++;
    const id = `blank_${count}`;

    // Try to find existing blank by position
    const existing = existingBlanks[count - 1];

    if (existing) {
      blanks.push(existing); // preserve options & correct
    } else {
      blanks.push({
        id,
        options: [''], // start with one empty option
        correct: '',   // no correct yet
      });
    }

    return `{{${id}}}`;
  });

  return { paragraph, blanks };
}
