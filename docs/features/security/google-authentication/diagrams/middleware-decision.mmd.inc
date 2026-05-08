.. mermaid::

   flowchart TD
     Request["Incoming request"]
     Public{"Public path?"}
     Session{"Session exists?"}
     Api{"API route?"}
     Allow["Continue request"]
     Redirect["Redirect to /login?callbackUrl=..."]
     Reject["Return 401 JSON"]

     Request --> Public
     Public -- yes --> Allow
     Public -- no --> Session
     Session -- yes --> Allow
     Session -- no --> Api
     Api -- yes --> Reject
     Api -- no --> Redirect
