# Tests

## Running tests

```bash
npm test

# Test

| What it covers | Description |
|------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| Recommends a cheaper alternative for a single Cursor Business user | Verifies that a user on Cursor Business (`$40/month, 1 seat`) gets a recommendation to switch to GitHub Copilot Individual (`$10/month`), saving `$30/month`. |
| Suggests buying credits for high API spend | Verifies that a user spending `$200/month` on OpenAI API is recommended to buy discounted credits via Credex, saving `$60/month` (30% discount). |

```
