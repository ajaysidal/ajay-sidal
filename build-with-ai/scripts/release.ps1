param(
  [string]$Message = "chore: ci(playwright): add runner and docker",
  [string]$Branch = "main"
)

Write-Host "Staging all changes..."
git add -A

try {
  Write-Host "Committing: $Message"
  git commit -m $Message
} catch {
  Write-Host "Nothing to commit"
}

Write-Host "Pushing to origin/$Branch"
git push origin $Branch

Write-Host "Installing dependencies and building"
npm ci
npm run build

Write-Host "Running CI Playwright runner locally"
bash ./ci/run-playwright.sh

Write-Host "Release script finished."
