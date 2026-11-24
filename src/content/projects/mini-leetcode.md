---
status: shipped
slug: mini-leetcode
order: 3
title: Mini LeetCode
category: Distributed systems
summary: "A distributed code judge: submissions are queued and run in sandboxed containers, and an AI suggests hints when code fails."
tagline: "A LeetCode-style judge built as five services. Submit Python code, it runs in a locked-down sandbox against hidden tests, and the verdict streams back live. A local AI model explains failures, but never decides the verdict."
role: "I built the catalog & leaderboard, the React frontend and observability"
stack: [React, TypeScript, Spring Boot, Go, Python, RabbitMQ, PostgreSQL, Envoy, Docker, Prometheus, Grafana, Ollama]
highlights:
  - "Five services over REST and RabbitMQ, with a database per service"
  - "Untrusted code runs in locked-down sandbox containers"
  - "Live verdicts, with AI hints when code fails"
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
  summary: "A React app talks to an Envoy gateway, which checks tokens once and routes to five services. Submissions flow through RabbitMQ to stateless judge workers, which run each test case in a sandbox from the Spawner; verdicts fan back out to the services that need them."
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
      detail: A database per service
      link: SQL
    - title: Ollama
      detail: qwen2.5-coder:7b for hints
      link: HTTP
decisions:
  - title: Outbox, not publishing straight to the queue
    body: "A database write and a message publish can't share one transaction. Saving the job in the same transaction as the submission means nothing the API accepts is ever lost, even if the broker is down."
    tradeoff: "Status is eventually consistent, a relay process has to run, and a crash can occasionally make a job run twice."
  - title: Leaderboard recomputed from verdicts, not a running total
    body: "My part. Messages can arrive twice or out of order. Recomputing from stored verdicts keeps every score correct, and a rejudge can take points away as well as add them."
    tradeoff: "More work per verdict than a simple score += points, and the board trails the verdict slightly."
  - title: One service holds Docker, with a warm sandbox pool
    body: "Access to Docker is effectively root on the host, so only one small service gets it. Keeping a sandbox warm means submissions don't wait for a container to start."
    tradeoff: "An extra network hop for every test case, and an idle sandbox using memory."

---
I wanted to see what it takes to run strangers' code safely and still answer quickly. Mini LeetCode is a small LeetCode-style judge for a class of about 150 students: pick a problem, try your code against the samples, submit, and watch the verdict arrive live.

Behind the editor, the submission and its judge job are saved in one transaction and published to RabbitMQ from an outbox. A stateless judge worker fetches the problem's hidden test set and runs each case in a locked-down sandbox from the Spawner's warm pool: no network, a read-only filesystem and CPU and memory limits. The verdict fans back out to the submission service, the leaderboard and, if the code failed, the AI service, which asks a local model for a hint. The whole system starts with one docker compose up at no running cost.

My part was the catalog and leaderboard service in Spring Boot, with versioned, immutable test sets and a leaderboard recomputed from verdicts; the React frontend; and observability, with Prometheus scraping ten targets every 5 seconds and nine Grafana dashboards covering queues, outbox lag, sandbox pool size, leaderboard freshness and AI token use.
