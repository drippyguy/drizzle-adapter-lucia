import type { Adapter, DatabaseSession, DatabaseUser } from "lucia";
import type { SQLiteColumn, BaseSQLiteDatabase, SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
export declare class DrizzleSQLiteAdapter implements Adapter {
    private db;
    private sessionTable;
    private userTable;
    constructor(db: BaseSQLiteDatabase<any, any, any>, sessionTable: SQLiteSessionTable, userTable: SQLiteUserTable);
    deleteSession(sessionId: string): Promise<void>;
    deleteUserSessions(userId: string): Promise<void>;
    getSessionAndUser(sessionId: string): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]>;
    getUserSessions(userId: string): Promise<DatabaseSession[]>;
    setSession(session: DatabaseSession): Promise<void>;
    updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void>;
    deleteExpiredSessions(): Promise<void>;
}
export type SQLiteUserTable = SQLiteTableWithColumns<{
    dialect: "sqlite";
    columns: {
        id: SQLiteColumn<{
            name: any;
            tableName: any;
            dataType: any;
            columnType: any;
            data: string;
            driverParam: any;
            notNull: true;
            hasDefault: boolean;
            enumValues: any;
            baseColumn: any;
        }, object>;
    };
    schema: any;
    name: any;
}>;
export type SQLiteSessionTable = SQLiteTableWithColumns<{
    dialect: any;
    columns: {
        id: SQLiteColumn<{
            dataType: any;
            notNull: true;
            enumValues: any;
            tableName: any;
            columnType: any;
            data: string;
            driverParam: any;
            hasDefault: false;
            name: any;
        }, object>;
        expiresAt: SQLiteColumn<{
            dataType: "number";
            notNull: true;
            enumValues: any;
            tableName: any;
            columnType: any;
            data: number;
            driverParam: any;
            hasDefault: false;
            name: any;
        }, object>;
        userId: SQLiteColumn<{
            dataType: "string";
            notNull: true;
            enumValues: any;
            tableName: any;
            columnType: any;
            data: string;
            driverParam: any;
            hasDefault: false;
            name: any;
        }, object>;
    };
    schema: any;
    name: any;
}>;
