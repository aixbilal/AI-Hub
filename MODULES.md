# AI Hub — Master Module Map

## Purpose

This document defines the purpose, responsibilities, boundaries, and
relationships of every planned AI Hub module. It is the master reference
for the system's capabilities, including modules not yet implemented.

A planned module is not an implemented feature. Status must be updated
only after implementation and testing.

## 1. Core Platform

### 1.1 Request and Conversation Gateway
Purpose: receive requests from a compatible client and return useful results.
Responsibilities: validate inputs, establish request context, route tool calls.
Boundary: the gateway does not independently grant permissions.

### 1.2 Orchestrator
Purpose: coordinate tools, models, modules, and multi-step workflows.
Responsibilities: choose approved operations, track progress, handle failures.
Boundary: execution must remain within explicit permissions and limits.

### 1.3 Permission and Approval Manager
Purpose: control what the Hub may access or change.
Responsibilities: approved folders, action-specific permissions, approval requests.
Boundary: model-generated instructions cannot bypass this manager.

### 1.4 Audit and Activity History
Purpose: make important operations understandable and reviewable.
Responsibilities: record action, scope, approval, outcome, and errors.
Boundary: do not store passwords, tokens, or unnecessary private message content.

### 1.5 Notifications and Review Centre
Purpose: show the user what matters without requiring constant app switching.
Responsibilities: summaries, warnings, pending approvals, priorities, completed work.
Boundary: show evidence, uncertainty, and the source of important findings.

## 2. AI and Knowledge

### 2.1 Model Gateway and Router
Purpose: provide a replaceable interface to different AI providers.
Responsibilities: route eligible tasks to local or online models, track failures.
Boundary: provider choice never changes access permissions.

### 2.2 Local Model Runtime
Purpose: run selected models on the user's computer.
Responsibilities: local summarization, classification, extraction, and assistance.
Boundary: local availability and quality depend on hardware and model choice.

### 2.3 Online Model Connectors
Purpose: optionally use external models for tasks that benefit from them.
Responsibilities: provider configuration, request handling, usage limits, errors.
Boundary: never send private data to a provider without an appropriate policy
and authorization; free API access is not assumed.

### 2.4 Shared Memory and Knowledge
Purpose: preserve useful context across tasks and sessions.
Responsibilities: store approved goals, decisions, preferences, tasks, and notes.
Boundary: distinguish verified facts from suggestions and outdated information.

### 2.5 Planning and Task Management
Purpose: convert goals and findings into actionable work.
Responsibilities: tasks, priorities, deadlines, dependencies, progress reviews.
Boundary: recommendations do not count as completed actions.

### 2.6 Workflow and Scheduling Engine
Purpose: run approved repeatable workflows and scheduled checks.
Responsibilities: triggers, job limits, retries, status, cancellation.
Boundary: no unrestricted or unbounded autonomous execution.

## 3. Computer and Development

### 3.1 Project Registry
Purpose: maintain a known list of approved projects and their locations.
Responsibilities: project metadata, paths, technologies, status.
Boundary: registered paths do not grant unrestricted write access.

### 3.2 Local File Explorer
Purpose: find and summarize information in approved folders.
Responsibilities: safe search, metadata inspection, selected-file reading.
Boundary: read-only by default; validate paths and prevent traversal.

### 3.3 Coding Assistant
Purpose: help understand and improve local software projects.
Responsibilities: inspect code, explain errors, suggest patches, summarize changes.
Boundary: proposals are separate from applying modifications.

### 3.4 GitHub Operations
Purpose: review repositories and relevant development activity.
Responsibilities: repository health, issues, pull requests, changes, project reports.
Boundary: commits, pushes, merges, and external changes require authorization.

### 3.5 Test and Diagnostics Runner
Purpose: execute explicitly approved checks and report results.
Responsibilities: run selected tests, type checks, builds, and diagnostic commands.
Boundary: restrict commands, working directories, runtime, and side effects.

### 3.6 Backup and Recovery
Purpose: reduce the impact of mistakes and support recovery.
Responsibilities: version history, selected backups, restore procedures.
Boundary: verify backup integrity; never assume a backup succeeded.

## 4. Personal Operations

### 4.1 Personal Planner
Purpose: coordinate goals, studies, routines, and commitments.
Responsibilities: plans, deadlines, workload, progress, review suggestions.
Boundary: the user remains responsible for final personal decisions.

### 4.2 Personal Email
Purpose: summarize and organize authorized personal inboxes.
Responsibilities: account-wise summaries, important messages, proposed replies.
Boundary: sending and deleting messages require explicit approval.

### 4.3 Personal WhatsApp
Purpose: identify important conversations and potential replies.
Responsibilities: authorized message review, priority suggestions, draft responses.
Boundary: access depends on supported integrations and user authorization.

