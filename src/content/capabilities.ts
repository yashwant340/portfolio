import type { Capability } from './schema'

export const capabilities: Capability[] = [
  {
    title: 'Fast systems at scale',
    description:
      'Cut a bank-wide tool’s API from 3 minutes to under 2 seconds over 60k-row views, made exports 14x faster, and replaced a legacy ETL with a Spring Batch service.',
    tools: ['Spring Boot', 'Spring Batch', 'PostgreSQL', 'Materialised views', 'Server-side pagination'],
    usedIn: ['Societe Generale'],
  },
  {
    title: 'Code quality you can measure',
    description:
      'Led the cleanup of 3,000 SonarQube issues across five repositories and raised test coverage from 40% to 85% with reusable test templates.',
    tools: ['SonarQube', 'JUnit', 'Mockito', 'GitHub Actions'],
    usedIn: ['Societe Generale'],
  },
  {
    title: 'Secure sign-in flows',
    description: 'OAuth logins, short-lived tokens with silent refresh, OTP password recovery with lockouts.',
    tools: ['Spring Security', 'OAuth2', 'JWT', 'httpOnly cookies', 'BCrypt'],
    usedIn: ['devmetrics', 'team-access-manager'],
  },
  {
    title: 'Syncing external data',
    description: 'Pulling paginated data from third-party APIs, incrementally, without duplicates.',
    tools: ['Spring Boot', 'WebClient', 'GitHub REST API', 'Scheduled jobs'],
    usedIn: ['devmetrics'],
  },
  {
    title: 'Access control & auditing',
    description: 'Role-scoped permissions, approval workflows and a history of who changed what.',
    tools: ['Spring Boot', 'Spring Data JPA', 'PostgreSQL', 'Role-based access'],
    usedIn: ['team-access-manager'],
  },
  {
    title: 'Interfaces people can use',
    description: 'Dashboards with trends, comparisons, filters and clear loading states.',
    tools: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Material UI'],
    usedIn: ['devmetrics', 'team-access-manager'],
  },
]
