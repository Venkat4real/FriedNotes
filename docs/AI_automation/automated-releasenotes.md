---
layout: docs
title: GitHub Actions Workflow
description: This page lists the GitHub Actions workflows.
---
## GitHub Actions Workflow: Release Notes Automation

The source files for the automated release notes are located at:

#### YAML file

Repo → .github → workflows → release-notes-cycle.yml

#### JavaScript

Repo → .github → scripts → update-release-notes.js

This workflow automatically updates the repository's release notes file. It coordinates with the Node.js script.

### Triggers

The workflow runs in three scenarios:

- PR Merge — When a pull request is merged to main
- Weekly Schedule — Every Tuesday at 9:00 AM UTC
- Manual Trigger — Via workflow_dispatch (run it manually from the Actions tab)

What It Does

Step 1: Checkout Code
Clones the repository's main branch with full history.

Step 2: Setup Node.js
Installs Node.js v24.
Enables npm caching for faster builds.

Step 3: Run the Update Script
If a PR is merged, runs in PR mode and adds the PR to the release notes.
If scheduled or manually triggered, runs in weekly mode, archives the week's PRs in a dated section, and resets the auto-section.

Step 4: Commit and Push
Configures Git as the GitHub Actions bot.
Stages the updated docs/release_notes.md.
Commits with a message such as `docs: auto-update release notes for pull_request cycle`.
Pushes the changes back to main.
(Silently skips the step if no changes occur.)

The Flow
PR Merged → workflow triggers → adds entry to auto-section → commits & pushes

Tuesday 9 AM → weekly mode triggers → rotates auto-section into dated entry → commits & pushes

## Release Notes Automation Script

The source file for the Release Notes Automation Script is in the path:

Repo -> .github -> scripts -> update-release-notes.js

This Node.js script automatically maintains a GitHub repository's release notes file by managing pull request entries. It's designed to run as a GitHub Action.
Key Features
Two Modes:

## PR Mode (node update-release-notes.js pr) — Triggered when a PR is merged

- Reads the GitHub event payload to extract PR details (number, title, author, merge date)
- Formats the PR as a markdown entry with a link
- Inserts it into the "Auto-generated release notes" section
- Skips duplicates

## Weekly Mode (node update-release-notes.js weekly) — Rotates accumulated notes

- Collects all PRs accumulated in the auto-section over the past week
- Archives them into a dated section like "Release Update - Week of 2024-01-15 to 2024-01-22"
- Resets the auto-section back to empty