### 4.4 Personal Social Media
Purpose: help organize personal content and maintain a consistent public identity.
Responsibilities: content selection suggestions, captions, editing ideas, trends.
Boundary: private photos and account data require careful access controls;
posting requires approval.

### 4.5 Personal Contacts
Purpose: keep useful contact details and follow-ups organized.
Responsibilities: names, approved contact details, relationship context, reminders.
Boundary: minimize stored personal information and restrict access.

## 5. Work and Client Operations

### 5.1 Work Email
Purpose: organize dedicated work and client inboxes.
Responsibilities: summaries, action items, draft replies, follow-up tracking.
Boundary: respect client confidentiality and account-specific permissions.

### 5.2 Work WhatsApp
Purpose: help manage authorized freelance and business conversations.
Responsibilities: identify enquiries, summarize conversations, draft replies.
Boundary: sending messages or making commitments requires approval.

### 5.3 Work Social Media
Purpose: assist with owned business accounts and content planning.
Responsibilities: platform-specific ideas, content calendars, draft posts, reports.
Boundary: publishing and account changes require approval.

### 5.4 Client Relationship Manager
Purpose: track client work and maintain professional follow-up.
Responsibilities: deliverables, agreed review dates, outcomes, follow-up reminders.
Boundary: never invent performance claims or send unverified client reports.

### 5.5 Contacts and Complaints
Purpose: consolidate relevant enquiries, complaints, and their resolution status.
Responsibilities: intake references, priority, ownership, response drafts, tracking.
Boundary: protect customer information and avoid duplicate or unauthorized replies.

## 6. Business Intelligence and E-commerce Integration

The AI Hub is separate from the e-commerce product. These modules describe
Hub-side oversight and integration, not the entire storefront implementation.

### 6.1 Personal Store Monitor
Purpose: provide a consolidated review of the user's own store.
Responsibilities: orders, complaints, sales, conversion, traffic, product metrics,
alerts, website performance, and recommended investigations.
Boundary: use connected data sources; do not invent missing metrics.

### 6.2 Client Store Monitor
Purpose: monitor client stores according to their contracts and service scope.
Responsibilities: agreed metrics, periodic reviews, pixel/analytics checks,
issues requiring attention, and client-ready reports.
Boundary: access and review frequency must follow each client's agreement.

### 6.3 Product Research
Purpose: evaluate a product systematically instead of choosing impulsively.
Responsibilities: demand, audience, competition, supply, costs, margin,
differentiation, risks, and short- versus long-term potential.
Boundary: distinguish evidence from hypotheses and record sources.

### 6.4 Digital Marketing Intelligence
Purpose: support marketing learning and campaign analysis.
Responsibilities: campaign metrics, audience insights, problem/solution library,
experiment tracking, strategy suggestions.
Boundary: advertising spend and campaign changes require approval.

### 6.5 SEO, AEO, GEO, and Website Insights
Purpose: review discoverability, content, metadata, and website performance.
Responsibilities: technical checks, page quality, search visibility, structured
content suggestions, speed and indexing reports.
Boundary: recommendations must be tested; ranking outcomes are not guaranteed.

## 7. Separate E-commerce Product

### 7.1 Customer Storefront
Purpose: present products and deliver a trustworthy shopping experience.
Responsibilities: catalog, product pages, navigation, accessibility, performance,
brand identity, and customer-facing content.

### 7.2 Product Story and Content Pages
Purpose: give selected premium products deeper explanations and presentation.
Responsibilities: rich product information, media, buying guides, related content.
Boundary: richer presentation must be balanced with accessibility and performance.

### 7.3 Store Administration
Purpose: manage store content and day-to-day operations.
Responsibilities: products, orders, inventory where applicable, pages, and reports.

### 7.4 Store Analytics and Tracking
Purpose: measure customer journeys and store performance.
Responsibilities: analytics, consent-aware tracking, pixel health, conversion events.
Boundary: protect customer data and respect applicable consent requirements.

### 7.5 Hub Integration Adapter
Purpose: expose selected store data to the AI Hub.
Responsibilities: scoped data access, validated reports, integration health.
Boundary: the Hub does not bypass store authorization or payment security.

## 8. Cross-Cutting Requirements

- Security and secret management.
- Data minimization and privacy.
- Error handling and service health.
- Logging and auditability.
- Backups and recovery.
- Provider-independent model interface.
- Human approval for sensitive or irreversible actions.
- Clear distinction between planned, implemented, and verified features.

## 9. Implementation Status

All modules listed above are planned concepts until individually implemented
and tested. The initial TypeScript/MCP project exists, but live MCP operation
and each tool's actual behavior must be verified before being marked complete.

## 10. Design Rule

Build the smallest useful capability first. Keep modules separate in
responsibility, share common security and memory infrastructure, and add
integrations only when there is a clear need and a testable success criterion.
