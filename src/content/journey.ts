import type { Journey } from './schema'

export const journey: Journey = {
  steps: [
    {
      period: '2019 — 2023',
      title: 'BE Computer Science and Engineering',
      org: 'Anna University',
      detail: 'Anna University (MIT Campus). CGPA 8.63/10.',
    },
    {
      period: 'Jul 2023 — Aug 2026',
      title: 'Software Engineer → Specialist Software Engineer',
      org: 'Societe Generale',
      detail: 'Societe Generale, Bangalore. Promoted in 2026; Star of the Quarter and two Spot Awards.',
    },
    {
      period: 'Sep 2026 — Now',
      title: 'MSc Computer Science',
      org: 'University College Dublin',
      detail: 'University College Dublin. Final term in summer 2027.',
      state: 'current',
    },
    {
      period: 'Next',
      title: 'Full-time engineering role · Dublin / Remote',
      detail: 'From late 2027, plus a summer 2027 internship as my final term.',
      state: 'next',
    },
  ],
}
