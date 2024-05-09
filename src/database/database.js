"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const configPostgresql_1 = require("./configPostgresql");
const USER = encodeURIComponent(configPostgresql_1.Envconfig.dbUser);
const PASSWORD = encodeURIComponent(configPostgresql_1.Envconfig.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${configPostgresql_1.Envconfig.dbHost}:${configPostgresql_1.Envconfig.dbPort}/${configPostgresql_1.Envconfig.dbName}`;
exports.pool = new pg_1.Pool({ connectionString: URI });
