# 🔍 How to Diagnose "Failed to fetch" Error

## ⚠️ IMPORTANT: Follow These Steps in Order

### Step 1: Verify Server is Running ✅
```bash
# In your terminal, run:
node scripts/check-server.js
```

**Expected Output:**
```
✅ Health Endpoint: Working (Status: 200)
✅ Products API: Working (Status: 200)
📊 Summary: ✅ Server is running and API routes are working!
```

**If this fails:** Your dev server is not running. Start it with `npm run dev`

---

### Step 2: Test Raw Fetch (Bypass All Hooks) 🧪

1. **Navigate to:** `http://localhost:3000/test-raw-fetch`
2. **Open Browser Console** (F12 → Console tab)
3. **Look for:**
   - `🧪 Starting raw fetch test...`
   - `🧪 Fetch available: true`
   - `🧪 Attempting to fetch /api/health...`
   - Either `✅ SUCCESS!` or `❌ ERROR:`

**What This Tells You:**
- ✅ If SUCCESS: Fetch works, the issue is in the hook
- ❌ If ERROR: Fetch doesn't work at all (browser/environment issue)

---

### Step 3: Check Browser Console on Products Page 📊

1. **Navigate to:** `http://localhost:3000/admin/products`
2. **Open Browser Console** (F12 → Console tab)
3. **Look for these messages in order:**

```
⏳ Waiting for page to finish loading... (if page is loading)
🔍 Testing server connectivity with health endpoint...
✅ Server is reachable: {...} (if successful)
🔄 Loading data from: /api/admin/products
🔄 Full URL: http://localhost:3000/api/admin/products
🔄 Attempting fetch: {...}
🔄 Calling fetch with options: {...}
```

**If you see errors, they will look like:**
```
❌ Server health check failed: {...}
❌ Synchronous fetch error: {...}
❌ Fetch error details: {...}
```

**Copy ALL console messages** and check:
- What's the last successful message?
- What's the first error message?
- Is there a stack trace?

---

### Step 4: Check Network Tab 🌐

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Reload the page** (Ctrl+R or F5)
4. **Look for these requests:**
   - `/api/health` - Should be status 200
   - `/api/admin/products` - Check this one!

**For `/api/admin/products` request:**
- **Status:** What number? (200 = success, anything else = error)
- **Type:** Should be "fetch" or "xhr"
- **Size:** Should show response size if successful
- **Time:** How long did it take?
- **Click on it** to see:
  - **Headers tab:** Check Request URL, Request Method
  - **Response tab:** What does it show?
  - **Preview tab:** If successful, shows JSON

**If the request shows:**
- **Red status (failed):** Click it and check the error message
- **Pending forever:** Request is hanging
- **CORS error:** Shouldn't happen for same-origin, but check
- **Blocked:** Check if browser extension is blocking it

---

### Step 5: Try Manual Fetch in Console 💻

1. **Open Browser Console** (F12)
2. **Run this command:**
```javascript
fetch('/api/health')
  .then(r => r.json())
  .then(data => console.log('✅ Success:', data))
  .catch(err => console.error('❌ Error:', err))
```

**Expected Result:**
```
✅ Success: {status: "ok", timestamp: "...", message: "API is working correctly"}
```

**If you get an error:**
- Copy the exact error message
- Check if it's the same "Failed to fetch" error
- Note the error type (TypeError, NetworkError, etc.)

---

### Step 6: Check Diagnostic Widgets 👀

On `/admin/products` page, you should see:

1. **FetchTest widget (top-left):**
   - Shows: Basic Fetch, Health API, Products API status
   - Green ✅ = Working
   - Red ❌ = Failed (with error details)

2. **ApiConnectionTest widget (bottom-right):**
   - Shows: Health Endpoint, Products API status
   - Green ✅ = Working
   - Red ❌ = Failed

**What to note:**
- Which tests pass?
- Which tests fail?
- What error messages do they show?

---

## 🎯 Common Issues & Solutions

### Issue 1: Server Not Running
**Symptoms:**
- `check-server.js` fails
- Network tab shows "Failed to load resource"
- Console shows "ECONNREFUSED"

**Solution:**
```bash
npm run dev
```

---

### Issue 2: Wrong Port
**Symptoms:**
- Server is running on different port (e.g., 3001)
- Requests going to wrong port

**Solution:**
- Check terminal for actual port
- Update URL in browser
- Or set PORT in `.env.local`

---

### Issue 3: Browser Extension Blocking
**Symptoms:**
- Network tab shows request as "blocked"
- Ad blocker or privacy extension active

**Solution:**
- Disable extensions temporarily
- Try incognito/private mode
- Add localhost to extension whitelist

---

### Issue 4: CORS Error (Unlikely for Same-Origin)
**Symptoms:**
- Console shows "CORS policy" error
- Network tab shows CORS error

**Solution:**
- Shouldn't happen for same-origin requests
- Check if URL is actually same-origin
- Verify middleware isn't interfering

---

### Issue 5: Fetch Called During SSR
**Symptoms:**
- Error happens immediately on page load
- Console shows server-side error

**Solution:**
- Verify component has `'use client'` directive
- Check if hook is being called in server component
- Ensure fetch only happens in browser

---

## 📋 Information to Collect

When reporting the issue, please provide:

1. **Console Output:**
   - Copy all messages from console (especially ones with 🧪, 🔄, ❌)
   - Include the full error stack trace

2. **Network Tab:**
   - Screenshot of the failed request
   - Status code
   - Error message
   - Request/Response headers

3. **Test Results:**
   - What does `/test-raw-fetch` show?
   - What do the diagnostic widgets show?
   - Does manual fetch in console work?

4. **Environment:**
   - Browser name and version
   - Operating system
   - Node.js version (`node --version`)
   - Next.js version (should be 15.5.5)

5. **Server Status:**
   - Output of `node scripts/check-server.js`
   - Any errors in server terminal

---

## 🚀 Quick Test Checklist

- [ ] Server is running (`npm run dev`)
- [ ] `check-server.js` passes
- [ ] `/test-raw-fetch` page loads
- [ ] Browser console shows test results
- [ ] Network tab shows API requests
- [ ] Manual fetch in console works
- [ ] Diagnostic widgets show status
- [ ] No browser extensions blocking
- [ ] Hard refresh (Ctrl+Shift+R) tried

---

## 💡 Next Steps

Once you've collected the information above:

1. **If `/test-raw-fetch` works:** The issue is in the hook - we can fix that
2. **If `/test-raw-fetch` fails:** The issue is browser/environment - we need to investigate that
3. **If manual fetch works:** The issue is timing - fetch is being called too early
4. **If nothing works:** There's a fundamental network/browser issue

**The diagnostic code we've added will show exactly what's happening. Please check the console and network tab and share what you see!**

