// Simple script to approve a property directly in the database
// Usage: node approve-property.js <property_id>

import pg from 'pg';
const { Pool } = pg;

async function approveProperty(propertyId) {
  if (!propertyId) {
    console.error('Please provide a property ID as an argument');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log(`Approving property with ID ${propertyId}...`);
    
    // Update the property approval status
    const result = await pool.query(
      'UPDATE "properties" SET "approvalStatus" = $1 WHERE "id" = $2 RETURNING *',
      ['APPROVED', propertyId]
    );
    
    if (result.rowCount === 0) {
      console.error(`No property found with ID ${propertyId}`);
      process.exit(1);
    }
    
    console.log(`Property approved successfully:`);
    console.log(JSON.stringify(result.rows[0], null, 2));
    
  } catch (error) {
    console.error('Error approving property:', error);
  } finally {
    await pool.end();
  }
}

// Get property ID from command line arguments
const propertyId = process.argv[2];
approveProperty(propertyId);