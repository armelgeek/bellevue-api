import process from 'node:process'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import 'dotenv/config'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const migrationClient = postgres(databaseUrl, { max: 1 })

async function main() {
  try {
    const db = drizzle(migrationClient)

    console.log('⏳ Running migrations...')

    await migrate(db, {
      migrationsFolder: './drizzle'
    })

    console.log('✅ Migrations completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed!')
    console.error(error)
    process.exit(1)
  }
}

main()
