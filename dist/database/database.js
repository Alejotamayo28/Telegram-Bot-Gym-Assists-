"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const postgresql_1 = require("./postgresql");
const USER = encodeURIComponent(postgresql_1.Envconfig.dbUser);
const PASSWORD = encodeURIComponent(postgresql_1.Envconfig.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${postgresql_1.Envconfig.dbHost}:${postgresql_1.Envconfig.dbPort}/${postgresql_1.Envconfig.dbName}`;
exports.pool = new pg_1.Pool({ connectionString: URI });
