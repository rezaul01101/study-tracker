// 26 weeks of curriculum themes. Each week feeds the daily-lesson generator.
// phase:I will start on 3 July, so you can reschedule that. You can start on 3 July. That is it: you can start on 3 July, which is a Friday.        human label for sidebar grouping
// dsa:          { title, description }
// systemDesign: { title, description, sections[], apply }
//                 - sections[]: ~5 focused sub-topics, one surfaced per weekday (Mon–Fri)
//                 - apply:      a weekend prompt to apply the week's system-design topic
// project:      { name, weekdayTask (small / commit-sized), weekendTask (main build block) }

const WEEK_THEMES = [
  // ---------- PHASE 1: Foundations (Weeks 1-4) ----------
  {
    phase: "Phase 1 — Foundations",
    dsa: {
      title: "Complexity Analysis & Arrays",
      description: "Big-O/Big-Theta notation, time vs space tradeoffs, array traversal patterns, in-place manipulation.",
    },
    systemDesign: {
      title: "Scalability Vocabulary",
      description: "Latency vs throughput, vertical vs horizontal scaling, what 'availability' and 'reliability' actually mean.",
      sections: [
        "Latency vs throughput — definitions and how they trade off against each other.",
        "Vertical vs horizontal scaling — when each applies and where each hits a ceiling.",
        "Availability vs reliability — what each term actually promises.",
        "Back-of-envelope estimation — reasoning about QPS, storage, and bandwidth.",
        "SLA / SLO / SLI — how targets are defined and measured.",
      ],
      apply: "Do a capacity estimate for a simple service (QPS, storage, bandwidth) using this week's vocabulary.",
    },
    project: { name: "Project 1", weekdayTask: "Read 15-20 job descriptions for your target role; commit a requirements/keywords list to a fresh Project 1 repo.", weekendTask: "Decide Project 1's scope. Draw the architecture diagram before writing any code." },
  },
  {
    phase: "Phase 1 — Foundations",
    dsa: {
      title: "Strings & Hashing",
      description: "String manipulation, hashmap/hashset patterns, frequency counting, anagram/substring problems.",
    },
    systemDesign: {
      title: "Client-Server & HTTP Fundamentals",
      description: "Request/response lifecycle, REST principles, statelessness, idempotency, status codes that actually matter in interviews.",
      sections: [
        "The request/response lifecycle, end to end.",
        "REST principles and how to model resources.",
        "Statelessness — why servers avoid session state, and the tradeoffs.",
        "Idempotency — which HTTP methods are idempotent and why it matters.",
        "HTTP status codes that actually matter in interviews.",
      ],
      apply: "Design the HTTP API for a small resource (e.g. a to-do service): routes, methods, status codes, and idempotency.",
    },
    project: { name: "Project 1", weekdayTask: "Scaffold the Express repo: folder structure, linting, and git hooks (one commit).", weekendTask: "Set up a CI pipeline skeleton (GitHub Actions) and a basic Dockerfile for Project 1." },
  },
  {
    phase: "Phase 1 — Foundations",
    dsa: {
      title: "Two Pointers",
      description: "Fast/slow pointers, sorted-array pair problems, in-place partitioning, removing duplicates.",
    },
    systemDesign: {
      title: "SQL vs NoSQL Tradeoffs",
      description: "Data modeling for relational vs document/key-value stores, when to pick each, indexing basics.",
      sections: [
        "Relational modelling — normalisation and joins.",
        "Document / key-value modelling — denormalisation around access patterns.",
        "When to pick SQL vs NoSQL (consistency, query shape, scale).",
        "Indexing basics — how an index turns a scan into a lookup.",
        "Transactions and ACID vs BASE.",
      ],
      apply: "Pick a feature and model it twice — once relational, once document — and justify which you'd ship.",
    },
    project: { name: "Project 1", weekdayTask: "Draft your Prisma schema and note your multi-tenancy strategy (shared schema vs schema-per-tenant) — one commit.", weekendTask: "Implement the core Prisma models and the first migration for Project 1." },
  },
  {
    phase: "Phase 1 — Foundations",
    dsa: {
      title: "Sliding Window",
      description: "Fixed and variable-size windows, subarray/substring optimization problems.",
    },
    systemDesign: {
      title: "Database Indexing",
      description: "B-tree indexes, composite indexes, when an index hurts instead of helps, query plan basics.",
      sections: [
        "B-tree indexes — how they make lookups fast.",
        "Composite indexes and why column order matters.",
        "When an index hurts (write cost, storage, low selectivity).",
        "Reading a query plan (EXPLAIN).",
        "Covering indexes and index-only scans.",
      ],
      apply: "Take a slow query and design the index that fixes it; explain the query plan before and after.",
    },
    project: { name: "Project 1", weekdayTask: "Add a JWT-verify middleware and protect one route (one commit).", weekendTask: "Complete auth end-to-end (login/refresh + tenant-scoping middleware) and build the first core CRUD feature with tests." },
  },

  // ---------- PHASE 2: Core Build-Up (Weeks 5-8) ----------
  {
    phase: "Phase 2 — Core Build-Up",
    dsa: {
      title: "Linked Lists",
      description: "Reversal, cycle detection (Floyd's), merging, fast/slow pointer variants on lists.",
    },
    systemDesign: {
      title: "Caching Strategies",
      description: "Cache-aside, write-through, write-back, invalidation strategies, cache stampede.",
      sections: [
        "Cache-aside (lazy loading) — the default pattern.",
        "Write-through vs write-back.",
        "Invalidation strategies and TTLs.",
        "Cache stampede and how to prevent it.",
        "What's safe to cache and what never should be.",
      ],
      apply: "Design a caching layer for a read-heavy endpoint on paper: key design, TTL, and invalidation.",
    },
    project: { name: "Project 1", weekdayTask: "Add a Redis cache to one read-heavy endpoint (one commit).", weekendTask: "Add rate-limiting middleware, load-test the cached endpoint, and write down the tradeoffs you chose." },
  },
  {
    phase: "Phase 2 — Core Build-Up",
    dsa: {
      title: "Stacks & Queues",
      description: "Monotonic stacks, valid-parentheses family, queue-based BFS setup, implementing a queue with two stacks.",
    },
    systemDesign: {
      title: "Load Balancing",
      description: "Round robin, least connections, consistent hashing, health checks, L4 vs L7 balancing.",
      sections: [
        "Round robin vs least connections.",
        "Consistent hashing and why it matters for caches/shards.",
        "Health checks and connection draining.",
        "L4 vs L7 load balancing.",
        "Sticky sessions — when they're needed and why to avoid them.",
      ],
      apply: "Design load balancing for a stateless API tier: algorithm, health checks, and failure handling.",
    },
    project: { name: "Project 1", weekdayTask: "Wire up BullMQ and enqueue one job from an endpoint (one commit).", weekendTask: "Write the job worker, add retry/backoff logic, and test the failure cases." },
  },
  {
    phase: "Phase 2 — Core Build-Up",
    dsa: {
      title: "Recursion & Backtracking Basics",
      description: "Recursion tree thinking, base cases, subsets/permutations as a warm-up to full backtracking later.",
    },
    systemDesign: {
      title: "Database Replication & Sharding",
      description: "Leader-follower replication, read replicas, horizontal sharding strategies, hot-shard problems.",
      sections: [
        "Leader-follower replication.",
        "Read replicas and replication lag.",
        "Horizontal sharding strategies (range, hash, directory).",
        "Hot-shard problems and rebalancing.",
        "Failover and promoting a replica.",
      ],
      apply: "Design the sharding + replication scheme for a table that has outgrown a single node.",
    },
    project: { name: "Project 1", weekdayTask: "Write one integration test for the tenant-isolation logic (one commit).", weekendTask: "Write your first mock system design doc: 'Design the multi-tenancy layer you just built.'" },
  },
  {
    phase: "Phase 2 — Core Build-Up",
    dsa: {
      title: "Binary Search",
      description: "Classic binary search, search-on-answer pattern, binary search on rotated/2D arrays.",
    },
    systemDesign: {
      title: "Message Queues & Async Processing",
      description: "At-least-once vs exactly-once delivery, dead-letter queues, backpressure, queue vs pub-sub.",
      sections: [
        "Queue vs pub-sub — two different delivery models.",
        "At-least-once vs exactly-once delivery.",
        "Dead-letter queues and retry strategy.",
        "Backpressure and scaling consumers.",
        "Ordering guarantees and when you lose them.",
      ],
      apply: "Design an async workflow (e.g. send-email-on-signup) end to end, with retries and a dead-letter queue.",
    },
    project: { name: "Project 1", weekdayTask: "Add structured logging and a basic health-check endpoint (one commit).", weekendTask: "Deploy Project 1 to a real cloud provider (containerized). Confirm it's reachable end-to-end." },
  },

  // ---------- PHASE 3: Depth (Weeks 9-14) ----------
  {
    phase: "Phase 3 — Depth",
    dsa: {
      title: "Trees I — Traversals & BST",
      description: "Pre/in/post-order, level-order (BFS), BST insert/search/delete, validating a BST.",
    },
    systemDesign: {
      title: "CDNs & Content Delivery",
      description: "Edge caching, cache headers, static vs dynamic content delivery, invalidation at the edge.",
      sections: [
        "Edge caching — how a CDN serves content close to users.",
        "Cache headers (Cache-Control, ETag).",
        "Static vs dynamic content delivery.",
        "Cache invalidation at the edge.",
        "Origin shielding and cache hit ratio.",
      ],
      apply: "Design content delivery for an app with static assets plus some dynamic content; choose the cache headers.",
    },
    project: { name: "Project 1", weekdayTask: "Add request-count/latency metrics to one endpoint (one commit).", weekendTask: "Wire metrics to a dashboard (or hosted APM free tier), polish the README with an architecture diagram, and record a 5-minute demo." },
  },
  {
    phase: "Phase 3 — Depth",
    dsa: {
      title: "Trees II — Depth/Balance Problems",
      description: "Max depth, diameter, balanced-tree checks, lowest common ancestor, path-sum family.",
    },
    systemDesign: {
      title: "Microservices vs Monolith",
      description: "When each makes sense, service boundaries, shared-database anti-pattern, the cost of network hops.",
      sections: [
        "When a monolith is genuinely the right call.",
        "Service boundaries — splitting by business capability.",
        "The shared-database anti-pattern.",
        "The cost of network hops and partial failure.",
        "Keeping data consistent across services.",
      ],
      apply: "For Project 2, justify your service split (main API vs AI service) in writing, with the tradeoffs.",
    },
    project: { name: "Project 2", weekdayTask: "Write Project 2's scope and a first architecture sketch (one commit).", weekendTask: "Scaffold the Project 2 repo; decide the service split (main API vs AI service) and justify it in writing." },
  },
  {
    phase: "Phase 3 — Depth",
    dsa: {
      title: "Graphs I — BFS/DFS",
      description: "Adjacency list/matrix, connected components, shortest path on unweighted graphs, grid-as-graph problems.",
    },
    systemDesign: {
      title: "API Design & Rate Limiting",
      description: "Pagination, versioning, idempotency keys, token bucket vs sliding window rate limiting.",
      sections: [
        "Pagination strategies (offset vs cursor).",
        "API versioning approaches.",
        "Idempotency keys for safe retries.",
        "Token bucket vs sliding window rate limiting.",
        "Consistent error contracts and responses.",
      ],
      apply: "Design a public API endpoint: pagination, versioning, idempotency, and a rate-limit policy.",
    },
    project: { name: "Project 2", weekdayTask: "Stand up the vector store (pgvector) with a table and connection (one commit).", weekendTask: "Build the embedding pipeline and the RAG retrieval flow end-to-end on sample data." },
  },
  {
    phase: "Phase 3 — Depth",
    dsa: {
      title: "Graphs II — Advanced Traversal",
      description: "Topological sort, cycle detection in directed graphs, multi-source BFS.",
    },
    systemDesign: {
      title: "Consistency Models & CAP Theorem",
      description: "Strong vs eventual consistency, CAP in practice, consistency/availability tradeoffs teams actually make.",
      sections: [
        "Strong vs eventual consistency.",
        "CAP theorem — the real-world tradeoff.",
        "PACELC — latency vs consistency when there's no partition.",
        "Read-your-writes and monotonic reads.",
        "Quorums (R + W > N).",
      ],
      apply: "Pick a feature and decide its consistency model; justify the CAP tradeoff you're making.",
    },
    project: { name: "Project 2", weekdayTask: "Add a single SSE endpoint that streams a hard-coded response (one commit).", weekendTask: "Wire streaming end-to-end from the frontend request to a token-by-token AI response." },
  },
  {
    phase: "Phase 3 — Depth",
    dsa: {
      title: "Heaps & Priority Queues",
      description: "Min/max heap operations, k-th largest/smallest family, merge-k-sorted-lists pattern.",
    },
    systemDesign: {
      title: "Distributed Transactions",
      description: "Two-phase commit, sagas, compensating transactions, why distributed transactions are avoided when possible.",
      sections: [
        "Why distributed transactions are avoided when possible.",
        "Two-phase commit and its failure modes.",
        "The saga pattern.",
        "Compensating transactions.",
        "Idempotency and achieving exactly-once effects.",
      ],
      apply: "Design a multi-step operation (e.g. checkout) as a saga with compensating actions.",
    },
    project: { name: "Project 2", weekdayTask: "Log tokens-used and latency for one AI call (one commit).", weekendTask: "Write a mock design doc: 'Design a RAG system at scale' — cover cost, latency, and failure modes." },
  },
  {
    phase: "Phase 3 — Depth",
    dsa: {
      title: "Greedy Algorithms",
      description: "Interval scheduling, greedy-choice proofs at a practical level, when greedy fails and DP is needed instead.",
    },
    systemDesign: {
      title: "Event-Driven Architecture",
      description: "Event sourcing basics, choreography vs orchestration, eventual consistency in event-driven systems.",
      sections: [
        "Events vs commands.",
        "Event sourcing basics.",
        "Choreography vs orchestration.",
        "Eventual consistency in event-driven systems.",
        "Handling duplicate and out-of-order events.",
      ],
      apply: "Redesign one workflow as event-driven; draw the events and their consumers.",
    },
    project: { name: "Project 2", weekdayTask: "Add a timeout + fallback for one AI call (one commit).", weekendTask: "Deploy Project 2. Confirm streaming works end-to-end in production." },
  },

  // ---------- PHASE 4: Project Completion + Simulation (Weeks 15-20) ----------
  {
    phase: "Phase 4 — Completion & Simulation",
    dsa: {
      title: "Backtracking",
      description: "Subsets, permutations, combinations, N-Queens family, pruning for performance.",
    },
    systemDesign: {
      title: "Observability",
      description: "Structured logging, metrics vs traces, the four golden signals, alerting without noise.",
      sections: [
        "Logs vs metrics vs traces — what each is for.",
        "Structured logging done well.",
        "The four golden signals.",
        "Distributed tracing and correlation IDs.",
        "Alerting without noise (symptom-based alerts).",
      ],
      apply: "Define the observability for one service: what you log, which metrics you track, and one meaningful alert.",
    },
    project: { name: "Project 2", weekdayTask: "Add one AI-service metric (latency or error rate) to your dashboard (one commit).", weekendTask: "Write architecture blog post #1 (Project 1) for your portfolio/LinkedIn." },
  },
  {
    phase: "Phase 4 — Completion & Simulation",
    dsa: {
      title: "Dynamic Programming I",
      description: "1D DP (climbing stairs, house robber family), memoization vs tabulation, identifying the DP signal.",
    },
    systemDesign: {
      title: "Mock Design: URL Shortener",
      description: "Full end-to-end mock: requirements, capacity estimate, high-level design, ID generation strategy, deep dive on one component.",
      sections: [
        "Requirements and scope (functional + non-functional).",
        "Capacity estimation.",
        "High-level design and the API.",
        "ID / short-code generation strategies.",
        "Deep dive: the read path, caching, and redirects.",
      ],
      apply: "Run the full URL-shortener mock end to end in 45 minutes and record yourself.",
    },
    project: { name: "Project 2", weekdayTask: "Polish one section of Project 2's README (one commit).", weekendTask: "Record Project 2's demo walkthrough and write architecture blog post #2 for your portfolio/LinkedIn." },
  },
  {
    phase: "Phase 4 — Completion & Simulation",
    dsa: {
      title: "Dynamic Programming II",
      description: "2D DP (grid paths, edit distance), knapsack family, subsequence problems.",
    },
    systemDesign: {
      title: "Mock Design: Rate Limiter",
      description: "Full end-to-end mock: token bucket vs sliding window, distributed rate limiting across nodes, deep dive.",
      sections: [
        "Requirements and where the limiter sits in the stack.",
        "Token bucket vs sliding window.",
        "Distributed rate limiting across nodes.",
        "Storage choice (Redis) and atomicity.",
        "Deep dive: handling bursts and clock skew.",
      ],
      apply: "Run the full distributed rate-limiter mock end to end and record yourself.",
    },
    project: { name: "CV & Portfolio", weekdayTask: "Draft your CV against the job descriptions collected in Week 1.", weekendTask: "Update LinkedIn, GitHub pinned repos, and your portfolio site with both projects live." },
  },
  {
    phase: "Phase 4 — Completion & Simulation",
    dsa: {
      title: "Union-Find & Advanced Graphs",
      description: "Disjoint Set Union, Kruskal's MST intuition, Dijkstra's shortest path, when to reach for each.",
    },
    systemDesign: {
      title: "Mock Design: Chat System",
      description: "Full end-to-end mock: real-time delivery, message ordering, presence, offline sync, deep dive.",
      sections: [
        "Requirements: real-time delivery and presence.",
        "Connection model (WebSocket) and message fan-out.",
        "Message ordering and delivery guarantees.",
        "Offline sync and message history.",
        "Deep dive: scaling connections and presence.",
      ],
      apply: "Run the full chat-system mock end to end and record yourself.",
    },
    project: { name: "Interview Prep", weekdayTask: "Draft 3 STAR stories from your day job (conflict, failure, ownership).", weekendTask: "Full mock system design interview with a peer/AI interviewer — record and debrief." },
  },
  {
    phase: "Phase 4 — Completion & Simulation",
    dsa: {
      title: "Timed Practice — Mixed Mediums",
      description: "45-minute timed problems spanning all patterns learned so far. Focus on speed and clean communication while coding.",
    },
    systemDesign: {
      title: "Mock Design: News Feed",
      description: "Full end-to-end mock: fan-out on write vs read, ranking, pagination at scale, deep dive.",
      sections: [
        "Requirements and the read/write ratio.",
        "Fan-out on write vs fan-out on read.",
        "Ranking and the feed-generation pipeline.",
        "Pagination at scale.",
        "Deep dive: the celebrity / hot-user problem.",
      ],
      apply: "Run the full news-feed mock end to end and record yourself.",
    },
    project: { name: "Interview Prep", weekdayTask: "Draft 3 more STAR stories (ambiguity, leadership, disagreement).", weekendTask: "Full mock coding interview (45 min, talk through your reasoning out loud) — record and debrief." },
  },
  {
    phase: "Phase 4 — Completion & Simulation",
    dsa: {
      title: "Timed Practice — Weak Areas",
      description: "Revisit your personal error log from the last 4 months. Redo every problem you previously got wrong.",
    },
    systemDesign: {
      title: "Mock Design: E-Commerce Checkout",
      description: "Full end-to-end mock: inventory consistency, payment idempotency, order state machine, deep dive.",
      sections: [
        "Requirements and the order state machine.",
        "Inventory consistency and reservations.",
        "Payment idempotency.",
        "Handling failures and partial success.",
        "Deep dive: consistency vs availability at checkout.",
      ],
      apply: "Run the full checkout mock end to end and record yourself.",
    },
    project: { name: "Applications", weekdayTask: "Identify and shortlist 20 target companies/roles for the application sprint.", weekendTask: "Tailor your CV/cover letter template for your top 5 target roles." },
  },

  // ---------- PHASE 5: Application Sprint (Weeks 21-26) ----------
  {
    phase: "Phase 5 — Application Sprint",
    dsa: {
      title: "Maintenance Practice",
      description: "3-4 timed problems this week, pattern-mixed, no new topics. Priority is applying and interviewing now.",
    },
    systemDesign: {
      title: "Mock Design: Notification System",
      description: "Full end-to-end mock: fan-out delivery, priority tiers, retries, third-party provider failure handling.",
      sections: [
        "Requirements and channels (push / email / SMS).",
        "Fan-out delivery and templating.",
        "Priority tiers and rate control.",
        "Retries and third-party provider failures.",
        "Deep dive: deduplication and user preferences.",
      ],
      apply: "Run the full notification-system mock end to end and record yourself.",
    },
    project: { name: "Applications", weekdayTask: "Send 5-10 tailored applications. Reach out to any referral contacts.", weekendTask: "Full mock system design + coding interview back-to-back — simulate a real onsite loop." },
  },
  {
    phase: "Phase 5 — Application Sprint",
    dsa: { title: "Maintenance Practice", description: "Continue timed mixed practice. Track accuracy, not just completion." },
    systemDesign: {
      title: "Mock Interview Round",
      description: "Full mock system design interview, focus on communication and tradeoff articulation, not just the final diagram.",
      sections: [
        "Requirement gathering — asking the right clarifying questions.",
        "Driving the high-level design first.",
        "Narrating tradeoffs out loud.",
        "Managing time across the 45 minutes.",
        "Handling the interviewer's curveballs.",
      ],
      apply: "Do a full mock with a peer/AI interviewer; debrief on communication, not just the diagram.",
    },
    project: { name: "Applications", weekdayTask: "Continue the application sprint (5-10/week). Follow up on the prior week's applications.", weekendTask: "Mock behavioral interview — run through your STAR stories out loud with a partner." },
  },
  {
    phase: "Phase 5 — Application Sprint",
    dsa: { title: "Maintenance Practice", description: "Continue timed mixed practice, prioritizing patterns you're weakest on." },
    systemDesign: {
      title: "Mock Interview Round",
      description: "Full mock system design interview on a topic you haven't seen yet — practice thinking on your feet.",
      sections: [
        "Structuring an unfamiliar problem from scratch.",
        "Falling back on first principles.",
        "Reusing known building blocks (cache, queue, load balancer).",
        "Estimating under uncertainty.",
        "Recovering gracefully when you get stuck.",
      ],
      apply: "Do a mock on an unseen topic; practise thinking on your feet, then debrief.",
    },
    project: { name: "Applications", weekdayTask: "Continue the application sprint. Prep company-specific notes for any scheduled interviews.", weekendTask: "Full mock onsite loop simulation (coding + system design + behavioral back-to-back)." },
  },
  {
    phase: "Phase 5 — Application Sprint",
    dsa: { title: "Weak-Area Deep Dive", description: "Pick your two lowest-confidence patterns from your tracker and drill them exclusively this week." },
    systemDesign: {
      title: "Weak-Area Deep Dive",
      description: "Re-read the system design topic you've felt least confident narrating, then redo that mock from scratch.",
      sections: [
        "Identify your least-confident system-design topic.",
        "Re-read the fundamentals for it.",
        "Re-draw the canonical design from memory.",
        "List the tradeoffs you previously fumbled.",
        "Redo the mock from a blank page.",
      ],
      apply: "Re-run the mock you felt least confident narrating, from scratch.",
    },
    project: { name: "Interview Loops", weekdayTask: "Prep for any live interview loops this week: review company-specific system design blog posts.", weekendTask: "Debrief every interview you've had so far — what broke down, what to adjust." },
  },
  {
    phase: "Phase 5 — Application Sprint",
    dsa: { title: "Final Revision", description: "Light review only — skim your error log, don't cram new patterns this late." },
    systemDesign: {
      title: "Final Revision",
      description: "Re-run your two strongest mock designs once more for confidence and fluency.",
      sections: [
        "Skim your two strongest designs.",
        "Refresh core numbers (latency ballparks, capacity math).",
        "Re-check your go-to building blocks.",
        "Tighten your opening (requirements → estimate → design).",
        "Rehearse clear tradeoff narration.",
      ],
      apply: "Re-run your two strongest mock designs once more for fluency.",
    },
    project: { name: "Offer Prep", weekdayTask: "Research compensation benchmarks for your target roles/locations.", weekendTask: "Prepare negotiation talking points for any active offers." },
  },
  {
    phase: "Phase 5 — Application Sprint",
    dsa: { title: "Final Revision", description: "Light review only. Confidence over cramming — you've put in the work." },
    systemDesign: {
      title: "Final Revision",
      description: "Light review only. Trust your preparation and focus on clear communication in the room.",
      sections: [
        "Light review of your framework, not new material.",
        "Rehearse a calm, structured opening.",
        "Practise concise tradeoff statements.",
        "Prepare 2-3 clarifying questions you always ask.",
        "Rest — trust your preparation.",
      ],
      apply: "Do one relaxed, timed mock focusing purely on clear communication.",
    },
    project: { name: "Close Out", weekdayTask: "Keep interview loops moving; send thank-you notes after each round.", weekendTask: "Review the whole 6-month journey: what worked, what you'd change, and lock in your next-role decision." },
  },
];

module.exports = { WEEK_THEMES };
