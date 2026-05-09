.. mermaid::

   sequenceDiagram
     participant Page as Tasks page
     participant Server as getTasks()
     participant Local as tasks.local.json
     participant Schema as Task schema
     participant UI as Task cards

     Page->>Server: Request task manifest
     Server->>Local: Read private local JSON
     alt file missing
       Server->>Local: Create fallback local manifest
     end
     Server->>Schema: Validate parsed manifest
     alt valid
       Schema-->>Server: Normalized tasks
     else invalid or parse error
       Schema-->>Server: Validation errors
       Server->>Server: Use built-in fallback
     end
     Server-->>Page: TaskManifest
     Page-->>UI: Render lanes, cards, counts, links
