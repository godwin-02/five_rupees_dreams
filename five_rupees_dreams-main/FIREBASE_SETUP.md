# Firebase Firestore Setup — Five Rupees Dreams Reviews

Follow these steps to make reviews visible to ALL visitors globally.

> How it works: the review form, carousel, edit/delete buttons and styling
> are unchanged. Only the *storage layer* changes — from browser-local
> `localStorage` to shared Firestore. Until Firebase is configured the site
> keeps using `localStorage` (key `frd-reviews-v6`) and makes **no** external
> requests. The Firebase SDK is loaded on demand only once a real config is
> present.

---

## Step 1 — Create a Firebase Project

1. Go to https://console.firebase.google.com
2. Click **Add project** → name it `five-rupees-dreams`
3. Disable Google Analytics (not needed) → **Create project**

## Step 2 — Enable Firestore

1. In the left sidebar → **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** → select your region → **Done**

## Step 3 — Set Firestore Rules

In Firestore → **Rules** tab, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /five-rupees-reviews/{docId} {
      allow read: if true;
      allow create, update: if request.resource.data.name is string
                    && request.resource.data.name.size() > 0
                    && request.resource.data.name.size() <= 80
                    && request.resource.data.text is string
                    && request.resource.data.text.size() > 2
                    && request.resource.data.text.size() <= 1500;
      allow delete: if true;
    }
  }
}
```

Click **Publish**.

> **Security note:** this is an anonymous public review board (no sign-in),
> so `delete` is open at the rules layer to preserve the existing "delete your
> own review" interaction. The website only shows Edit/Delete on reviews
> created in the same browser (tracked locally under `frd-reviews-mine`), so a
> normal visitor cannot remove other people's reviews through the UI. A
> determined user could still call the Firestore API directly — if that
> becomes a problem, add Firebase Auth and gate `delete`/`update` on the signed-in author.

## Step 4 — Get Your Firebase Config

1. In Firebase console → ⚙️ Project settings → **General** tab
2. Scroll to **Your apps** → click **Add app** → Web (`</>`)
3. Register app name: `five-rupees-website` → **Register app**
4. Copy the `firebaseConfig` object shown

## Step 5 — Add the Config to script.js

Open `script.js` and find the `FIREBASE_CONFIG` object inside the
`FirebaseReviews` module (near the top of the file, just above the
`ReviewEngine`). Replace each `YOUR_...` placeholder with your real values:

```javascript
const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

These are **public web config values**, not service-account keys — they are
safe to ship in client-side code. Never put service-account / private keys
in this file.

You do **not** need to add any `<script>` tags to `index.html`: the Firebase
compat SDK is fetched from the official `gstatic.com` CDN automatically, but
only when a real config is detected. With placeholders in place, nothing is
loaded.

## Step 6 — Test & Verify

1. Open the website on **Device A** → submit a review.
2. Open the website on **Device B** (different browser/phone) → the review
   appears. New reviews sync live via `onSnapshot`, no refresh needed.
3. On Device A you can still Edit/Delete your own review; on Device B those
   buttons are not shown for that review (it isn't yours to change).

> **Verify before trusting it.** Shared reviews are only "live" once you have:
> (a) replaced the `FIREBASE_CONFIG` placeholders, (b) published the Firestore
> rules above, and (c) confirmed on a second device/browser that a review
> submitted on one appears on the other. Until that three-step check passes,
> the site continues to work on `localStorage` only.

---

## What changed in the code

| Before | After |
|--------|-------|
| `localStorage` only — private per browser | Firestore shared globally (with localStorage as cache/fallback) |
| Reviews lost on browser clear | Reviews persist permanently in Firestore |
| No real-time updates | `onSnapshot` — new reviews appear instantly |
| Edit/Delete by array index | Edit/Delete by stable review id; only for reviews created in this browser |

The review UI (form, carousel, dots, counter, modal) is **unchanged**.
`localStorage` (`frd-reviews-v6`) is retained as an instant-load cache and as
the automatic fallback if Firestore is not configured or unreachable.
