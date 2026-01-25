# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use Bun for all commands (not npm/yarn/pnpm):

```bash
bun install              # Install dependencies
bun run build            # Build TypeScript (n8n-node build)
bun run build:watch      # Watch mode compilation
bun run dev              # Development mode
bun run lint             # Lint with n8n rules
bun run lint:fix         # Auto-fix lint issues
bun test                 # Run all tests
bun test <file>          # Run specific test file
```

## Architecture

This is an n8n community node package for Hey Pocket AI.

### Node Structure

```
nodes/HeyPocketAi/
├── HeyPocketAi.node.ts      # Main node class (INodeType)
├── resources/               # One folder per API resource
│   ├── recording/           # Recording operations
│   │   ├── index.ts         # Combines operations, defines routing
│   │   ├── getAll.ts        # Individual operation (INodeProperties[])
│   │   ├── get.ts
│   │   └── getAudioUrl.ts
│   └── tag/
│       └── index.ts
└── utils/
    └── extractDataFromResponse.ts  # Post-processor for all API responses
```

### Key Patterns

- **Resource/Operation pattern**: Each resource folder exports `description` (INodeProperties[]) and `execute` function
- **Declarative routing**: Operations define their HTTP method, URL, and parameters - no imperative request handling
- **Response processing**: All responses flow through `extractDataFromResponse` which extracts `data` from `{success, data}` format
- **Pagination**: Uses n8n's generic pagination with `has_more` continuation flag

### Credentials

`credentials/HeyPocketAiApi.credentials.ts` - Bearer token auth with test endpoint at `/api/v1/public/tags`

## Testing

Tests use Bun's native test runner. Import from `bun:test`:

```ts
import { describe, test, expect } from 'bun:test';
```

Test files are colocated with source (e.g., `extractDataFromResponse.test.ts`).

## API

Base URL: `https://public.heypocketai.com`

- `GET /api/v1/public/recordings` - List recordings (paginated, filterable)
- `GET /api/v1/public/recordings/{id}` - Get single recording
- `GET /api/v1/public/recordings/{id}/audio-url` - Get pre-signed download URL
- `GET /api/v1/public/tags` - List tags
