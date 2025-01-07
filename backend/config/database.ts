import { Sequelize } from 'sequelize';
import { createClient, Client } from '@libsql/client';
import { Database } from 'sqlite3';
import dotenv from 'dotenv';

dotenv.config();

// Create interfaces for our custom types
interface TursoOptions {
  url?: string;
  authToken?: string;
}

class TursoDatabase extends Database {
  private client: Client;

  constructor() {
    super(':memory:');
    this.client = createClient({
      url: process.env.TURSO_URL || '',
      authToken: process.env.TURSO_TOKEN || ''
    });
  }

  async run(sql: string, params: any[] = []): Promise<any> {
    return this.client.execute({ sql, args: params });
  }

  async get(sql: string, params: any[] = []): Promise<any> {
    const result = await this.client.execute({ sql, args: params });
    return result.rows[0];
  }

  async all(sql: string, params: any[] = []): Promise<any[]> {
    const result = await this.client.execute({ sql, args: params });
    return result.rows;
  }

  async each(sql: string, params: any[] = [], callback: (err: Error | null, row: any) => void): Promise<void> {
    try {
      const result = await this.client.execute({ sql, args: params });
      result.rows.forEach(row => callback(null, row));
    } catch (err) {
      callback(err as Error, null);
    }
  }
}

interface QueryGeneratorOptions {
  client: Client;
}

class TursoQueryGenerator {
  private options: QueryGeneratorOptions;

  constructor(options: QueryGeneratorOptions) {
    this.options = options;
  }

  async execute(sql: string, bindings?: any[]): Promise<any> {
    return this.options.client.execute({
      sql,
      args: bindings || []
    });
  }
}

// Create the database instance
const db = new TursoDatabase();

// Initialize Sequelize with our custom setup
const sequelize = new Sequelize({
  dialect: 'sqlite',
  dialectModule: {
    Database: TursoDatabase,
    verbose: () => db
  },
  dialectOptions: {
    queryGenerator: new TursoQueryGenerator({
      client: db.client
    })
  },
  storage: ':memory:',
  logging: (msg: string) => console.log(`Sequelize: ${msg}`),
});

export default sequelize;
