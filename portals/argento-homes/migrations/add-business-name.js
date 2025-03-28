import { db } from '../server/db.js';
import { vendors } from '../shared/schema.js';
import { sql } from 'drizzle-orm';

async function addBusinessNameColumn() {
  try {
    console.log('Adding businessName column to vendors table...');
    await db.execute(sql`
      ALTER TABLE vendors 
      ADD COLUMN IF NOT EXISTS business_name TEXT
    `);
    console.log('Column added successfully');
  } catch (error) {
    console.error('Error adding column:', error);
    throw error;
  }
}

// Execute the migration
addBusinessNameColumn()
  .then(() => {
    console.log('Migration complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });