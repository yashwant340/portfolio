---
status: shipped
slug: mini-leetcode
order: 3
title: Mini LeetCode
category: Distributed systems
summary: "A distributed code judge: submissions are queued and run in sandboxed containers, and an AI suggests hints when code fails."
tagline: "A LeetCode-style judge built as seven services. Submit Python code, it runs in a locked-down sandbox against hidden tests, and the verdict streams back live. A local AI model explains failures, but never decides the verdict."
role: "I built the catalog & leaderboard, the React frontend and observability"
stack: [React, TypeScript, Spring Boot, Go, Python, RabbitMQ, PostgreSQL, Envoy, Docker, Prometheus, Grafana, Ollama]
highlights:
  - "Seven services over REST and RabbitMQ, each with its own database"
  - "Sandboxed runs: no network, read-only filesystem, CPU and memory limits"
  - "Recovers from worker and broker outages without losing a verdict"
links:
  code: https://github.com/Yeswanth03/distributed-judge-engine
liveSoon: false
note: "Runs locally with one docker compose up. The README covers the quick start."
# cover: /projects/mini-leetcode/cover.png
# preview: /projects/mini-leetcode/preview.mp4
clips:
  - title: Submit and watch the verdict stream in
  - title: An AI hint on a failed submission
  - title: A judge worker crashes and the system recovers
architecture:
  summary: "A React app talks to an Envoy gateway, which checks tokens and routes to the services. Submissions flow through RabbitMQ to stateless judge workers; verdicts fan back out to the services that need them."
  client:
    title: React web app
    detail: TypeScript, live verdicts over SSE
  clientLink: REST + SSE via Envoy
  server:
    title: Services
    detail: User, Submission, Judge workers, Catalog + Leaderboard, AI
  services:
    - title: RabbitMQ
      detail: Job queue and verdict fan-out
      link: AMQP
    - title: Spawner
      detail: Warm pool of sandbox containers
      link: Docker
    - title: PostgreSQL
      detail: One database per service
      link: SQL
    - title: Ollama
      detail: Local model for hints
      link: HTTP
decisions:
  - title: Separate services, not one app
    body: "Running untrusted code, judging, scoring and AI hints fail and scale differently. Keeping them apart means a slow AI model or a crashed worker never blocks new submissions."
  - title: Only the Spawner touches Docker
    body: "The Docker socket is root-equivalent, so one small service holds it and keeps a warm pool of locked-down sandboxes, instead of every worker starting containers."
  - title: The AI never decides the verdict
    body: "Verdicts come only from the sandboxed test run. Hints sit behind a circuit breaker, so if the model is down, verdicts are unaffected."
challenges:
  - title: No lost or duplicate verdicts
    body: "A transactional outbox, at-least-once delivery and idempotent consumers. With both judge workers killed for 5 s, the job was redelivered and came back ACCEPTED 7 s after submitting."
  - title: Staying up through a broker outage
    body: "With RabbitMQ stopped, submissions are still accepted into the outbox. During a 10 s outage, the verdict arrived 25 s after submitting."
  - title: A leaderboard that stays correct
    body: "It's rebuilt from verdicts rather than incremented, so rejudges and duplicate messages can't skew scores, and it reports how fresh it is."
limitations:
  - issue: Failed jobs retry immediately
    next: Retry with backoff, so a short outage doesn't send jobs to the dead-letter queue.
  - issue: Time limits are wall-clock
    next: Measure CPU time, with wall-clock as a backstop.
  - issue: The Spawner holds the Docker socket
    next: It's mitigated by locked-down sandboxes. Next, a rootless runtime such as gVisor.
  - issue: No load tests yet
    next: Find where the queue and sandbox pool saturate.
---

I wanted to see what it takes to run strangers' code safely and still get an answer back quickly. Mini LeetCode is a small LeetCode-style judge: pick a problem, submit Python, and watch the verdict arrive live.

Behind the editor, the submission is saved with a transactional outbox and published to RabbitMQ. A stateless judge worker picks it up, fetches the problem's hidden test set, and runs each case in a locked-down sandbox container from the Spawner's warm pool. The verdict fans back out to the submission service, the leaderboard and, if the code failed, the AI service, which asks a local model for a hint.

My part was the catalog and leaderboard service in Spring Boot, with versioned, immutable test sets and a leaderboard rebuilt from verdicts; the React frontend; and observability, with Prometheus scraping every service and Grafana dashboards for queues, outbox lag and leaderboard freshness. The whole system starts with one docker compose up.
