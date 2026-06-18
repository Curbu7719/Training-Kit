# Layered Architecture — Worked Example

Imagine a simple feature: a logged-in user clicks **"Generate monthly report"**, and the report is emailed to them.

Follow the request as it travels through the layers:

1. **Client (UI) layer.** The user clicks the button in their browser. The UI does not build the report or send the email itself. It simply makes an authenticated API call — attaching the user's login token — to a serverless function, then shows a spinner.

2. **Serverless function layer.** The function receives the call and first verifies the user's token to confirm who they are. It then asks the BaaS layer for the user's data for the month. Crucially, the secret API key for the email provider lives here, in the function's environment — never in the browser, where a user could read it.

3. **BaaS layer.** The database checks its access rules: this user may only read their *own* rows. It returns just that user's records. The rules are enforced here, at the source of truth, so even a tampered client cannot reach another person's data.

4. **External service.** The function formats the report and calls the third-party email provider's API, passing the secret key. The provider sends the email.

5. **Back up the chain.** The function returns a simple "success" response. The UI hides the spinner and shows "Report sent!"

Notice what each layer *didn't* do. The browser never saw the email key. The database never formatted an email. The email provider never touched the database. Each layer stayed within its responsibility — so a change to any one of them (a new email vendor, a redesigned button, a tighter access rule) stays contained to that layer.
