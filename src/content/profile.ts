import type { Profile } from './schema'

export const profile: Profile = {
  name: 'Yaswanth Kumar',
  role: 'Full-stack engineer',
  headline: 'Full-stack engineer building reliable web apps.',
  intro:
    'Three years building Java, Spring Boot and React systems at Societe Generale, now doing an MSc in Computer Science at University College Dublin.',
  status: { open: true, text: 'Open to full-time roles from late 2027 & summer 2027 internships · Dublin / Remote' },
  contact: {
    heading: 'Get in touch',
    text: "I'm looking for full-time software engineering roles in Dublin or remote from late 2027, and a summer 2027 internship. Drop me a message. My response time beats most APIs.",
    button: 'Say Hello',
  },
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
