---
status: shipped
slug: mini-leetcode
order: 1
proof:
  - value: "300 / 300"
    label: submissions accepted with RabbitMQ stopped
  - value: "246 ms"
    label: from submit to verdict in the browser, p95 at peak
  - value: "100%"
    label: of requests served with the login service down
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
cover: /projects/mini-leetcode/cover.png
preview: /projects/mini-leetcode/preview.mp4
clips:
  - title: Submit and watch the verdict stream in
    src: /projects/mini-leetcode/clip-submit.mp4
  - title: An AI hint on a failed submission
    src: /projects/mini-leetcode/clip-hint.mp4
  - title: A judge worker crashes and the system recovers
    src: /projects/mini-leetcode/clip-recover.mp4
architecture:
  summary: "A React app talks to an Envoy gateway, which checks tokens once and routes to five services. Submissions flow through RabbitMQ to stateless judge workers, which run each test case in a sandbox from the Spawner. Verdicts fan back out to the services that need them."
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
# Story layout for the project page: one big number per chapter, text taken from the sections below
story:
  - type: overview
    heading: "Running strangers' code, **safely**"
    stat: { value: "< 40 ms", label: "to accept a burst of 40 submissions, every one then judged correctly" }
  - type: built
    heading: "My three **parts**"
    stat: { value: "3", label: parts of the system I built }
    mine: true
    items:
      - title: Catalog & leaderboard service
        body: Spring Boot, with versioned, immutable test sets and a leaderboard recomputed from verdicts.
      - title: React frontend
        body: TypeScript, with live verdicts over SSE.
      - title: Observability
        body: Prometheus scraping ten targets every 5 seconds, and nine Grafana dashboards covering queues, outbox lag, sandbox pool size, leaderboard freshness and AI token use.
  - type: architecture
    heading: "Five services, one **queue**"
    stat: { value: "5", label: services }
  - type: decision
    heading: "Recompute, don't **increment**"
    stat: { value: "100%", label: of scores correct with 30% of verdicts duplicated and shuffled }
    mine: true
    decisions: [1]
  - type: decisions
    heading: "What it **cost**"
    stat: { value: "300 / 300", label: submissions accepted with RabbitMQ stopped }
    decisions: [0, 2]
  - type: latency
    heading: "Where the time **goes**"
    stat: { value: 246 ms, label: "from submit to verdict in the browser, p95 at peak" }
    highlight: Leaderboard update
  - type: failures
    heading: "We broke it on **purpose**"
    stat: { value: 5 / 5, label: "failures injected, all survived" }
    highlight: Catalog crashed mid-stream
# Detailed architecture map for the story layout; `mine` marks the parts I built
diagram:
  requestLabel: REST + SSE
  client: { title: React app, detail: live verdicts, mine: true, info: "Editor and test runs, with the verdict streaming in over SSE." }
  gateway: { title: Envoy gateway, detail: checks tokens once, info: "Checks every token once at the edge and routes to the services." }
  services:
    - { title: User, detail: login, info: "Login, with passwords hashed using argon2id." }
    - { title: Submission, detail: outbox, queue: job, info: "Saves the submission and its judge job in one transaction, so nothing the API accepts is lost." }
    - { title: AI explainer, detail: never decides, info: "A local model (qwen2.5-coder:7b on Ollama) explains failures. It never decides the verdict." }
    - { title: Catalog, detail: leaderboard, mine: true, queue: verdict, info: "Versioned, immutable test sets, and a leaderboard recomputed from verdicts." }
  queue: { title: RabbitMQ, detail: jobs · verdicts, info: "Job queue and verdict fan-out." }
  worker: { title: Judge + Spawner, detail: "sandboxed runs, only one with Docker", info: "Stateless judge workers run each test case in a sandbox from the Spawner's warm pool. Only the Spawner holds Docker." }
  observability: { title: Prometheus + Grafana, detail: 9 dashboards watching every box above, mine: true, info: "Prometheus scrapes ten targets every 5 seconds, and nine Grafana dashboards cover queues, outbox lag, sandbox pool size, leaderboard freshness and AI token use." }
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
results:
  intro: From the team's load and failure tests, run against the full system.
  stats:
    - value: "0"
      label: submissions lost through a broker outage and a crash
    - value: "0"
      label: wrong scores with 30% of verdicts duplicated and shuffled
    - value: 246 ms
      label: from submit to verdict in the browser, p95 at peak
    - value: 100%
      label: of requests served with the login service down
  latency:
    rows:
      - label: Gateway auth check
        p50: 0.9
        p99: 1.7
      - label: Leaderboard update
        p50: 1.0
        p99: 2.8
      - label: Submit request
        p50: 18.9
        p99: 83.1
      - label: Login
        p50: 46.7
        p99: 75.4
    note: Login is slow on purpose. Passwords are hashed with argon2id, which is designed to be expensive to brute-force.
  failures:
    - failure: RabbitMQ stopped
      outcome: All 300 submissions still accepted
    - failure: Submission service killed mid-burst
      outcome: Every accepted submission judged
    - failure: Catalog crashed mid-stream
      outcome: Every score still correct
    - failure: Login service down
      outcome: 1,189 of 1,189 requests served
    - failure: AI model stopped
      outcome: Verdicts unaffected, hints resumed

---
I wanted to see what it takes to run strangers' code safely and still answer quickly. Mini LeetCode is a small LeetCode-style judge: pick a problem, try your code against the samples, submit, and watch the verdict arrive live.

Behind the editor, the submission and its judge job are saved in one transaction and published to RabbitMQ from an outbox. A stateless judge worker fetches the problem's hidden test set and runs each case in a locked-down sandbox from the Spawner's warm pool: no network, a read-only filesystem and CPU and memory limits. The verdict fans back out to the submission service, the leaderboard and, if the code failed, the AI service, which asks a local model for a hint. The whole system starts with one docker compose up at no running cost.

My part was the catalog and leaderboard service in Spring Boot, with versioned, immutable test sets and a leaderboard recomputed from verdicts. I also built the React frontend and the observability, with Prometheus scraping ten targets every 5 seconds and nine Grafana dashboards covering queues, outbox lag, sandbox pool size, leaderboard freshness and AI token use.
