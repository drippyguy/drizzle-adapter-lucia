"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var postgresql_exports = {};
__export(postgresql_exports, {
  DrizzlePostgreSQLAdapter: () => DrizzlePostgreSQLAdapter
});
module.exports = __toCommonJS(postgresql_exports);
var import_drizzle_orm = require("drizzle-orm");
class DrizzlePostgreSQLAdapter {
  db;
  sessionTable;
  userTable;
  constructor(db, sessionTable, userTable) {
    this.db = db;
    this.sessionTable = sessionTable;
    this.userTable = userTable;
  }
  async deleteSession(sessionId) {
    await this.db.delete(this.sessionTable).where((0, import_drizzle_orm.eq)(this.sessionTable.id, sessionId));
  }
  async deleteUserSessions(userId) {
    await this.db.delete(this.sessionTable).where((0, import_drizzle_orm.eq)(this.sessionTable.userId, userId));
  }
  async getSessionAndUser(sessionId) {
    const result = await this.db.select({
      user: this.userTable,
      session: this.sessionTable
    }).from(this.sessionTable).innerJoin(this.userTable, (0, import_drizzle_orm.eq)(this.sessionTable.userId, this.userTable.id)).where((0, import_drizzle_orm.eq)(this.sessionTable.id, sessionId));
    if (result.length !== 1)
      return [null, null];
    return [
      transformIntoDatabaseSession(result[0].session),
      transformIntoDatabaseUser(result[0].user)
    ];
  }
  async getUserSessions(userId) {
    const result = await this.db.select().from(this.sessionTable).where((0, import_drizzle_orm.eq)(this.sessionTable.userId, userId));
    return result.map((val) => {
      return transformIntoDatabaseSession(val);
    });
  }
  async setSession(session) {
    await this.db.insert(this.sessionTable).values({
      id: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt,
      ...session.attributes
    });
  }
  async updateSessionExpiration(sessionId, expiresAt) {
    await this.db.update(this.sessionTable).set({
      expiresAt
    }).where((0, import_drizzle_orm.eq)(this.sessionTable.id, sessionId));
  }
  async deleteExpiredSessions() {
    await this.db.delete(this.sessionTable).where((0, import_drizzle_orm.lte)(this.sessionTable.expiresAt, /* @__PURE__ */ new Date()));
  }
}
function transformIntoDatabaseSession(raw) {
  const { id, userId, expiresAt, ...attributes } = raw;
  return {
    userId,
    id,
    expiresAt,
    attributes
  };
}
function transformIntoDatabaseUser(raw) {
  const { id, ...attributes } = raw;
  return {
    id,
    attributes
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DrizzlePostgreSQLAdapter
});
//# sourceMappingURL=postgresql.cjs.map