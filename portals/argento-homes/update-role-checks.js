const fs = require('fs');

// Read the file
const filePath = 'server/routes.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace admin role checks
content = content.replace(/\/\/ Check if user is admin\s+if \(req\.user\?\.role !== UserRole\.ADMIN && req\.user\?\.role !== UserRole\.DEVELOPER\) \{\s+return res\.status\(403\)\.json\(\{ message: "Access denied\. Admin role required\." \}\);\s+\}/g, 
  `// Check if user is admin
      if (!hasAdminRole(req.user?.role)) {
        return res.status(403).json({ message: "Access denied. Admin role required." });
      }`);

// Replace vendor role checks
content = content.replace(/if \(req\.user\?\.role !== UserRole\.VENDOR\) \{\s+return res\.status\(403\)\.json\(\{ message: "Access denied\. Vendor role required\." \}\);\s+\}/g,
  `if (!hasVendorRole(req.user?.role)) {
        return res.status(403).json({ message: "Access denied. Vendor role required." });
      }`);

// Add type annotations for collections
content = content.replace(/let allProperties = \[\];/g, 'let allProperties: any[] = [];');
content = content.replace(/let allBookings = \[\];/g, 'let allBookings: any[] = [];');

// Write back to the file
fs.writeFileSync(filePath, content);
console.log('Role checks updated successfully');
