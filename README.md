# JM's Coffee Shop

Recondo, Juan Miguel V.

## Overview

An SPA frontend for the Spring Boot coffee shop server. It provides full menu management (CRUD), order tracking, a dashboard, and an agentic AI barista chat powered by the `POST /agent` endpoint.

Built with Vite, React, and TypeScript.

> [!IMPORTANT]
> AI task tested with `GEMINI_API_KEY` configured

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- JDK 17+
- OPTIONAL: a free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Option A — Automated (recommended)

```bash
# 1. Set your Gemini key (AI chat only, skip if you don't use it)
#    bash:        export GEMINI_API_KEY=your-key
#    powershell:  $env:GEMINI_API_KEY = "your-key"

# 2. Install dependencies
npm install

# 3. Start the server and frontend together
npm start
```

> [!TIP]
> Access [Swagger](http://localhost:8080/swagger-ui/index.html) for an overview of the API specifications.

`npm start` downloads the server jar into `bin/` on first run (from `https://assets.jmrecondo.com/react-assessment/jm-coffeeshop.jar`), then launches both processes with `concurrently`:

> [!NOTE]
> Spring Boot API: [http://localhost:8080](http://localhost:8080)
> 
> Vite dev server: [http://localhost:5173](http://localhost:5173)

### Option B — Manual

#### Run the server
##### Powershell
```ps
$env:GEMINI_API_KEY=<key_here>

java -jar <jar_file_here>
```

##### Bash
```bash
GEMINI_API_KEY=<key_here> java -jar <jar_file_here>
```

#### Install and run the frontend
```bash
npm install && npm run dev
```

> [!NOTE]
> Access at [http://localhost:5173](http://localhost:5173)

## Features

- `Dashboard` — Live stats for menu items, orders, revenue, and popular items.
- `Menu management` — Full CRUD (list, create, edit, delete) with a pre-filled edit form, confirmation before delete, loading/error states, and category filtering.
- `Orders` — List all orders with status badges, pagination, and a per-order detail view.
- `AI Barista chat` — Plain-text conversation with the agentic AI endpoint, a "thinking" indicator, suggested prompts, and auto-scroll.
- `Patrons` — A gallery page of the shop's regulars.
- `Responsive UI` — Dark/light theme toggle, Tailwind CSS styling, toast notifications.

## Tech Stack

| Layer        | Technology                                             |
| ------------ | ------------------------------------------------------ |
| Build tool   | [Vite](https://vite.dev/)                              |
| UI library   | [Shadcn](https://ui.shadcn.com/)          |
| Routing      | [React Router](https://reactrouter.com/)         |
| State management | [Redux Toolkit](https://redux-toolkit.js.org/) |
| Query client | [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) |
| Forms        | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Styling      | [Tailwind CSS](https://tailwindcss.com/)             |
| Icons        | [Lucide](https://lucide.dev/)                    |

## Routes

| Path               | Page                       | Notes                          |
| ------------------ | -------------------------- | ------------------------------ |
| `/`                | Home / Dashboard           | Stats & popular items          |
| `/menu`            | Menu list                  | Table + category filter        |
| `/menu/create`     | Add menu item              | Form in a side sheet           |
| `/menu/:id/edit`   | Edit menu item             | Pre-filled via `useParams`     |
| `/barista`         | AI Barista chat            | Posts plain text to `/agent`   |
| `/orders`          | Orders list                | Status badges + pagination     |
| `/orders/:orderId` | Order detail               | Reads param via `useParams`    |
| `/patrons`         | Patrons gallery            |                                |
| `/404`             | Error page                 | Catch-all redirects here       |
| `*`                | Not found                  | Redirects to `/404`            |

Routes are declared in `src/config/routes.ts` and rendered by `src/App.tsx` inside `DefaultLayout`, which provides the persistent `NavLink` navigation bar with active-link styling.

## Project Structure

```bash
src/
├── App.tsx                  # Router setup
├── main.tsx                 # Entry: Redux + Theme providers
├── config/
│   └── routes.ts            # Centralized route configuration
├── layout/
│   └── DefaultLayout.tsx    # Nav bar, theme toggle, outlet
├── pages/                   # HomePage, MenuPage, OrdersPage, BaristaPage, ...
├── components/
│   ├── MenuForm.tsx         # Reusable create/edit form
│   ├── menu/MenuManageSheet.tsx
│   └── ui/                  # shadcn-style UI primitives
├── hooks/
│   ├── useMenuForm.ts       # Custom hook: form state + validation
│   └── useToast.ts          # Custom hook: toast notifications
├── schemas/
│   ├── menuFormSchema.ts    # Zod schema for menu items
│   └── gen/                 # Generated Zod schemas
├── store/
│   ├── emptyApi.ts          # RTK Query base (baseUrl + agent text handler)
│   ├── index.ts             # Redux store
│   └── gen/                 # Generated API endpoints (menu, orders, agent)
└── lib/
    └── utils.ts             # cn() helper, badge classes
```

## API Layer

All HTTP calls go through the query client (`src/store/emptyApi.ts`):

- **Base URL:** `http://localhost:8080`
- **Special handling:** requests to `/agent` use a plain-text response handler (the AI endpoint returns text, not JSON).
- **Error handling:** RTK Query surfaces non-2xx responses as errors, which pages use to render loading and error states (e.g. `isLoading`, `isError` from generated hooks).

The typed endpoint hooks are generated from the OpenAPI spec into `src/store/gen/`:

- `src/store/gen/menu.ts` → `useGetAll1Query`, `useCreate1Mutation`, `useUpdateMutation`, `useDeleteMenuByIdMutation`, `useGetByCategoryQuery`, `useGetAvailableQuery`
- `src/store/gen/orders.ts` → order list/detail/status mutations
- `src/store/gen/agent.ts` → `useAskMutation` (POST `/agent`)

## Custom Hooks

- `useMenuForm` — wraps `react-hook-form` + Zod validation, managing default values, edit mode detection, and submit handling for the menu create/edit form.
- `useToast` — provides typed toast helpers (`menuCreated`, `menuDeleted`, `error`, etc.) used across pages.

## Available Scripts

| Script           | Description                                        |
| ---------------- | -------------------------------------------------- |
| `npm start`      | Download the jar (if missing) and run server + frontend |
| `npm run dev`    | Start the Vite dev server (frontend only)          |
| `npm run server` | Download the jar (if missing) and run the server |
| `npm run build`  | Type-check (`tsc -b`) and build for production     |
| `npm run preview`| Preview the production build                       |
| `npm run lint`   | Run oxlint                                          |
| `npm run codegen:zod` | Generate Zod schemas from OpenAPI              |
| `npm run codegen:rtk` | Generate RTK Query endpoints from OpenAPI      |
| `npm run codegen:all` | Run both codegen steps                         |

> [!TIP]
> The codegen tooling uses `openapi-config.ts` and `scripts/gen-zod.cjs`. Re-run `npm run codegen:all` after the server API changes to regenerate the typed API hooks and schemas.

## AI Barista (Gemini)

The Barista page sends plain-text prompts to `POST /agent`, which calls the model with tool-calling (menu lookups and order placement). It maintains a running conversation log and shows a "thinking" indicator while the agent works.

To use this feature, the server needs `GEMINI_API_KEY` exported in its environment (see [Getting Started](#getting-started)). Without a key, the rest of the app works normally, but the AI chat will return an error.

Try a multi-step request like:

> *"show available coffees, then order a latte and tell me the total"*

The resulting order will appear on the `Orders` page.