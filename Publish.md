For Expo, the standard path is EAS Build → upload the AAB to Play Console. Do this:

1. Add Android package + version code
    Update app.json to include a unique package name and versionCode, for example:
2. Set up EAS
    -Install EAS CLI (npm i -g eas-cli or use npx).
    -Run: eas login
    -Run: eas build:configure (creates eas.json)
3. Build a production AAB
    -Run: eas build -p android --profile production
    -Let EAS manage the keystore (recommended).
4. Upload to Google Play
    -Create app in Play Console.
    -Upload the .aab to Internal testing → Closed/Open → Production.
    -Complete store listing, content rating, data safety, and privacy policy.
