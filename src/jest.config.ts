export default {
  preset: 'ts-jest',  // Usa 'ts-jest' para compilar TypeScript con Jest
  testEnvironment: 'node',  // Para simular un entorno Node.js
  transform: {
    '^.+\\.tsx?$': 'ts-jest',  // Transforma archivos TypeScript
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],  // Extensiones permitidas
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',  // Para alias de paths si usas alguno
  },
  transformIgnorePatterns: [
    '/node_modules/',  // Ignorar transformación en node_modules
  ],
};

