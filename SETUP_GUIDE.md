# Project Form Setup Guide

## Overview
Your form system now has **two submission methods**:
1. **Formspree** - Sends email notifications to your inbox
2. **Firebase** - Stores submissions in a database + admin dashboard

---

## Part 1: Formspree Setup (Email Notifications)

### Step 1: Sign up for Formspree
1. Go to [https://formspree.io](https://formspree.io)
2. Click "Sign Up" and create an account
3. Verify your email

### Step 2: Create a new form
1. Click "New Form" in the dashboard
2. Set the form name to: `Project Requests`
3. Set the email to: `amar2006cric@gmail.com`
4. Click "Create"

### Step 3: Get your form ID
1. After creating the form, you'll see a form ID (looks like: `f_abc123xyz`)
2. Copy this ID

### Step 4: Update script.js
1. Open `script.js`
2. Find this line: `await fetch('https://formspree.io/f/xyzabc123', {`
3. Replace `xyzabc123` with your actual Formspree form ID
4. Save the file

**Example:**
```javascript
await fetch('https://formspree.io/f/mzyykvod', {
```

---

## Part 2: Firebase Setup (Database + Admin Dashboard)

### Step 1: Create a Firebase Project
1. Go to [https://firebase.google.com](https://firebase.google.com)
2. Click "Get Started" or "Go to Console"
3. Click "Add project"
4. Enter project name: `dna-studio` (or your preference)
5. Choose your region
6. Click "Create project"

### Step 2: Enable Firestore Database
1. In the left sidebar, click **"Build"** → **"Firestore Database"**
2. Click **"Create Database"**
3. Select **"Start in production mode"**
4. Choose your region
5. Click "Enable"

### Step 3: Create a Collection
1. In Firestore, click **"+ Start collection"**
2. Collection ID: `projects`
3. Add a blank document (auto ID)
4. Click "Save"

### Step 4: Enable Authentication
1. In the left sidebar, click **"Build"** → **"Authentication"**
2. Click **"Get Started"**
3. Click **"Email/Password"**
4. Toggle **"Enable"** and click "Save"

### Step 5: Create an Admin User
1. Click the **"Users"** tab
2. Click **"Add user"**
3. Enter email: `amar2006cric@gmail.com` (your admin email)
4. Enter password: (create a strong password)
5. Click "Add user"

### Step 6: Get Your Firebase Config
1. Go to **Project Settings** (⚙️ icon at top left)
2. Scroll down to "Your apps" section
3. Click the web icon `</>` (or add a web app if not exists)
4. Copy the Firebase config code
5. You'll see something like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxx",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefg"
};
```

### Step 7: Update HTML Files
You need to replace the Firebase config in THREE files:

**File 1: index.html**
1. Find this section near the end:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```
2. Replace with your actual Firebase config

**File 2: admin.html**
Do the same as File 1

**File 3: login.html**
Do the same as File 1

### Step 8: Set Firestore Security Rules
1. In Firestore, click the **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /projects/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

---

## Testing the Setup

### Test Form Submission
1. Open your website (http://localhost:5000)
2. Click "Start a project"
3. Fill in the form
4. Click "Submit Project Request"
5. You should see a success message

### Check Formspree Email
- Go to your email inbox (amar2006cric@gmail.com)
- You should receive an email from Formspree with the submission details

### Check Firebase Admin Dashboard
1. Open: `http://localhost:5000/login.html`
2. Log in with:
   - Email: `amar2006cric@gmail.com`
   - Password: (the password you created)
3. You should see the admin dashboard with the submission displayed

---

## Accessing the Admin Dashboard

- **Login Page:** `http://localhost:5000/login.html`
- **Dashboard:** `http://localhost:5000/admin.html` (auto-redirects if logged in)

---

## Troubleshooting

### "Firebase config is not valid"
- Make sure you copied the entire Firebase config correctly
- Check that all fields are filled in (apiKey, projectId, etc.)

### "Form submission failed"
- Check your Formspree form ID is correct
- Make sure the form is verified in Formspree

### "Cannot login to admin dashboard"
- Make sure you created the admin user in Firebase Authentication
- Double-check the email and password
- Clear browser cache and try again

### "No submissions appearing in admin"
- Make sure Firestore has the "projects" collection created
- Check that you have the correct Firestore rules set
- Check browser console (F12) for any errors

---

## Security Notes

🔒 **Important:**
- Never share your Firebase API key publicly (it's client-side, so it's okay to be in the frontend code)
- Keep your admin password secure
- Review submissions regularly
- Use strong passwords for admin accounts

---

## Next Steps

After setup is complete:
1. ✅ Test the form on your live website
2. ✅ Monitor submissions in the admin dashboard
3. ✅ Respond to clients within 24 hours
4. ✅ Keep the admin password secure

---

## Need Help?

If you encounter issues:
1. Check the browser console (F12) for error messages
2. Review the Firebase documentation: https://firebase.google.com/docs
3. Check Formspree support: https://formspree.io/help

