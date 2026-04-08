import type { Config } from 'jest';
import { readFileSync } from 'node:fs';
import { pathsToModuleNameMapper } from 'ts-jest';
import ts from 'typescript';
import type tsconfig from './tsconfig.json';

const result = ts.parseConfigFileTextToJson(
  'tsconfig.json',
  readFileSync('./tsconfig.json', 'utf-8'),
);
if (result.error) {
  console.error(result.error);
  process.exit(1);
}
const config = result.config as typeof tsconfig;

export default {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['./src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  maxWorkers: 2,
  moduleNameMapper: pathsToModuleNameMapper(config.compilerOptions.paths, {
    prefix: '<rootDir>/.',
  }),
} satisfies Config;
