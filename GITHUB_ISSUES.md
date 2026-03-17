# GitHub Issues for LXPStats

## Issue #1: Master Node Voting Dashboard
**Title:** [Feature] XDPoS Master Node Voting Dashboard

**Description:**
Implement a real-time dashboard showing XDC's master node candidates, current votes, and election round status.

**Background:**
XDC uses XDPoS (XinFin Delegated Proof of Stake) consensus which has a unique master node election mechanism every 900 blocks (epoch). Currently, there is no visual tool to track this process.

**Requirements:**
1. Display current 108 masternodes with their voting power
2. Show candidate pool (nodes with >10M XDC stake)
3. Real-time vote count updates
4. Election countdown timer (next epoch)
5. Historical masternode set changes

**API Endpoint:**
```javascript
GET /api/xdpos/masternodes
Response: {
  masternodes: [...],
  candidates: [...],
  epoch: number,
  nextElection: timestamp,
  totalVotes: string
}
```

**UI Components:**
- Leaderboard table with sorting
- Vote distribution pie chart
- Epoch progress bar
- Mobile-responsive card view

**Priority:** P0 - High
**Effort:** High
**Labels:** enhancement, XDPoS, P0

---

## Issue #2: Double Validation Tracking
**Title:** [Feature] XDPoS Double Validation Status Indicator

**Description:**
Add visual indicators showing which blocks have passed double validation (masternode + backup validator signatures).

**Background:**
XDC's XDPoS requires two validators to sign each block for security. This is unique to XDC and should be prominently displayed.

**Requirements:**
1. Double validation badge on each block in block list
2. Validator signature verification status
3. Failed validation alerts
4. Statistics on double validation participation rate

**Implementation:**
- Extend block collection to track validator signatures
- Add validation status field to block data
- UI badge component with tooltip

**Priority:** P0 - High
**Effort:** Medium
**Labels:** enhancement, XDPoS, security, P0

---

## Issue #3: Checkpoint Block Visualization
**Title:** [Feature] Highlight Checkpoint Blocks (Every 900 Blocks)

**Description:**
Visually distinguish checkpoint blocks (every 900 blocks) which mark epoch boundaries in XDC.

**Requirements:**
1. Special CSS styling for blocks where blockNumber % 900 === 0
2. Checkpoint badge/icon in block list
3. Epoch number display (blockNumber / 900)
4. Historical checkpoint browser

**UI:**
- Golden border or crown icon for checkpoint blocks
- Epoch transition timeline
- Countdown to next checkpoint

**Priority:** P1 - Medium
**Effort:** Low
**Labels:** enhancement, UI, XDPoS

---

## Issue #4: Voter Rewards Calculator
**Title:** [Feature] XDC Voter Rewards Calculator

**Description:**
Build a calculator tool to estimate rewards for staking/voting on masternodes.

**Formula:**
```
Daily Reward = (Your Vote / Total Votes for MN) × MN Daily Reward × 0.98
```

**Requirements:**
1. Input: Vote amount, selected masternode
2. Output: Estimated daily/monthly/yearly rewards
3. Comparison tool (compare multiple masternodes)
4. Historical reward data

**UI:**
- Form inputs with validation
- Results cards with XDC amounts
- Comparison table

**Priority:** P2 - Medium
**Effort:** Medium
**Labels:** enhancement, calculator, staking

---

## Issue #5: Epoch Transition Timeline
**Title:** [Feature] Epoch Transition Visual Timeline

**Description:**
Visual timeline showing current epoch progress with countdown to next epoch transition.

**Requirements:**
1. Progress bar showing % through current epoch
2. Countdown timer to next epoch
3. Historical epoch list with stats
4. Masternode change summary per epoch

**UI:**
- Horizontal timeline component
- Epoch cards with key metrics
- Transition alerts

**Priority:** P1 - Medium
**Effort:** Medium
**Labels:** enhancement, UI, XDPoS

---

## Issue #6: Network Partition Detection
**Title:** [Feature] Network Partition Detection & Alerting

