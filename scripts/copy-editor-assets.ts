async function copyEditorAssets() {
  const { cp, mkdir, stat } = await import('node:fs/promises');
  const { dirname, resolve } = await import('node:path');
  const projectRoot = process.cwd();
  const sources = [
    {
      source: resolve(projectRoot, 'node_modules/monaco-editor/min/vs'),
      destination: resolve(projectRoot, 'public/monaco/vs'),
    },
    {
      source: resolve(projectRoot, 'node_modules/@types/react'),
      destination: resolve(projectRoot, 'public/types/react-local'),
    },
  ];

  for (const { source, destination } of sources) {
    try {
      await stat(source);
    } catch {
      throw new Error(
        `Required editor assets were not found at ${source}. Run pnpm install first.`
      );
    }

    await mkdir(dirname(destination), { recursive: true });
    await cp(source, destination, { recursive: true, dereference: true });
  }
}

copyEditorAssets().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
