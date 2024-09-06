export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',  // Transforma archivos .ts y .tsx
  },
  transformIgnorePatterns: [
    '/node_modules/',  // Evita transformar archivos de node_modules
  ],
};

