# PostgreSQL Installation Guide for Windows

## Step-by-Step Installation

### 1. Download PostgreSQL

Visit the official PostgreSQL download page:
**https://www.postgresql.org/download/windows/**

Or use the direct installer link:
**https://www.enterprisedb.com/downloads/postgres-postgresql-downloads**

### 2. Run the Installer

1. Download the Windows installer (usually `postgresql-XX-windows-x64.exe`)
2. Run the installer as Administrator
3. Follow the installation wizard:
   - **Installation Directory**: Keep default (usually `C:\Program Files\PostgreSQL\XX`)
   - **Select Components**: Keep all checked (PostgreSQL Server, pgAdmin 4, Stack Builder, Command Line Tools)
   - **Data Directory**: Keep default
   - **Password**: **IMPORTANT** - Set a password for the `postgres` superuser. **Remember this password!**
   - **Port**: Keep default `5432`
   - **Advanced Options**: Keep default locale
   - **Pre Installation Summary**: Review and click Next
   - **Ready to Install**: Click Next
   - Wait for installation to complete

### 3. Verify Installation

Open PowerShell and check if PostgreSQL is installed:

```powershell
# Check if PostgreSQL service exists
Get-Service | Where-Object {$_.Name -like "*postgres*"}

# Check if psql command is available
Get-Command psql -ErrorAction SilentlyContinue
```

### 4. Start PostgreSQL Service

The service should start automatically, but if not:

```powershell
# Find the service name (usually postgresql-x64-XX)
Get-Service | Where-Object {$_.DisplayName -like "*PostgreSQL*"}

# Start the service (replace with your service name)
Start-Service postgresql-x64-16  # Example for version 16
```

Or use Services GUI:
1. Press `Win + R`, type `services.msc`
2. Find "postgresql-x64-XX" service
3. Right-click → Start (if not running)

### 5. Create the Database

**Option A: Using pgAdmin (GUI)**
1. Open pgAdmin 4 (installed with PostgreSQL)
2. Connect to server (password you set during installation)
3. Right-click "Databases" → Create → Database
4. Name: `resort_booking`
5. Click Save

**Option B: Using Command Line (psql)**
```powershell
# Connect to PostgreSQL
psql -U postgres

# Enter your password when prompted
# Then run:
CREATE DATABASE resort_booking;

# Exit psql
\q
```

**Option C: Using PowerShell (one-liner)**
```powershell
$env:PGPASSWORD='your_password_here'; psql -U postgres -c "CREATE DATABASE resort_booking;"
```

### 6. Update Environment Variables

Edit `server/.env` file with your PostgreSQL credentials:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resort_booking
DB_USER=postgres
DB_PASSWORD=your_actual_password_here
NODE_ENV=development
```

**Replace `your_actual_password_here` with the password you set during installation!**

### 7. Test the Connection

```powershell
cd C:\MachineTestMantra\server
npm run migrate
```

If successful, you should see:
```
✅ Bookings table created successfully
✅ Migration completed successfully
```

## Troubleshooting

### Issue: "psql: command not found"

**Solution**: Add PostgreSQL bin directory to PATH
1. Find PostgreSQL installation (usually `C:\Program Files\PostgreSQL\XX\bin`)
2. Add to System PATH:
   - Win + X → System → Advanced system settings
   - Environment Variables → System Variables → Path → Edit
   - Add: `C:\Program Files\PostgreSQL\XX\bin`
   - Restart PowerShell

### Issue: "Service won't start"

**Solution**: Check Windows Event Viewer
1. Win + X → Event Viewer
2. Windows Logs → Application
3. Look for PostgreSQL errors
4. Common fix: Run installer as Administrator and repair installation

### Issue: "Password authentication failed"

**Solution**: Reset postgres password
```powershell
# Stop PostgreSQL service
Stop-Service postgresql-x64-XX

# Edit pg_hba.conf (usually in C:\Program Files\PostgreSQL\XX\data)
# Change "md5" to "trust" temporarily
# Start service, connect, change password, then change back to "md5"
```

### Issue: "Port 5432 already in use"

**Solution**: Check what's using the port
```powershell
netstat -ano | findstr :5432
# Find PID, then check in Task Manager
```

## Quick Verification Commands

```powershell
# Check if PostgreSQL is running
Get-Service | Where-Object {$_.Name -like "*postgres*"}

# Test connection
psql -U postgres -d resort_booking -c "SELECT version();"

# List databases
psql -U postgres -c "\l"
```

## Need Help?

If you encounter issues:
1. Check PostgreSQL logs: `C:\Program Files\PostgreSQL\XX\data\log\`
2. Verify service is running
3. Check firewall settings
4. Ensure password in `.env` matches installation password



