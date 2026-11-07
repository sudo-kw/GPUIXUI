// Bug guarded: the comment fixer read a shebang as a comment and deleted it.
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../../../../", import.meta.url));
const dir = mkdtempSync(join(tmpdir(), "comment-budget-"));

const fixed = (source: string): string => {
  const file = join(dir, "sample.ts");
  writeFileSync(file, source);
  spawnSync(
    join(root, "node_modules/.bin/oxlint"),
    ["--config", join(root, ".oxlintrc.json"), "--fix", file],
    { cwd: root },
  );
  return readFileSync(file, "utf8");
};

const LONG = "/**\n * one\n * two\n * three\n */\n";

describe("the comment fixer", () => {
  afterAll(() => rmSync(dir, { recursive: true }));

  it("removes a long comment and keeps the code under it", () => {
    const result = fixed(
      `${LONG}import { a } from "./a";\nexport const b = a;\n`,
    );

    expect(result).toBe(`import { a } from "./a";\nexport const b = a;\n`);
  });

  it("keeps a shebang in a file over its comment budget", () => {
    const over = ["a", "b", "c", "d"]
      .map((name) => `// ${name}\nexport const ${name} = 1;\n`)
      .join("");

    const result = fixed(`#!/usr/bin/env node\n${over}`);

    expect(result.startsWith("#!/usr/bin/env node\n")).toBe(true);
    expect(result).toContain("export const d = 1;");
  });
});
