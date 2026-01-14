# CSN Network - Testing Credentials

## Test Accounts

✅ Account 1:

Email: test@gmail.com
Password: 123test
Name: John Doe


✅ Account 2:

Email: jane@example.com
Password: password123
Name: Jane Smith

---

## Quick Connection Testing

1. **Login as Test User:**
   - Email: `test@gmail.com`
   - Password: `123test`

2. **Visit Jane's Profile:**
   ```
   http://localhost:5173/profile/af3cc20f-0a5f-4284-b7f0-e0b669ae962b
   ```

3. **Click "Connect" button**

4. **Open incognito/another browser and login as Jane:**
   - Email: `jane@example.com`
   - Password: `test123`

5. **Go to Connections page:**
   ```
   http://localhost:5173/dashboard/home/connections
   ```

6. **Click "Pending" tab and Accept the request**

7. **Both users check "Connections" tab - should see each other! ✅**

---

## Development URLs

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:3001`
- **Health Check:** `http://localhost:3001/health`

---

## Database Access

```bash
# Open database
cd server
sqlite3 prisma/dev.db

# View users
SELECT id, firstName, lastName, email FROM User;

# View connections
SELECT * FROM Connection;

# Exit
.quit
```

---

⚠️ **Note:** These are test credentials for development only. Never use these in production!
