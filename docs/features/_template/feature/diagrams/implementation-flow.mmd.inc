.. mermaid::

   flowchart TD
     Start["Feature starts"]
     StepOne["Read input or state"]
     Decision{"Important decision"}
     Success["Successful outcome"]
     Fallback["Fallback or error outcome"]

     Start --> StepOne
     StepOne --> Decision
     Decision -- yes --> Success
     Decision -- no --> Fallback
