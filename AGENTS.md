# Project Rules

## GitHub Publishing

- Treat `https://github.com/taeon44/taeon44.github.io` as the canonical repository and `taeon44` as its publishing account.
- For commit-and-push-only requests, commit and push directly to `main` unless the user explicitly requests a branch or pull request.
- Do not require, refresh, switch, or modify global GitHub CLI (`gh`) authentication for commit-and-push-only requests.
- Never change global Git or GitHub authentication settings for this repository.
- Before pushing, verify that `origin` targets `taeon44/taeon44.github.io` and that the active branch is `main`.
- Use repository-local Git credential settings. If authentication is required, ask the user to sign in as `taeon44` through Git Credential Manager.

이 저장소의 GitHub 게시 계정은 `taeon44`이며, 다른 Windows GitHub 계정의 전역 설정을 변경하지 않습니다.
