// Set env vars before any module imports so module-level code
// (e.g. `new Stripe(process.env.STRIPE_SECRET_KEY!)`) doesn't throw.
// The actual values don't matter because the Stripe/Resend/crypto
// constructors are fully mocked in each test file.
process.env.STRIPE_SECRET_KEY = "sk_test_placeholder";
process.env.RESEND_API_KEY = "re_placeholder";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_placeholder";
// Literal \n in the value — the route replaces /\\n/g with real newlines
process.env.ED25519_PRIVATE_KEY = "fake\\nkey";
