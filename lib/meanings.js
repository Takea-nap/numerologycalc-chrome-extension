/**
 * Number meanings data — short interpretations for each numerology number.
 * Plain JS port of the main site's meanings.ts
 *
 * Intentionally omits `expandedDescription` — full interpretations live on
 * numerologycalc.org and the popup links out via "Read more" buttons.
 */

const NUMBER_MEANINGS = [
  { number: 1, title: 'The Leader', keyword: 'Leader', shortDescription: 'Independent, ambitious, and pioneering.', isMaster: false },
  { number: 2, title: 'The Diplomat', keyword: 'Diplomat', shortDescription: 'Cooperative, sensitive, and harmonious.', isMaster: false },
  { number: 3, title: 'The Creator', keyword: 'Creator', shortDescription: 'Expressive, creative, and socially vibrant.', isMaster: false },
  { number: 4, title: 'The Builder', keyword: 'Builder', shortDescription: 'Practical, disciplined, and dependable.', isMaster: false },
  { number: 5, title: 'The Adventurer', keyword: 'Adventurer', shortDescription: 'Dynamic, freedom-loving, and versatile.', isMaster: false },
  { number: 6, title: 'The Nurturer', keyword: 'Nurturer', shortDescription: 'Caring, responsible, and family-oriented.', isMaster: false },
  { number: 7, title: 'The Seeker', keyword: 'Seeker', shortDescription: 'Analytical, introspective, and wisdom-seeking.', isMaster: false },
  { number: 8, title: 'The Achiever', keyword: 'Achiever', shortDescription: 'Ambitious, authoritative, and materially successful.', isMaster: false },
  { number: 9, title: 'The Humanitarian', keyword: 'Humanitarian', shortDescription: 'Compassionate, idealistic, and globally aware.', isMaster: false },
  { number: 11, title: 'The Intuitive', keyword: 'Intuitive', shortDescription: 'Visionary, spiritually aware, and inspiring.', isMaster: true },
  { number: 22, title: 'The Master Builder', keyword: 'Master Builder', shortDescription: 'Visionary architect with the power to build lasting legacies.', isMaster: true },
  { number: 33, title: 'The Master Teacher', keyword: 'Master Teacher', shortDescription: 'Selfless healer and spiritual guide to others.', isMaster: true },
];

function getMeaning(number) {
  return NUMBER_MEANINGS.find(function (m) { return m.number === number; });
}