**Description:**
Detect when network nodes are on different forks or experiencing partitions.

**Requirements:**
1. Real-time comparison of latest block hash across all nodes
2. Partition alert banner when nodes diverge
3. Visualization of node groups by fork
4. Automatic recovery detection

**Implementation:**
```javascript
// Check every 30 seconds
nodes.forEach(node => {
  if (node.block.hash !== majorityHash) {
    flagAsForked(node);
  }
});
```

**UI:**
- Red alert banner for partitions
- Node grouping by fork color
- Fork depth indicator

**Priority:** P1 - High
**Effort:** High
**Labels:** enhancement, monitoring, alerts

---

## Issue #7: Custom Alert Builder
**Title:** [Feature] User-Defined Alert Rules

**Description:**
Allow users to create custom alerts for various network conditions.

**Alert Types:**
1. Block height threshold
2. Peer count drop
3. Node offline
4. Gas price spike
5. Fork detection

**Channels:**
- Email (SMTP)
- Webhook (Discord/Slack)
- Browser notifications

**Implementation:**
- Alert rules database
- Background checker process
- Notification dispatcher

**Priority:** P1 - High
**Effort:** High
**Labels:** enhancement, alerts, notifications

---

## Issue #8: Node Performance Leaderboard
**Title:** [Feature] Node Performance Gamification

**Description:**
Rank nodes by performance metrics with badges and rewards.

**Metrics:**
1. Block propagation speed (lower is better)
2. Uptime percentage
3. Response latency
4. Peer connectivity
5. Validation participation

**Gamification:**
- Bronze/Silver/Gold/Platinum badges
- Monthly leaderboards
- Performance streaks
- "Validator of the Month"

**Priority:** P2 - Medium
**Effort:** Medium
**Labels:** enhancement, gamification, UI

---

## Issue #9: Mobile-First PWA
**Title:** [Feature] Progressive Web App for Mobile

**Description:**
Convert LXPStats to a PWA with offline support and mobile-optimized UI.

**Requirements:**
1. Service worker for offline caching
2. Responsive redesign for mobile screens
3. Push notifications
4. Add to home screen support
5. Touch-optimized controls

**Implementation:**
- manifest.json
- Service worker with cache strategy
- Mobile-first CSS
- Touch event handling

**Priority:** P0 - High
**Effort:** High
**Labels:** enhancement, mobile, PWA

---

## Issue #10: Network Upgrade Readiness
**Title:** [Feature] Network Upgrade/Fork Readiness Dashboard

**Description:**
Track node software versions and upgrade adoption for network forks.

**Requirements:**
1. Client version distribution pie chart
2. Upgrade countdown timer
3. Adoption percentage tracking
4. Non-upgraded node alerts
5. Historical upgrade data

**UI:**
- Version breakdown chart
- Progress bar to target adoption
- Upgrade timeline

**Priority:** P0 - High
**Effort:** Medium
**Labels:** enhancement, upgrades, monitoring

---

## Issue #11: Dark/Light Theme Toggle
**Title:** [Feature] Theme Switching with System Preference

**Description:**
Add dark and light themes with automatic system preference detection.

**Requirements:**
1. CSS variables for theming
2. Toggle button in navbar
3. localStorage persistence
4. System preference detection (prefers-color-scheme)
5. Smooth transitions

**Priority:** P3 - Low
**Effort:** Low
**Labels:** enhancement, UI, theme

---

## Issue #12: One-Click Node Setup Wizard
**Title:** [Feature] Node Setup Configuration Generator

**Description:**
Guided wizard for new node operators to generate proper configuration.

**Steps:**
1. Node type selection (validator/bootnode)
2. Network selection (mainnet/testnet)
3. Hardware requirements check
4. Configuration file generation
5. Docker compose generator
6. Systemd service generator

**Output:**
- config.toml
- docker-compose.yml
- systemd service file
- Start script

**Priority:** P3 - Medium
**Effort:** Medium
**Labels:** enhancement, onboarding, tooling

---

