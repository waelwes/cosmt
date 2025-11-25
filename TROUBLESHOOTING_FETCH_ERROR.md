# Troubleshooting "Failed to fetch" Error

## Quick Fix Checklist

### 1. **Verify Dev Server is Running**
```bash
npm run dev
```
- The server should start on `http://localhost:3000` (or your configured port)
- You should see "Ready" in the terminal
- Check the terminal for any error messages

### 2. **Test API Health Endpoint**
Open in your browser:
```
http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "...",
  "message": "API is working correctly"
}
```

If this fails, your dev server is not running or there's a configuration issue.

### 3. **Test Products API Endpoint**
Open in your browser:
```
http://localhost:3000/api/admin/products
```

You should see either:
- A JSON response with products
- An error message explaining what's wrong

### 4. **Check Browser Console**
When the error occurs, the console will now show:
- ✅ Server health check status
- ❌ Detailed error diagnostics
- ❌ Full URL being fetched
- ❌ Connection test results

### 5. **Check Server Console**
Look at your terminal where `npm run dev` is running:
- Look for API route logs (they start with 🔍)
- Check for any error messages
- Verify environment variables are loaded

## Common Causes & Solutions

### Cause 1: Dev Server Not Running
**Solution:** Start the server with `npm run dev`

### Cause 2: Wrong Port
**Solution:** 
- Check what port your server is running on
- Update the URL if it's not 3000
- Check `package.json` for port configuration

### Cause 3: API Route Error
**Solution:**
- Check server console for error messages
- Verify environment variables (Supabase credentials)
- Check if the API route file exists at `app/api/admin/products/route.ts`

### Cause 4: Network/CORS Issue
**Solution:**
- Open browser DevTools → Network tab
- Look for the failed request
- Check the error details
- Verify it's a same-origin request (shouldn't have CORS issues)

### Cause 5: Component Mounting Issue
**Solution:**
- The code now includes a health check before fetching
- If you see "Server health check failed", the server isn't running

## Enhanced Error Messages

The updated code now provides:
1. **Automatic health check** - Tests server connectivity before fetching
2. **Detailed diagnostics** - Shows browser environment, origin, and URL
3. **Connection testing** - Automatically tests the API endpoint
4. **Actionable error messages** - Tells you exactly what to check

## Debugging Steps

1. **Open Browser Console** (F12)
2. **Look for these messages:**
   - `✅ Server is reachable` - Good!
   - `❌ Server health check failed` - Server not running
   - `❌ Network Error Diagnostics` - Check the details
   - `❌ API Connection Test Result` - See what failed

3. **Check Network Tab:**
   - Find the failed request
   - Check the status code
   - Look at the request/response details

4. **Check Server Terminal:**
   - Look for API route logs
   - Check for error messages
   - Verify environment variables

## Still Having Issues?

If the error persists after checking all the above:

1. **Restart the dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear browser cache completely

3. **Check Next.js version:**
   ```bash
   npm list next
   ```
   Should be 15.5.5

4. **Verify environment variables:**
   - Check `.env.local` file exists
   - Verify `NEXT_PUBLIC_SUPABASE_URL` is set
   - Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set

5. **Test with a simple fetch:**
   Open browser console and run:
   ```javascript
   fetch('/api/health')
     .then(r => r.json())
     .then(console.log)
     .catch(console.error)
   ```

## What Was Fixed

1. ✅ Added server health check before fetching
2. ✅ Enhanced error diagnostics and logging
3. ✅ Improved error messages with actionable steps
4. ✅ Added automatic connection testing
5. ✅ Fixed Next.js 15 fetch configuration
6. ✅ Added proper browser environment checks
7. ✅ Improved URL formatting and validation

The error handling is now much more robust and will help you identify the exact issue!

