import type { About } from './schema'

export const about: About = {
  paragraphs: [
    "I'm a full-stack software engineer based in Dublin. For three years at **Societe Generale** I built internal tools used across the bank, mostly in Java and Spring Boot with React on top.",
    'The work I enjoyed most was making slow things fast: taking a bank-wide API from **three minutes to under two seconds**, making exports **14x quicker**, and replacing a legacy ETL with a Spring Batch service. I was promoted to Specialist Software Engineer and led a cleanup that took test coverage from **40% to 85%**.',
    'In 2026 I moved to Dublin for an **MSc in Computer Science at UCD**. Alongside it I build full-stack projects like DevMetrics and Team Access Manager to explore auth, data sync and access control end to end.',
  ],
  facts: [
    { label: 'Based in', value: 'Dublin, Ireland' },
    { label: 'Experience', value: '3 years · Societe Generale' },
    { label: 'Studying', value: 'MSc Computer Science, UCD (to Sep 2027)' },
    { label: 'Looking for', value: 'Full-time roles from late 2027, plus a summer 2027 internship' },
    {
      label: 'Work authorisation',
      value: 'Stamp 2 now · Stamp 1G from late 2027 · Eligible for a Critical Skills permit',
    },
  ],
}