## Issue #13: Client Diversity Score
**Title:** [Feature] Network Client Diversity Dashboard

**Description:**
Calculate and display client software diversity metrics for network health.

**Metrics:**
- Client version distribution (Geth, Erigon, etc.)
- Diversity score (1-100)
- Historical diversity trends
- Warning if >50% on single client version

**UI:**
- Diversity gauge/meter
- Version breakdown pie chart
- Trend line chart

**Priority:** P2 - Medium
**Effort:** Low
**Labels:** enhancement, analytics, monitoring

---

## Issue #14: Gas Price Heatmap
**Title:** [Feature] Gas Price Calendar Heatmap

**Description:**
Calendar view showing gas price trends by day/hour.

**Visualization:**
- GitHub-style contribution heatmap
- Hour x Day matrix
- Color intensity = gas price level
- Tooltip with exact values

**Data:**
- Aggregate gas price per hour
- 30-day rolling view
- Export to CSV

**Priority:** P4 - Low
**Effort:** Medium
**Labels:** enhancement, visualization, analytics

---

## Issue #15: Bootnode Health Score
**Title:** [Feature] Bootnode Health Monitoring Dashboard

**Description:**
Aggregate health metrics for all bootnodes with alerting.

**Metrics:**
- Response time to bootnode
- Successful peer discovery rate
- Bootnode uptime
- Geographic distribution

**Alerting:**
- Bootnode offline alerts
- High response time warnings
- Discovery failure rate alerts

**Priority:** P2 - Medium
**Effort:** Medium
**Labels:** enhancement, monitoring, infrastructure

---

## Issue #16: Validator Set History
**Title:** [Feature] Historical Validator Set Tracking

**Description:**
Track and visualize changes in the validator set over time.

**Features:**
1. Validator set snapshot per epoch
2. Diff view (who joined/left)
3. Validator tenure tracking
4. Performance history per validator

**UI:**
- Timeline view
- Validator cards with history
- Comparison tool

**Priority:** P1 - Medium
**Effort:** Medium
**Labels:** enhancement, history, XDPoS

---

## Issue #17: Cross-Shard Transaction Tracker
**Title:** [Feature] Multi-Shard Transaction Monitoring

**Description:**
Track transactions moving between XDC subnets/shards.

**Requirements:**
1. Shard ID tagging on transactions
2. Cross-shard transaction list
3. Shard health metrics
4. Shard-to-shard latency tracking

**Priority:** P2 - High
**Effort:** High
**Labels:** enhancement, sharding, multi-chain

---

## Issue #18: Network Growth Predictor
**Title:** [Feature] ML-Based Network Growth Prediction

**Description:**
Machine learning models to predict network growth metrics.

**Predictions:**
- Network size (node count) in 30/60/90 days
- Gas usage trends
- TPS capacity forecasting
- Storage growth estimation

**Implementation:**
- Time-series forecasting (Prophet/ARIMA)
- Confidence intervals
- Retraining pipeline

**Priority:** P2 - Medium
**Effort:** High
**Labels:** enhancement, ML, analytics

---

## Issue #19: Transaction Finality Probability
**Title:** [Feature] Real-Time Finality Probability Indicator

**Description:**
Show probability of transaction finality based on confirmation count.

**Algorithm:**
```
Probability = 1 - (1/forkRate)^(confirmations)
```

**UI:**
- Probability percentage badge
- Confidence meter
- Suggested confirmation count

**Priority:** P2 - Medium
**Effort:** Medium
**Labels:** enhancement, analytics, UX

---

## Issue #20: Inter-Node Latency Matrix
**Title:** [Feature] Node-to-Node Latency Heatmap

**Description:**
N×N matrix showing propagation times between specific node pairs.

**Visualization:**
- Color-coded heatmap
- Row/column = node IDs
- Cell color = latency
- Click for detailed stats

**Data:**
- Block arrival time per node
- Calculate pairwise deltas
- Update every 100 blocks

**Priority:** P4 - Low
**Effort:** Medium
**Labels:** enhancement, visualization, performance
