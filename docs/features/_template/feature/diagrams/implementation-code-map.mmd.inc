.. mermaid::

   flowchart LR
     Entry["Feature entrypoint"]
     UI["UI or API boundary"]
     Module["Feature module"]
     State["State, config, or dependency"]

     Entry --> UI
     UI --> Module
     Module --> State
