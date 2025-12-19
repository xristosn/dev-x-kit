import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { jsonToRust } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { RustTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new RustTargetLanguage());

export default function JsonToRust() {
  return (
    <CodeSplitView
      input={{
        label: 'JSON',
        language: 'json',
        defaultValue: `{
  "task_id": "PROJ-45-FEAT-201",
  "project": "Apollo Launch",
  "title": "Implement user authentication endpoint",
  "priority": "High",
  "status": "In Progress",
  "assigned_to": {
    "user_id": 9001,
    "name": "Alex Johnson"
  },
  "due_date": "2026-01-20T17:00:00Z",
  "tags": ["backend", "security", "API"],
  "estimated_hours": 8.5,
  "dependencies": [
    "PROJ-45-SETUP-100"
  ]
}`,
      }}
      output={{
        label: 'Rust',
        language: 'rust',
        sourceUrl: 'https://github.com/glideapps/quicktype',
      }}
      converter={jsonToRust}
      options={OPTIONS}
    />
  );
}
