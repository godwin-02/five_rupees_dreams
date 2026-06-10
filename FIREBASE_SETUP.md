# Firebase Firestore Setup — Five Rupees Dreams Reviews

Follow these steps to make reviews visible to ALL visitors globally.

---

## Step 1 — Create a Firebase Project

1. Go to https://console.firebase.google.com
2. Click **Add project** → name it `five-rupees-dreams`
3. Disable Google Analytics (not needed) → **Create project**

---

## Step 2 — Enable Firestore

1. In the left sidebar → **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** → select your region → **Done**

---

## Step 3 — Set Firestore Rules (allow public read/write for reviews)

In Firestore → **Rules** tab, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /five-rupees-reviews/{docId} {
      allow read: if true;
      allow create: if request.resource.data.text is string
                    && request.resource.data.text.size() > 2
                    && request.resource.data.name is string
                    && request.resource.data.name.size() > 1;
      allow delete, update: if true;
    }
  }
}
```

Click **Publish**.

---

## Step 4 — Get Your Firebase Config

1. In Firebase console → ⚙️ Project settings → **General** tab
2. Scroll to **Your apps** → click **Add app** → Web (`</>`)
3. Register app name: `five-rupees-website` → **Register app**
4. Copy the `firebaseConfig` object shown

---

## Step 5 — Add Config to script.js

Open `script.js` and replace the `FIREBASE_CONFIG` block near the top:

```javascript
const FIREBASE_CONFIG = {
  apiKey:            "YOUR_ACTUAL_API_KEY",
  authDomain:        "your-project.firebaseapp.com",
  projectId:         "your-project-id",
  storageBucket:     "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

Replace each `REPLACE_WITH_...` value with the real values from Step 4.

---

## Step 6 — Test

1. Open the website on **Device A** → submit a review
2. Open the website on **Device B** (different browser/phone) → the review appears instantly
3. Real-time sync via `onSnapshot` means no page refresh needed

---

## What changed in the code

| Before | After |
|--------|-------|
| `localStorage` — private per browser | Firebase Firestore — shared globally |
| Reviews disappear on other devices | All visitors see all reviews |
| Data lost on browser clear | Reviews persist permanently in Firestore |
| No real-time updates | `onSnapshot` — new reviews appear instantly |

The existing review UI (submit form, edit, delete, carousel, dots) is **unchanged**.  
localStorage is kept as an automatic fallback if Firestore is unreachable.
