import { eq, lte } from "drizzle-orm";
class DrizzleSQLiteAdapter {
  db;
  sessionTable;
  userTable;
  constructor(db, sessionTable, userTable) {
    this.db = db;
    this.sessionTable = sessionTable;
    this.userTable = userTable;
  }
  async deleteSession(sessionId) {
    await this.db.delete(this.sessionTable).where(eq(this.sessionTable.id, sessionId));
  }
  async deleteUserSessions(userId) {
    await this.db.delete(this.sessionTable).where(eq(this.sessionTable.userId, userId));
  }
  async getSessionAndUser(sessionId) {
    const result = await this.db.select({
      user: this.userTable,
      session: this.sessionTable
    }).from(this.sessionTable).innerJoin(this.userTable, eq(this.sessionTable.userId, this.userTable.id)).where(eq(this.sessionTable.id, sessionId)).get();
    if (!result)
      return [null, null];
    return [
      transformIntoDatabaseSession(result.session),
      transformIntoDatabaseUser(result.user)
    ];
  }
  async getUserSessions(userId) {
    const result = await this.db.select().from(this.sessionTable).where(eq(this.sessionTable.userId, userId)).all();
    return result.map((val) => {
      return transformIntoDatabaseSession(val);
    });
  }
  async setSession(session) {
    await this.db.insert(this.sessionTable).values({
      id: session.id,
      userId: session.userId,
      expiresAt: Math.floor(session.expiresAt.getTime() / 1e3),
      ...session.attributes
    }).run();
  }
  async updateSessionExpiration(sessionId, expiresAt) {
    await this.db.update(this.sessionTable).set({
      expiresAt: Math.floor(expiresAt.getTime() / 1e3)
    }).where(eq(this.sessionTable.id, sessionId)).run();
  }
  async deleteExpiredSessions() {
    await this.db.delete(this.sessionTable).where(lte(this.sessionTable.expiresAt, Math.floor(Date.now() / 1e3)));
  }
}
function transformIntoDatabaseSession(raw) {
  const { id, userId, expiresAt: expiresAtUnix, ...attributes } = raw;
  return {
    userId,
    id,
    expiresAt: new Date(expiresAtUnix * 1e3),
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
export {
  DrizzleSQLiteAdapter
};
//# sourceMappingURL=sqlite.js.map