import pkg from 'pg';
const { Pool } = pkg;
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// Function to hash a password with salt
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

// Connect to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function createAdminUser(username, email, password, fullName) {
  try {
    console.log(`Creating admin user: ${username}`);
    
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    
    if (existingUser.rows.length > 0) {
      console.log('User already exists');
      return {
        success: false,
        message: 'User already exists'
      };
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Insert the admin user
    const result = await pool.query(
      `INSERT INTO users 
       (username, email, password, full_name, role, created_at, profile_image, phone) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, username, email, full_name as "fullName", role`,
      [
        username,
        email,
        hashedPassword,
        fullName,
        'admin',  // Set the role to admin (lowercase as per UserRole definition)
        new Date(),
        null,
        null
      ]
    );
    
    console.log('Admin user created successfully:', result.rows[0]);
    return {
      success: true,
      user: result.rows[0]
    };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return {
      success: false,
      message: error.message
    };
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Create admin user
// Usage: node create-admin.js <username> <email> <password> <fullName>
async function main() {
  try {
    const args = process.argv.slice(2);
    if (args.length < 4) {
      console.log('Usage: node create-admin.js <username> <email> <password> <fullName>');
      process.exit(1);
    }
    
    const [username, email, password, ...fullNameParts] = args;
    const fullName = fullNameParts.join(' ');
    
    const result = await createAdminUser(username, email, password, fullName);
    
    if (result.success) {
      console.log('Admin user created successfully:', result.user);
    } else {
      console.error('Failed to create admin user:', result.message);
    }
  } catch (error) {
    console.error('Unhandled error:', error);
  }
}

// Run the main function
main();