# Diane OS User Guide: Phase 1

## Home

Home answers four immediate questions:

- What is open?
- What is overdue?
- What am I waiting for?
- What is sitting in my inbox?

It also shows selected next actions, due-soon work and recently updated projects.

## Today

Today is intentionally narrower than Home. It puts overdue work and selected next actions into a top-three list and keeps waiting follow-ups nearby.

## Quick capture

Use Capture when stopping to classify information would make you lose it. Only the main text is required. Optional project, area, vault, due date, privacy and tags can be added when obvious.

Every capture lands in Inbox. Nothing is silently converted by AI.

## Inbox

For each capture, choose:

- **Task:** create an actionable item
- **Project:** create a defined outcome
- **Processed:** remove it from the active inbox without creating another record

Later increments will add edit, defer, duplicate detection, decision conversion and AI suggestions.

## Projects

A project should describe a result, not a permanent responsibility. Record:

- desired outcome
- success criteria
- health
- target date
- single next action
- related area and vault

Tasks linked to the project appear on its detail page.

## Areas

An area is ongoing. Examples include CIT Management, Health, Family, Household and Finances. Record the purpose and review frequency.

## Tasks

Use the task views for open, overdue, this week, waiting and completed work. A task with a waiting-on value is automatically normalized to Waiting when it is created with the default Next status.

## Vaults

Vaults are broad organizational views, not isolated databases. Confidentiality belongs to each record as well as the vault default, so cross-vault relationships can remain accurate later.

## Search

Search uses PostgreSQL text search plus tags. It does not require AI. Each result states whether the title, content, waiting-on field or tag matched.

## Privacy labels

- **Personal Private:** default personal material
- **Sensitive Personal:** health, financial, family or identity-related material
- **Personal Professional Knowledge:** Diane's generalized methods, learning and career knowledge
- **Company Confidential:** employer-specific people, customers, suppliers, shipments, operations or commercial data
- **Shareable:** approved for limited sharing
- **Public:** intentionally approved for public use

A label is an operational warning, not permission to move employer data outside approved systems.
