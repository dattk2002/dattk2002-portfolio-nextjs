import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const payloadPath = args[0];
const repoIndex = args.indexOf('--repo');
const repo = repoIndex >= 0 ? args[repoIndex + 1] : '/home/bia/Works/Coding/dattk2002-portfolio-nextjs';
if (!payloadPath || !repo) {
  console.error('Usage: node validate-draft.mjs <payload.json> [--repo <repository>]');
  process.exit(2);
}
try {
  const require = createRequire(path.join(path.resolve(repo), 'package.json'));
  const ts = require('typescript');
  const compile = source => ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText;
  const asModule = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  const types = asModule(compile(await readFile(path.join(repo, 'lib/blog/types.ts'), 'utf8')));
  const zod = pathToFileURL(require.resolve('zod').replace(/\.cjs$/, '.js')).href;
  const validation = compile(await readFile(path.join(repo, 'lib/blog/validation.ts'), 'utf8'))
    .replace(/from ["']@\/lib\/blog\/types["']/g, `from ${JSON.stringify(types)}`)
    .replace(/from ["']zod["']/g, `from ${JSON.stringify(zod)}`);
  const { blogPostInputSchema } = await import(asModule(validation));
  const payload = JSON.parse(await readFile(payloadPath, 'utf8'));
  const result = blogPostInputSchema.safeParse(payload);
  const draftOnly = result.success && result.data.translations.every(t => t.status === 'draft' && t.publishedAt === null);
  const valid = result.success && draftOnly;
  console.log(JSON.stringify({ valid, schemaValid: result.success, draftOnly,
    issues: result.success ? (draftOnly ? [] : [{ message: 'Draft validation requires draft status and null publishedAt for every translation.' }]) : result.error.issues,
  }, null, 2));
  process.exitCode = valid ? 0 : 1;
} catch (error) {
  console.error(JSON.stringify({ valid: false, error: error instanceof Error ? error.message : 'Validation failed' }));
  process.exitCode = 1;
}
