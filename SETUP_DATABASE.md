# PostgreSQL Setup Guide

## Issue: Connection Refused (ECONNREFUSED)

This error means PostgreSQL is not running or not installed.

## Solution Options

### Option 1: Install PostgreSQL (Recommended for Production)

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Download the Windows installer
   - Run the installer and follow the setup wizard
   - **Remember the password you set for the `postgres` user**

2. **Update `server/.env` with your password:**
   ```
   DB_PASSWORD=your_actual_password_here
   ```

3. **Create the database:**
   - Open pgAdmin (installed with PostgreSQL)
   - Or use psql command line:
   ```sql
   CREATE DATABASE resort_booking;
   ```

4. **Start PostgreSQL service:**
   ```powershell
   # Check if service exists
   Get-Service -Name "*postgresql*"
   
   # Start the service (replace with actual service name)
   Start-Service postgresql-x64-XX  # Replace XX with version number
   ```

### Option 2: Use Docker (Quickest Setup)

1. **Install Docker Desktop:**
   - Download from: https://www.docker.com/products/docker-desktop
   - Install and start Docker Desktop

2. **Run PostgreSQL in Docker:**
   ```powershell
   docker run --name postgres-resort -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=resort_booking -p 5432:5432 -d postgres
   ```

3. **Verify it's running:**
   ```powershell
   docker ps
   ```

4. **Your `.env` file is already configured correctly for Docker setup!**

### Option 3: Use SQLite (Simplest, No Installation)

If you want to avoid PostgreSQL setup, we can modify the code to use SQLite instead. Let me know if you prefer this option.

## After Setup

Once PostgreSQL is running:

1. **Verify connection:**
   ```powershell
   cd server
   npm run migrate
   ```

2. **If successful, you'll see:**
   ```
   ✅ Bookings table created successfully
   ✅ Migration completed successfully
   ```

## Troubleshooting

### Check if PostgreSQL is running:
```powershell
# Check for PostgreSQL processes
Get-Process -Name "*postgres*" -ErrorAction SilentlyContinue

# Check if port 5432 is in use
netstat -an | findstr 5432
```

### Common Issues:

1. **Wrong password:** Update `DB_PASSWORD` in `server/.env`
2. **Wrong port:** Check if PostgreSQL is on a different port
3. **Service not started:** Start the PostgreSQL service
4. **Firewall blocking:** Check Windows Firewall settings



