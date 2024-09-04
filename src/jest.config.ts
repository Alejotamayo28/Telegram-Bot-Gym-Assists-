import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/dist/', '/node_modules/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transforma archivos .ts y .tsx usando ts-jest
  },
};
export default config;


