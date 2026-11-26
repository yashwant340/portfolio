---
status: shipped
slug: team-access-manager
order: 3
title: Team Access Manager
category: Security & workflows
summary: Role-based access control with team-inherited permissions, approval workflows and a full audit trail.
tagline: An access-governance app for managing people, teams and feature-level permissions, with self-service access requests, approvals, password recovery and audit history.
role: Solo · Full-stack
stack: [React, Material UI, Spring Boot, Spring Security, JWT, PostgreSQL]
highlights:
  - Three roles with scoped admin views
  - Inherit or override team permissions per user
  - OTP password reset with lockout and expiry
links:
  frontend: https://github.com/yashwant340/team-access-manager-UI
  backend: https://github.com/yashwant340/team-access-manager-service
cover: /projects/team-access-manager/cover.png
preview: /projects/team-access-manager/preview.mp4
clips:
  - title: Review and approve an access request
    src: /projects/team-access-manager/clip-approve.mp4
  - title: Inherit vs override permissions
    src: /projects/team-access-manager/clip-override.mp4
  - title: Audit trail
    src: /projects/team-access-manager/clip-audit.mp4
architecture:
  summary: A React client with role-based routes talks to a Spring Boot API that enforces authentication, applies permission rules, records audit events and sends email.
  client:
    title: React client
    detail: Material UI, Easy Peasy store, Axios
  clientLink: REST + bearer JWT
  server:
    title: Spring Boot API
    detail: JWT filter, admin/team/user services, audit trail, OTP service
  services:
    - title: PostgreSQL
      detail: Users, teams, features, permissions, audit
      link: JPA
    - title: SMTP email
      detail: Onboarding and password-reset mail
      link: Spring Mail
story:
  - type: feature
    label: Overview
    heading: Who can use **what**, and why
    stat: { value: "3", label: "roles, each with its own view" }
    paragraph: [0, 1]
    limits: [0, 3]
  - type: feature
    label: Permissions
    heading: Inherit or **override**
    challenge: 0
  - type: feature
    label: Audit trail
    heading: Nothing is **deleted**
    challenge: 1
    decisions: [1]
  - type: feature
    label: Sign-in
    heading: Recovery that resists **guessing**
    stat: { value: "5 min", label: "until a six-digit code expires" }
    challenge: 2
    limits: [1, 2]
  - type: architecture
    heading: Approve and audit **together**
    stat: { value: "1", label: "transaction for an approval and its audit entry" }
diagram:
  requestLabel: REST + bearer JWT
  trace: one approval
  client: { title: React client, detail: role-based routes, info: "Role-based routes built with Material UI. Every request carries a bearer JWT." }
  server: { title: Spring Boot API, detail: one service, info: "One service that enforces authentication, applies permission rules, records audit events and sends email." }
  modules:
    - { title: Auth, detail: JWT filter, info: "A JWT filter authenticates each request." }
    - { title: Permissions, detail: inherit or override, info: "Users inherit their team's permissions or get their own. Approving an inheriting user's request copies the team's permissions and changes only the requested feature." }
    - { title: Audit, detail: "who, what, when", info: "Approvals, mode switches, deactivations and permission changes are written to an audit trail that records who did what and when." }
    - { title: OTP, detail: password reset, info: "Six-digit codes that expire after five minutes and lock after five wrong attempts." }
  traceModule: 1
  traceStore: 0
  stores:
    - { title: PostgreSQL, detail: "users, teams, audit", link: JPA, info: "Users, teams, features, permissions and the audit trail. An approval and its audit entry are written in one transaction." }
    - { title: SMTP email, detail: "onboarding, reset mail", link: Spring Mail, info: "Sends the temporary password for new accounts and the password-reset codes." }
keyDecision: 0
decisions:
  - title: One service, not microservices
    body: Approving a request updates permissions and writes the audit entry in one database transaction. Split across services, keeping those consistent would need a saga or an outbox.
  - title: Deactivate users, never delete them
    body: Their audit history stays complete, and only active users count as team members.
challenges:
  - title: Inherit or override, without side effects
    body: Users either inherit their team's permissions or get their own. When an inheriting user's request is approved, the team's current permissions are copied to that user and only the requested feature changes, so one person's exception never changes the whole team.
  - title: Deactivating a team safely
    body: An inactive team must not keep granting access. Deactivating it switches its inheriting members to custom, deny-all access while keeping their history.
  - title: Password recovery that resists guessing
    body: Six-digit OTPs expire after five minutes, have a 60-second resend cooldown and lock after five wrong attempts. A correct code yields a single-use reset token valid for five minutes.
limitations:
  - issue: Role checks live in the service layer
    next: Add method-level role guards so every admin endpoint is protected declaratively.
  - issue: The JWT signing key is generated at startup
    next: Every restart signs everyone out. Use a stable managed key and add refresh and revocation.
  - issue: OTP sessions are held in memory
    next: Move them to Redis or the database so they survive restarts and work across instances.
  - issue: The UI mixes three component libraries
    next: Standardise on Material UI for a consistent look and a smaller bundle.
---

Most teams manage access with a spreadsheet and a chat thread. Team Access Manager makes it explicit: who can use which feature, why, who approved it, and when it changed.

There are three roles. A platform admin manages every team, user and request. A team admin manages their own team's members, permissions and requests. A regular user sees their effective access, asks for features to be granted or revoked, and can cancel a pending request.

Permissions are set per team, and each user either inherits them or switches to a custom set. Approvals, mode switches, deactivations and permission changes are all written to an audit trail that records who did what and when. New accounts go through an approval flow that creates the user and emails a temporary password, and a three-step OTP flow handles forgotten passwords.
