import type { Profile } from './schema'

export const profile: Profile = {
  name: 'Yaswanth Kumar',
  role: 'Full-stack engineer',
  headline: "Hi, I'm **Yaswanth.**",
  intro:
    'Three years building Java, Spring Boot and React systems at Societe Generale, now doing an MSc in Computer Science at University College Dublin.',
  status: { open: true, text: 'Open to full-time roles from late 2027 & summer 2027 internships · Dublin / Remote' },
  hero: {
    buildsLead: 'I build',
    builds: ['reliable APIs', 'distributed systems', 'full-stack apps'],
    workButton: 'See my work',
  },
  badge: {
    top: 'Full-stack engineer',
    bottomLeft: 'MSc CS · UCD',
    bottomRight: 'Dublin',
    facts: [
      { label: 'Experience', value: '3 yrs · Societe Generale' },
      { label: 'Studying', value: 'MSc CS · UCD' },
      { label: 'Built', value: '3 projects' },
      { label: 'Based in', value: 'Dublin / Remote' },
      { label: 'Available', value: 'Late 2027 · internship summer 2027' },
    ],
  },
  contact: {
    heading: 'Get in touch',
    text: "I'm looking for full-time software engineering roles in Dublin or remote from late 2027, and a summer 2027 internship. Drop me a message. My response time beats most APIs.",
    button: 'Say Hello',
  },
  projectCta: { heading: 'Like how I **build?**' },
  projectsSection: {
    heading: 'Projects',
    builtLabel: 'built',
    inProgressLabel: 'in progress',
  },
  liveDemoSoon: {
    label: 'Try the live app · soon',
    note: "Soon you'll be able to use the real app right here in your browser, with sample data and no sign-up. Until then, the clips below show it in action.",
  },
  links: {
    // Downloads keep this file name
    cv: '/Yaswanth_Kumar_CV.pdf',
    github: 'https://github.com/yashwant340',
    linkedin: 'https://www.linkedin.com/in/yaswanth-kumar-rs',
    email: 'rajiyash317@gmail.com',
  },
}
