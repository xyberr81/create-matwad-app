---
description: How to update and publish a new version of the CLI
---

1.  **Make your code changes** and commit them:

    ```bash
    git add .
    git commit -m "Fix: description of change"
    ```

2.  **Bump the version** (this automatically updates `package.json`):

    - For bug fixes (1.0.0 -> 1.0.1):
      ```bash
      npm version patch
      ```
    - For new features (1.0.0 -> 1.1.0):
      ```bash
      npm version minor
      ```
    - For breaking changes (1.0.0 -> 2.0.0):
      ```bash
      npm version major
      ```

3.  **Publish to npm**:
    ```bash
    npm publish --access public
    ```
    _(If prompted for OTP, append `--otp=123456`)_
