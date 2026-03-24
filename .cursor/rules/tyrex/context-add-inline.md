### Context Ingestion (inline procedure)

When ingesting context:

1. Ask input type:
   ```
   Context source:
     [1] Free text — paste or describe
     [2] File path — point to a document
     [3] URL — fetch a web page
   ```
2. Process the input:
   - **Free text:** save as-is, trim to 200 lines max
   - **File path:** read the file, summarize if > 200 lines
   - **URL:** fetch content, extract text, summarize if > 200 lines
3. Save with YAML frontmatter:
   ```yaml
   ---
   source: [text | file | url]
   added: YYYY-MM-DD
   scope: [project | feature]
   ---
   [content]
   ```
4. File naming: `YYYY-MM-DD-[slug].md`
5. Location: project scope → `.tyrex/context/`, feature scope → `.tyrex/features/NNN-context.md`
6. Confirm: show file path, line count, 2-line preview
