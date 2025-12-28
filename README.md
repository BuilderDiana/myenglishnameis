# MyEnglishNameIs

**AI-powered English name recommendation for Chinese native speakers**

_A sophisticated naming system designed for cultural resonance, personal fit, and long-term identity._

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

---

## 📖 Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [The Solution (MVP Features)](#the-solution-mvp-features)
- [Technical Highlights](#technical-highlights)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Philosophy](#philosophy)

---

## Overview

MyEnglishNameIs is an AI-native product specifically designed to help Chinese native speakers find English names that are not just "nice-sounding," but **culturally valid, personally resonant, and professionally appropriate**.

We believe an English name is more than a label—it's a bridge for cross-cultural communication and a part of one's global identity.

---

## The Problem

Choosing an English name is often a struggle for Chinese speakers:

- ❌ **Cultural Mismatch**: Choosing names that sound "odd" or "dated" to native speakers.
- ❌ **Lack of Connection**: Picking names randomly without any link to one's original identity.
- ❌ **Inexplainability**: Being unable to explain _why_ a name was chosen when asked.
- ❌ **Surface-level AI**: Generic AI tools often provide quantity over quality, ignoring the nuances of Chinese-Western cultural synthesis.

---

## The Solution (MVP Features)

Our Core MVP focuses on **Deep Persona Synthesis** to provide highly personalized recommendations.

### 🎯 Phonetic & Semantic Resonance

Our AI doesn't just pick names; it searches for **echoes**. It analyzes your Chinese name to find English counterparts that share similar sounds (phonetic resonance) or poetic meanings (semantic resonance), creating a seamless bridge between your identities.

### 🐉 Cultural Depth (Zodiac Synthesis)

We integrate the **Chinese Zodiac** as a mandatory input. By synthesizing Eastern zodiac traits with Western astrological profiles, the AI builds a multi-dimensional persona for more accurate matching.

### ⚖️ The "Golden Ratio" Vibe Selection

Based on product research, we've implemented a "Golden Ratio" selection limit (up to 2 traits). This forces a sharp focus on your core personality while allowing for "contrasting depth" (e.g., _Rational + Elegant_), preventing the AI from falling into generic "middle-ground" results.

### ✨ Vibrant & Semantic Iconography

The interface features a modern, colorful design system. We've replaced abstract symbols with vibrant, semantic icons for all 12 Zodiac signs and 16 MBTI types, making the selection process intuitive and visually engaging.

### 💬 Explainable AI (The "Why It Fits" Report)

Every recommendation comes with a detailed report explaining the cultural origin, pronunciation, and—most importantly—the specific reasons why it fits your unique profile.

---

## Technical Highlights

### 🛡️ CI/CD Robustness & Build-Time Safety

The project is built for professional deployment. We implemented **lazy initialization** for the OpenAI client to ensure `next build` succeeds in CI environments (like GitHub Actions) even without active API credentials, demonstrating a deep understanding of the Next.js build lifecycle.

### 🔒 Type-Safe Data Contracts

We use **Zod** for strict schema validation across the entire stack. From frontend form submissions to AI response parsing, every data point is validated, ensuring high reliability and easy debugging.

---

## Tech Stack

| Category   | Technology                                      |
| ---------- | ----------------------------------------------- |
| Framework  | [Next.js 16](https://nextjs.org/) (App Router)  |
| Language   | [TypeScript 5](https://www.typescriptlang.org/) |
| UI Library | [React 19](https://react.dev/)                  |
| Styling    | [Tailwind CSS 4](https://tailwindcss.com/)      |
| Validation | [Zod](https://zod.dev/)                         |
| AI Engine  | OpenAI API (GPT-4o)                             |
| CI/CD      | GitHub Actions                                  |

---

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/BuilderDiana/myenglishnameis.git
cd myenglishnameis

# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file and add:
# OPENAI_API_KEY=your_key_here

# Run development server
npm run dev
```

---

## Project Structure

```
myenglishnameis/
├── app/                      # Next.js App Router
│   ├── api/generate/         # AI Generation Logic (Build-safe)
│   ├── results/              # Dynamic Results Display
│   ├── lib/contracts.ts      # Zod Schemas & Type Definitions
│   ├── page.tsx              # High-conversion Landing Page
│   └── globals.css           # Tailwind 4 Global Styles
├── .github/workflows/        # CI/CD Pipelines
└── public/                   # Static Assets & Icons
```

---

## Philosophy

We believe that **technology should enhance human understanding, not replace it**. MyEnglishNameIs is built on the principles of:

- **AI-Native Design**: Using LLMs for reasoning, not just text generation.
- **Cultural Sensitivity**: Respecting the weight of a name in both Eastern and Western contexts.
- **User Empowerment**: Providing the knowledge for users to make their own informed choices.

---

**Built with ❤️ by Diana**
_Empowering global identities through cultural resonance._

**© 2026 Diana. All rights reserved.**
