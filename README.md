<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/ythr-hero-ondark.png">
    <img src="assets/ythr-hero-onlight.png" alt="ythr" width="220">
  </picture>
</p>

# apps — a little hub of learning & tooling

Public landing hub served at **https://yoggit.github.io/apps/**, split into two categories:

**For Kids** — calm, ad-free, invitation-only apps for children and their families:
- **Gnaana-Kosha** — invitation-only learning hub (grades 3–6) → https://yoggit.github.io/gnaana-kosha-welcome/
- **Gaṇitha** — invitation-only elementary math & reasoning practice → https://yoggit.github.io/ganitha-welcome/
- **Abhyaasa** — music practice tracker → https://yoggit.github.io/Abhyaasa/

**Professional** — open-source tools for QA & test automation:
- **Swayambhu-QA** — agentic-AI QA pipeline (ticket → passing test suite) → https://yoggit.github.io/swayambhu-qa/
- **Sarva-Varadi** — universal test-reporting framework → https://yoggit.github.io/sarva-varadi/

Self-contained single `index.html` (no build step). A "For Kids / Professional" toggle switches
between the two groups. Light/dark theme aware (follows the visitor's system setting, with a manual
toggle that persists). Brand-neutral; no tracking.
