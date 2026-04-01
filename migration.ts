import {
  DrizzleSnapshotJSON,
  generateDrizzleJson,
  generateMigration,
} from 'drizzle-kit/api';
import drizzleConfig from 'drizzle.config';
import { existsSync } from 'node:fs';
import { glob, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const NULL_ID = '00000000-0000-0000-0000-000000000000';

const drizleDir = 'drizzle';
const metaDir = join(drizleDir, 'meta');
const journalFile = '_journal.json';

main();

async function main() {
  if (!drizzleConfig.schema) {
    console.error('missing "schema"');
    process.exit(1);
  }

  const schemaGlob = ensureArray(drizzleConfig.schema);
  const resolvedSchemas: string[] = [];

  for await (const schema of glob(schemaGlob)) {
    resolvedSchemas.push(schema);
  }

  const schemas: Record<string, unknown> = {};
  console.log(resolvedSchemas);
  for (const schemaPath of resolvedSchemas) {
    Object.assign(schemas, await import(join(schemaPath)));
  }

  const previousSnapshot = await getPreviousSnapshot();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const prevId: string | undefined =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    previousSnapshot.id === NULL_ID ? undefined : previousSnapshot.id;

  console.log(prevId);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const currentSnapshot = generateDrizzleJson(
    schemas,
    prevId,
    undefined,
    'snake_case',
  );
  console.log(currentSnapshot);

  const upStatement = await generateMigration(
    previousSnapshot,
    currentSnapshot,
  );
  console.log(upStatement);

  const downStatement = await generateMigration(
    currentSnapshot,
    previousSnapshot,
  );
  console.log(downStatement);

  // TODO:
  // 1. need to write UP and DOWN to a file.
  // 2. need to generate snapshot.json and _journal.json to not break drizzle?
}

async function getPreviousSnapshot(): DrizzleSnapshotJSON {
  const metaDirExists = existsSync(metaDir);
  if (!metaDirExists) {
    return getDefaultDrizzleSnapshot();
  }

  const latestSnapshotFile = (await readdir(metaDir))
    .filter((file) => file !== journalFile)
    .sort(snapshotComparator())
    .at(0);
  if (!latestSnapshotFile) {
    return getDefaultDrizzleSnapshot();
  }

  return readFile(join(metaDir, latestSnapshotFile), {
    encoding: 'utf-8',
  });
}

function getDefaultDrizzleSnapshot(): DrizzleSnapshotJSON {
  return {
    id: NULL_ID,
    _meta: {
      columns: {},
      schemas: {},
      tables: {},
    },
    dialect: 'postgresql',
    enums: {},
    prevId: NULL_ID,
    schemas: {},
    tables: {},
    version: '7',
  };
}

function snapshotComparator() {
  return (a: string, b: string) => {
    const aTs = Number.parseInt(a.split('_', 1)[0], 10);
    const bTs = Number.parseInt(b.split('_', 1)[0], 10);

    return bTs - aTs;
  };
}

function ensureArray<T>(val: T | T[]): T[] {
  return Array.isArray(val) ? val : [val];
}
