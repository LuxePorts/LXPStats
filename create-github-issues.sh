#!/bin/bash
# create-github-issues.sh
# Run this script to create all 20 GitHub issues using the GitHub CLI
# Requires: gh CLI installed and authenticated (gh auth login)

REPO="LuxePorts/LXPStats"

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is not installed. Install from: https://cli.github.com/"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo "Please authenticate with: gh auth login"
    exit 1
fi

echo "Creating 20 GitHub issues for LXPStats..."

# Issue 1: Master Node Voting Dashboard
gh issue create --repo "$REPO" --title "[Feature] XDPoS Master Node Voting Dashboard" \
  --body "Implement real-time dashboard for XDC masternode candidates, votes, and election rounds.

**Background:** XDC uses XDPoS with master node elections every 900 blocks. No visual tool exists for this.

**Requirements:**
- Display 108 masternodes with voting power
- Show candidate pool (>10M XDC stake)
- Real-time vote count updates
- Election countdown timer
- Historical masternode changes

**API:** \`GET /api/xdpos/masternodes\`

**Priority:** P0
**Effort:** High
**Labels:** enhancement, XDPoS, P0" \
  --label "enhancement,XDPoS,P0"

# Issue 2: Double Validation Tracking
gh issue create --repo "$REPO" --title "[Feature] XDPoS Double Validation Status" \
  --body "Add visual indicators for blocks that passed double validation (unique to XDC).

**Requirements:**
- Double validation badge per block
- Validator signature verification
- Failed validation alerts
- Participation rate stats

**Priority:** P0
**Effort:** Medium
**Labels:** enhancement, XDPoS, security, P0"

# Issue 3: Checkpoint Block Visualization
gh issue create --repo "$REPO" --title "[Feature] Highlight Checkpoint Blocks" \
  --body "Visually distinguish checkpoint blocks (every 900 blocks) marking epoch boundaries.

**UI:**
- Special styling for blockNumber % 900 === 0
- Checkpoint badge/icon
- Epoch number display
- Historical checkpoint browser

**Priority:** P1
**Effort:** Low
**Labels:** enhancement, UI, XDPoS"

# Issue 4: Voter Rewards Calculator
gh issue create --repo "$REPO" --title "[Feature] XDC Voter Rewards Calculator" \
  --body "Calculator tool to estimate rewards for staking/voting on masternodes.

**Formula:** Daily Reward = (Your Vote / Total Votes) × MN Daily Reward × 0.98

**Features:**
- Vote amount input
- Masternode selection
- Daily/monthly/yearly estimates
- Comparison tool

**Priority:** P2
**Effort:** Medium
**Labels:** enhancement, calculator, staking"

# Issue 5: Epoch Transition Timeline
gh issue create --repo "$REPO" --title "[Feature] Epoch Transition Visual Timeline" \
  --body "Visual timeline showing current epoch progress with countdown.

**UI:**
- Progress bar (% through epoch)
- Countdown timer
- Historical epoch list
- Masternode change summary

**Priority:** P1
**Effort:** Medium
**Labels:** enhancement, UI, XDPoS"

# Issue 6: Network Partition Detection
gh issue create --repo "$REPO" --title "[Feature] Network Partition Detection" \
  --body "Detect when network nodes are on different forks or partitions.

**Features:**
- Real-time block hash comparison
- Partition alert banner
- Node grouping by fork
- Recovery detection

**Priority:** P1
**Effort:** High
**Labels:** enhancement, monitoring, alerts"

# Issue 7: Custom Alert Builder
gh issue create --repo "$REPO" --title "[Feature] User-Defined Alert Rules" \
  --body "Custom alerts for network conditions with multi-channel notifications.

**Alert Types:**
- Block height threshold
- Peer count drop
- Node offline
- Gas price spike

**Channels:** Email, Webhook, Browser notifications

**Priority:** P1
**Effort:** High
**Labels:** enhancement, alerts, notifications"

# Issue 8: Node Performance Leaderboard
gh issue create --repo "$REPO" --title "[Feature] Node Performance Gamification" \
  --body "Rank nodes by performance with badges and rewards.

**Metrics:**
- Block propagation speed
- Uptime percentage
- Response latency
- Peer connectivity

**Gamification:** Bronze/Silver/Gold/Platinum badges

**Priority:** P2
**Effort:** Medium
**Labels:** enhancement, gamification, UI"

# Issue 9: Mobile-First PWA
gh issue create --repo "$REPO" --title "[Feature] Progressive Web App" \
  --body "Convert to PWA with offline support and mobile-optimized UI.

**Requirements:**
- Service worker
- Responsive redesign
- Push notifications
- Add to home screen
- Touch-optimized controls

**Priority:** P0
**Effort:** High
**Labels:** enhancement, mobile, PWA"

# Issue 10: Network Upgrade Readiness
gh issue create --repo "$REPO" --title "[Feature] Network Upgrade Dashboard" \
  --body "Track node software versions and upgrade adoption for forks.

**Features:**
- Version distribution chart
- Upgrade countdown
- Adoption percentage
- Non-upgraded node alerts

**Priority:** P0
**Effort:** Medium
**Labels:** enhancement, upgrades, monitoring"

# Issue 11: Dark/Light Theme
gh issue create --repo "$REPO" --title "[Feature] Theme Switching" \
  --body "Dark and light themes with system preference detection.

**Requirements:**
- CSS variables
- Toggle button
- localStorage persistence
- System preference detection

**Priority:** P3
**Effort:** Low
**Labels:** enhancement, UI, theme"

# Issue 12: Node Setup Wizard
gh issue create --repo "$REPO" --title "[Feature] Node Setup Configuration Generator" \
  --body "Guided wizard for new node operators.

**Steps:**
1. Node type selection
2. Network selection
3. Hardware check
4. Config file generation
5. Docker/systemd setup

**Priority:** P3
**Effort:** Medium
**Labels:** enhancement, onboarding, tooling"

# Issue 13: Client Diversity Score
gh issue create --repo "$REPO" --title "[Feature] Client Diversity Dashboard" \
  --body "Calculate and display client software diversity metrics.

**Metrics:**
- Version distribution
- Diversity score (1-100)
- Historical trends
- Warning if >50% single client

**Priority:** P2
**Effort:** Low
**Labels:** enhancement, analytics, monitoring"

# Issue 14: Gas Price Heatmap
gh issue create --repo "$REPO" --title "[Feature] Gas Price Calendar Heatmap" \
  --body "Calendar view showing gas price trends by day/hour.

**Visualization:**
- GitHub-style heatmap
- Hour × Day matrix
- 30-day rolling view

**Priority:** P4
**Effort:** Medium
**Labels:** enhancement, visualization, analytics"

# Issue 15: Bootnode Health Score
gh issue create --repo "$REPO" --title "[Feature] Bootnode Health Monitoring" \
  --body "Aggregate health metrics for all bootnodes with alerting.

**Metrics:**
- Response time
- Discovery success rate
- Uptime
- Geographic distribution

**Priority:** P2
**Effort:** Medium
**Labels:** enhancement, monitoring, infrastructure"

# Issue 16: Validator Set History
gh issue create --repo "$REPO" --title "[Feature] Historical Validator Set Tracking" \
  --body "Track and visualize validator set changes over time.

**Features:**
- Per-epoch snapshots
- Diff view (joined/left)
- Tenure tracking
- Performance history

**Priority:** P1
**Effort:** Medium
**Labels:** enhancement, history, XDPoS"

# Issue 17: Cross-Shard Transaction Tracker
gh issue create --repo "$REPO" --title "[Feature] Multi-Shard Transaction Monitoring" \
  --body "Track transactions between XDC subnets/shards.

**Features:**
- Shard ID tagging
- Cross-shard transaction list
- Shard health metrics
- Cross-shard latency

**Priority:** P2
**Effort:** High
**Labels:** enhancement, sharding, multi-chain"

# Issue 18: Network Growth Predictor
gh issue create --repo "$REPO" --title "[Feature] ML-Based Network Growth Prediction" \
  --body "Machine learning predictions for network metrics.

**Predictions:**
- Node count forecasting
- Gas usage trends
- TPS capacity
- Storage growth

**Priority:** P2
**Effort:** High
**Labels:** enhancement, ML, analytics"

# Issue 19: Transaction Finality Probability
gh issue create --repo "$REPO" --title "[Feature] Finality Probability Indicator" \
  --body "Show probability of transaction finality.

**Algorithm:** Probability = 1 - (1/forkRate)^(confirmations)

**UI:** Probability percentage + confidence meter

**Priority:** P2
**Effort:** Medium
**Labels:** enhancement, analytics, UX"

# Issue 20: Inter-Node Latency Matrix
gh issue create --repo "$REPO" --title "[Feature] Node-to-Node Latency Heatmap" \
  --body "N×N matrix showing propagation times between node pairs.

**Visualization:** Color-coded heatmap
**Data:** Block arrival time deltas

**Priority:** P4
**Effort:** Medium
**Labels:** enhancement, visualization, performance"

echo "All 20 issues created successfully!"
