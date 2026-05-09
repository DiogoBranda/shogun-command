.. mermaid::

   flowchart LR
     Types["task-board/types.ts"]
     Schema["task-board/schema.ts"]
     Server["task-board/server.ts"]
     Page["task-board-page.tsx"]
     Check["scripts/check-tasks-config.mjs"]
     Local["config/tasks.local.json"]
     Example["config/tasks.example.json"]

     Types --> Schema
     Schema --> Server
     Server --> Page
     Local --> Server
     Example --> Check
     Local --> Check
