.. mermaid::

   flowchart LR
     Operator["Authenticated operator"]
     Route["app/(command)/tasks/page.tsx"]
     Page["task-board-page.tsx"]
     Server["task-board/server.ts"]
     Schema["task-board/schema.ts"]
     Local["config/tasks.local.json"]
     Example["config/tasks.example.json"]

     Operator --> Route
     Route --> Page
     Page --> Server
     Server --> Schema
     Server --> Local
     Example -. documents shape .-> Local
