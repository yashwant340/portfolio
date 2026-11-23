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
  - "0 lost submissions through broker outages and crashes"
  - "Verdict back in the browser in under 250 ms at peak"
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
  - title: Separate services, not one app
    body: "Running untrusted code, judging, scoring and AI hints fail and scale differently. Keeping them apart means a slow AI model or a crashed worker never blocks new submissions."
  - title: Only the Spawner touches Docker
    body: "The Docker socket is root-equivalent, so one small service holds it. It keeps one sandbox warm and starts up to nine more on demand, so a burst never waits for a container build and idle ones are reclaimed after 5 minutes."
  - title: Tokens checked once, at the gateway
    body: "Envoy verifies short-lived signed tokens itself, so ordinary requests never call the User Service. With it stopped, 1,189 of 1,189 requests still succeeded; only sign-in failed."
challenges:
  - title: No lost submissions
    body: "Each submission and its judge job are saved in one transaction and published from an outbox. With RabbitMQ down, all 300 submissions were still accepted, and after a kill -9 mid-burst with 381 jobs still in the outbox, every accepted submission was judged."
  - title: A leaderboard that can't be fooled
    body: "My part: scores are recomputed from stored verdicts, not added up. 1,976 verdicts, 30% duplicated and shuffled, plus a crash, left 0 users with a wrong score, and a rejudge from accepted to wrong took a score from 100 back to 0."
  - title: AI hints that can't leak answers
    body: "Hidden tests never enter the prompt, and every reply is checked in code before it's shown. 18 prompt-injection attempts leaked nothing, and of 58 replies seeded with hidden inputs, 0 reached a user."
limitations:
  - issue: Throughput tops out near 3 verdicts/s
    next: The limit is the two judge workers, not the sandbox pool, which never passed 2 of 10 containers. Next, more worker replicas.
  - issue: Judging time grows with test cases
    next: Each case is its own sandbox call, about 250 ms each, so a 30-case problem takes about 10x longer. Next, batch a job's cases.
  - issue: A malformed verdict delays the leaderboard
    next: It's retried 5 times before dead-lettering, adding 3.6 s for the verdicts behind it. Next, dead-letter it immediately.
  - issue: The AI code check is a pattern match
    next: It caught 83% of solution lines; hints are capped at 30 words to limit a miss. Next, wider patterns.

---
I wanted to see what it takes to run strangers' code safely and still answer quickly. Mini LeetCode is a small LeetCode-style judge for a class of about 150 students: pick a problem, try your code against the samples, submit, and watch the verdict arrive live.

Behind the editor, the submission and its judge job are saved in one transaction and published to RabbitMQ from an outbox. A stateless judge worker fetches the problem's hidden test set and runs each case in a locked-down sandbox from the Spawner's warm pool: no network, a read-only filesystem and CPU and memory limits. The verdict fans back out to the submission service, the leaderboard and, if the code failed, the AI service, which asks a local model for a hint. At peak load the verdict reaches the browser in under 250 ms, and the whole system starts with one docker compose up at no running cost.

My part was the catalog and leaderboard service in Spring Boot, with versioned, immutable test sets and a leaderboard recomputed from verdicts; the React frontend; and observability, with Prometheus scraping ten targets every 5 seconds and nine Grafana dashboards covering queues, outbox lag, sandbox pool size, leaderboard freshness and AI token use.
