#!/bin/bash
# BuildRightPros Deploy Script for Coolify
# Run this on your Hetzner server (5.75.146.160) or via Coolify UI

# === OPTION 1: Coolify API Deploy ===
# Set your Coolify API token (get from Coolify Settings > API)
# COOLIFY_TOKEN="your-token-here"
# COOLIFY_URL="https://coolify.systemgoat.com"  # or your Coolify URL

# curl -X POST "$COOLIFY_URL/api/v1/applications" \
#   -H "Authorization: Bearer $COOLIFY_TOKEN" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "name": "buildrightpros",
#     "git_repository": "https://github.com/VercinGetorix447/buildrightpros-site",
#     "git_branch": "main",
#     "build_pack": "dockerfile",
#     "domains": ["buildrightpros.com", "www.buildrightpros.com"],
#     "port": 80
#   }'

# === OPTION 2: Manual Docker Deploy ===
echo "=== BuildRightPros Deploy ==="

# Clone/pull latest
if [ -d "buildrightpros-site" ]; then
  cd buildrightpros-site && git pull
else
  git clone https://github.com/VercinGetorix447/buildrightpros-site.git
  cd buildrightpros-site
fi

# Build and run
docker build -t buildrightpros:latest .
docker stop buildrightpros 2>/dev/null || true
docker rm buildrightpros 2>/dev/null || true
docker run -d \
  --name buildrightpros \
  --restart unless-stopped \
  -p 8081:80 \
  buildrightpros:latest

echo "=== Deployed! Access at http://localhost:8081 ==="
echo "Configure Coolify proxy to route buildrightpros.com -> port 8081"
