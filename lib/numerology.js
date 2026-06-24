/**
 * Numerology Calculation Engine — Pythagorean System
 *
 * Plain JS port of numerologycalc/src/lib/numerology.ts
 * Computes Life Path, Expression, Soul Urge, Personality, and Birthday Numbers.
 * Supports Master Numbers (11, 22, 33) and configurable Y vowel/consonant treatment.
 */

const PYTHAGOREAN_MAP = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const VOWELS_SET = new Set(['A', 'E', 'I', 'O', 'U']);

const MASTER_NUMBERS = new Set([11, 22, 33]);

const SUFFIXES = ['JR.', 'JR', 'SR.', 'SR', 'IV', 'III', 'II'];
const PREFIXES = ['DR.', 'DR', 'MRS.', 'MRS', 'MR.', 'MR', 'MS.', 'MS'];

/**
 * Reduce a number to a single digit, preserving Master Numbers (11, 22, 33).
 */
function reduceToDigit(n) {
  while (n > 9 && !MASTER_NUMBERS.has(n)) {
    let sum = 0;
    while (n > 0) {
      sum += n % 10;
      n = Math.floor(n / 10);
    }
    n = sum;
  }
  return n;
}

/**
 * Normalize a name for numerology calculation.
 * Steps: uppercase, strip diacritics, remove suffixes/prefixes/hyphens/apostrophes,
 * keep only A-Z and spaces, collapse spaces.
 */
function normalizeName(input) {
  let name = input.toUpperCase();

  name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  for (const suffix of SUFFIXES) {
    const re = new RegExp(`[,\\s]+${suffix.replace('.', '\\.')}$`);
    name = name.replace(re, '');
  }
  for (const suffix of SUFFIXES) {
    name = name.replace(new RegExp(`\\s+${suffix.replace('.', '\\.')}\\s*$`), '');
  }

  for (const prefix of PREFIXES) {
    const re = new RegExp(`^${prefix.replace('.', '\\.')}[\\s,]+`);
    name = name.replace(re, '');
  }

  name = name.replace(/-/g, '');
  name = name.replace(/'/g, '');
  name = name.replace(/[^A-Z ]/g, '');
  name = name.replace(/\s+/g, ' ').trim();

  return name;
}

/**
 * Split normalized name into parts, discarding empty parts.
 */
function splitName(normalized) {
  return normalized.split(' ').filter((p) => p.length > 0);
}

/**
 * Check if a letter is a vowel, considering Y treatment.
 */
function isVowel(letter, yAsVowel) {
  if (letter === 'Y') return yAsVowel;
  return VOWELS_SET.has(letter);
}

/**
 * Sum letter values for a single name part, optionally filtering vowels/consonants.
 */
function sumLetters(part, filter, yAsVowel) {
  let sum = 0;
  for (const ch of part) {
    if (filter === 'vowels' && !isVowel(ch, yAsVowel)) continue;
    if (filter === 'consonants' && isVowel(ch, yAsVowel)) continue;
    sum += PYTHAGOREAN_MAP[ch] || 0;
  }
  return sum;
}

/**
 * Calculate a name-based number (Expression, Soul Urge, or Personality).
 */
function calcNameNumber(parts, filter, yAsVowel) {
  const reducedParts = [];

  for (const part of parts) {
    const sum = sumLetters(part, filter, yAsVowel);
    if (sum > 0) {
      reducedParts.push(reduceToDigit(sum));
    }
  }

  if (reducedParts.length === 0) return null;

  const total = reducedParts.reduce((a, b) => a + b, 0);
  return reduceToDigit(total);
}

/**
 * Calculate Life Path Number using the three-step reduction method.
 */
function calcLifePathNumber(month, day, year) {
  const reducedMonth = reduceToDigit(month);
  const reducedDay = reduceToDigit(day);

  const yearDigitSum = String(year)
    .split('')
    .reduce((sum, d) => sum + parseInt(d, 10), 0);
  const reducedYear = reduceToDigit(yearDigitSum);

  const total = reducedMonth + reducedDay + reducedYear;
  return reduceToDigit(total);
}

/**
 * Calculate Birthday Number (just the day, reduced with Master Number preservation).
 */
function calcBirthdayNumber(day) {
  return reduceToDigit(day);
}

/**
 * Perform all numerology calculations.
 */
function calculateNumerology(fullName, month, day, year, yAsVowel) {
  if (typeof yAsVowel !== 'boolean') yAsVowel = false;

  const normalizedName = normalizeName(fullName);
  const parts = splitName(normalizedName);

  return {
    lifePath: calcLifePathNumber(month, day, year),
    expression: calcNameNumber(parts, undefined, yAsVowel),
    soulUrge: calcNameNumber(parts, 'vowels', yAsVowel),
    personality: calcNameNumber(parts, 'consonants', yAsVowel),
    birthday: calcBirthdayNumber(day),
    normalizedName,
    nameParts: parts,
  };
}
