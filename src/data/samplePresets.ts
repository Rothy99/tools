export const SAMPLE_PRESETS = {
  jsonFormatter: `{
  "appName": "mytoolsbox Suite",
  "version": "2.5.0",
  "active": true,
  "settings": {
    "theme": "dark",
    "maxHistory": 50,
    "notifications": {
      "email": true,
      "push": false
    }
  },
  "supportedFormats": ["json", "yaml", "xml", "csv"],
  "users": [
    { "id": 101, "name": "Alice Vance", "role": "admin", "tags": ["dev", "lead"] },
    { "id": 102, "name": "Bob Stone", "role": "editor", "tags": ["design"] }
  ],
  "metadata": null
}`,

  jsonCompareA: `{
  "server": "api.production.internal",
  "port": 8080,
  "timeout": 5000,
  "features": {
    "authV2": true,
    "rateLimiting": true,
    "analytics": false
  },
  "clusterNodes": ["node-1", "node-2", "node-3"],
  "dbConnections": 10
}`,

  jsonCompareB: `{
  "server": "api.production.internal",
  "port": 9090,
  "timeout": 5000,
  "features": {
    "authV2": true,
    "rateLimiting": false,
    "analytics": true,
    "newGateway": true
  },
  "clusterNodes": ["node-1", "node-2", "node-3", "node-4"],
  "dbConnections": 25
}`,

  textDiffA: `function calculateDiscount(price, userLevel) {
  if (userLevel === 'VIP') {
    return price * 0.20;
  }
  if (userLevel === 'Regular') {
    return price * 0.05;
  }
  return 0;
}`,

  textDiffB: `function calculateDiscount(price, userLevel, promoCode) {
  let discountRate = 0;
  
  if (userLevel === 'VIP') {
    discountRate = 0.25; // Upgraded VIP discount
  } else if (userLevel === 'Regular') {
    discountRate = 0.10;
  }
  
  if (promoCode === 'SUMMER2026') {
    discountRate += 0.05;
  }
  
  return price * discountRate;
}`,

  jwtSample: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggRGV2ZWxvcGVyIiwicm9sZSI6InNlbmlvcl9lbmdpbmVlciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyNTE2MjM5MDIyfQ.X4f3x7d8y9z0_signature_placeholder_abc123`,

  regexSamplePattern: `\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b`,
  regexSampleText: `Contact our support team at support@mytoolsbox.io or sales@company.com!
Invalid addresses like test@com or @no-user.org will not match.
Reach out to john.doe.2026@sub.domain.co.uk today.`,

  sqlSample: `SELECT u.id, u.username, u.email, COUNT(o.id) as total_orders, SUM(o.amount) as lifetime_value FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' AND o.created_at >= '2026-01-01' GROUP BY u.id, u.username, u.email HAVING COUNT(o.id) > 2 ORDER BY lifetime_value DESC LIMIT 50;`,

  cronSample: `*/15 9-17 * * 1-5`,

  urlSample: `https://mytoolsbox.io/search?q=developer+tools&category=json&mode=super&limit=20&filter%5Bactive%5D=true&tags=formatter%2Cdiff%2Cjwt#results`,

  base64Sample: `Hello mytoolsbox! 🚀
Welcome to the Super Web Tool suite for JSON formatting, JSON diff, JWT decoding, Hash calculation, and more!`,

  jsonBatchSample: `[
  "{\\"service\\": \\"auth-api\\", \\"port\\": 8000, \\"status\\": \\"online\\", \\"debug\\": false}",
  "{\\"service\\": \\"payment-gateway\\", \\"currency\\": \\"USD\\", \\"retry\\": 3}",
  "{\\"service\\": \\"database-cluster\\", \\"nodes\\": [\\"db1\\", \\"db2\\"], \\"max_conn\\": 100}",
  "{\\"service\\": \\"cache-redis\\", \\"memory\\": \\"2GB\\", \\"eviction\\": \\"LRU\\"}"
]`,

  jsonBatchObjectsSample: `[
  { "id": 101, "name": "Auth Service", "status": "healthy", "uptime": "99.98%" },
  { "id": 102, "name": "Payment Gateway", "status": "healthy", "uptime": "99.95%" },
  { "id": 103, "name": "Search Engine", "status": "degraded", "uptime": "98.20%" }
]`,

  base64BatchSample: `mytoolsbox developer suite
https://mytoolsbox.specsrank.site
API Secret Token 2026
JSON Formatter & Base64 Batch Mode`,

  base64BatchDecodedSample: `bXl0b29sc2JveCBkZXZlbG9wZXIgc3VpdGU=
aHR0cHM6Ly9teXRvb2xzYm94LnNwZWNzcmFuay5zaXRl
QVBJIFNlY3JldCBUb2tlbiAyMDI2
SlNPTiBGb3JtYXR0ZXIgJiBCYXNlNjQgQmF0Y2ggTW9kZQ==`,

  colorSample: `#6366f1`,
};
