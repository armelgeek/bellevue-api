import process from 'node:process'
import postgres from 'postgres'
import 'dotenv/config'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const client = postgres(databaseUrl, { max: 1 })

async function main() {
  try {
    console.log('⏳ Dropping all tables...')

    await client`DROP SCHEMA IF EXISTS drizzle CASCADE`

    await client`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `

    console.log('✅ All tables dropped successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Reset failed!')
    console.error(error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
