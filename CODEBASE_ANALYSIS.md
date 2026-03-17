# LXPStats Comprehensive Codebase Analysis

**Date:** March 17, 2026
**Analyst:** AskLXP
**Repository:** https://github.com/LuxePorts/LXPStats

---

## Executive Summary

LXPStats is an Ethereum-style network statistics dashboard (eth-netstats fork) customized for the LuxePorts Network (XDC-based blockchain). It provides real-time visibility into network nodes, blocks, and mining statistics.

---

## Architecture Deep Dive

### Backend Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        LXPStats Server                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   API WS     │  │  Client WS   │  │  External WS │          │
│  │   (/api)     │  │  (/primus)   │  │  (/external) │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                 │
│         └──────────────────┴──────────────────┘                 │
│                            │                                    │
│                    ┌───────▼────────┐                          │
│                    │   Collection   │                          │
│                    └───────┬────────┘                          │
│                            │                                    │
│              ┌─────────────┼─────────────┐                     │
│              │             │             │                      │
│         ┌────▼───┐   ┌────▼───┐   ┌────▼───┐                  │
│         │  Node  │   │History │   │Blockchain                  │
│         │ Objects│   │ (2000) │   │  State │                    │
│         └────────┘   └────────┘   └────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Runtime | Node.js | 24.x | Server environment |
| WebSocket | Primus | ^8.x | Real-time bidirectional comms |
| WebSocket Transformer | websockets | - | Default Primus transformer |
| Frontend Framework | AngularJS | 1.x | SPA architecture |
| UI Components | Bootstrap | 3.x | CSS framework |
| Visualization | D3.js | 3.x | Charts and graphs |
| Sparklines | jquery.sparkline | 2.x | Mini charts |
| Maps | DataMaps | - | Geographic visualization |
| Utilities | Lodash | 4.x | Data manipulation |
| Templating | Jade/Pug | - | Server-side templates |
| Build Tool | Grunt | - | Asset pipeline |

---

## Functional Features (✅ Verified Working)

### 1. Node Connection Management
**File:** `app.js`, `lib/collection.js`
- WebSocket authentication via WS_SECRET
- Node registration with IP, geo-location, client info
- Automatic node cleanup after 4 hours inactivity
- Node pinning (persisted in localStorage)

**Data Flow:**
```
Node Client → WS /api → hello event → Collection.add() → Client broadcast
```

### 2. Block Propagation Tracking
**File:** `lib/history.js`
- Fork detection via block hash comparison
- Propagation time calculation (node-to-node)
- Trusted node prioritization
- Historical propagation charts (MAX_HISTORY = 2000 blocks)

**Key Algorithm:**
```javascript
block.propagation = now - historyBlock.forks[forkIndex].received
```

### 3. Real-time Statistics
**File:** `lib/node.js`, `src/js/controllers.js`
- Hashrate calculation: `difficulty / avgBlocktime`
- Average block time over 40 blocks
- Uncle count tracking
- Gas limit/spending history
- Transaction density
- Peer count monitoring
- Pending transaction count

### 4. Geographic Visualization
**File:** `src/views/index.jade`, `src/js/directives.js`
- World map with node locations
- Country-based clustering
- Interactive tooltips
- Real-time updates

### 5. Chart Visualizations
**File:** `src/js/directives.js`, `lib/history.js`

| Chart | Data Source | Library |
|-------|-------------|---------|
| Block time sparkline | `lastBlocksTime[]` | sparkline |
| Difficulty sparkline | `difficultyChart[]` | sparkline |
| Block propagation | `blockPropagationChart` | D3 histogram |
| Uncle count | `uncleCountChart[]` | sparkline |
| Transactions | `transactionDensity[]` | sparkline |
| Gas spending | `gasSpending[]` | sparkline |
| Gas limit | `lastGasLimit[]` | sparkline |

### 6. Node Table Features
**File:** `src/views/index.jade`, `src/js/controllers.js`
- Sortable columns (7 fields)
- Pin/unpin nodes
- Real-time updates
- Block propagation color coding
- Mining status indicators
- Peer count badges
- Pending transaction counts

### 7. Uptime Tracking
**File:** `lib/node.js`
- Per-node uptime calculation
- Total network uptime aggregation
- Status change history
- Last update timestamps

### 8. Latency Monitoring
**File:** `app.js`
- Node-to-server ping/pong
- Client page latency (5-second interval)
- Historical latency tracking

### 9. Miner Statistics
**File:** `lib/history.js` - `getMinersCount()`
- Top 2 miners display
- Block count per miner
- Visual block representation

### 10. Data Persistence (Client-side)
**File:** `src/js/controllers.js`
- localStorage for:
  - Pinned nodes
  - Sort preferences
  - Sort direction

---

## Placeholder/Partial Features (⚠️)

### 1. Version Checking
**File:** `lib/node.js`
- `canUpdateHistory` flag exists but enforcement is weak
- No automatic update mechanism
- Version comparison present but unused

### 2. Fork Alerting
**File:** `lib/history.js` - `compareForks()`
- Fork detection works
- No UI notification for forks
- Fork data stored but not prominently displayed

### 3. Block History Request
**File:** `lib/collection.js` - `requiresUpdate()`
- Logic exists to request missing blocks
- 2-minute cooldown between requests
- May not trigger reliably

### 4. Lite Mode
**File:** `lib/history.js`, `lib/node.js`
- `process.env.LITE` checks present
- Trusted node bypass for LITE mode
- Not documented

### 5. External API Socket
**File:** `app.js`
- `/external` endpoint defined
- `lastBlock` events emitted
- No consumers identified

---

## Missing Critical Features (❌)

### Transaction Explorer
- No transaction detail view
- No transaction hash search
- No transaction status tracking
- Missing input data decoding

### Block Explorer
- No individual block page
- No block transaction list
- No uncle block details
- No parent block navigation

### Address/Account Tracking
- No address balance lookup
- No address transaction history
- No account nonce tracking
- No code viewer for contracts

### Smart Contract Support
- No contract verification
- No ABI upload/interface
- No read/write contract methods
- No event log viewer

### Token Standards
- No ERC-20 token list
- No ERC-721/1155 NFT support
- No token transfer tracking
- No token holder distribution

### API Layer
- No REST API endpoints
- No GraphQL support
- No rate limiting
- No API documentation

### Database Persistence
- All data in-memory only
- No PostgreSQL/MongoDB integration
- Lost on server restart
- No historical archive

### Authentication
- No user authentication
- No admin panel
- No API key management
- No access control

### Alerts/Notifications
- No threshold alerts
- No email/webhook notifications
- No mobile push
- No browser notifications

### Search Functionality
- No global search
- No block number search
- No address search
- No transaction search

### Mobile Support
- Not responsive design
- Fixed width layout
- No PWA features
- Touch-unfriendly controls

### Theming
- Single dark theme only
- No light mode
- No system preference detection
- No custom color schemes

### Multi-chain Support
- Single chain only
- No network switcher
- No testnet support
- No custom RPC input

---

## Data Models

### Node Object
```javascript
{
  id: String,                    // Node identifier
  trusted: Boolean,              // Trusted status
  info: {
    name: String,                // Node name
    node: String,                // Client version
    net: String,                 // Network ID
    protocol: String,            // Protocol version
    api: String,                 // API version
    port: Number,                // Port
    os: String,                  // Operating system
    os_v: String,                // OS version
    client: String,              // Client name
    canUpdateHistory: Boolean    // Can provide history
  },
  geo: {
    ll: [Number, Number],        // Lat, Long
    city: String,
    country: String
  },
  stats: {
    active: Boolean,
    mining: Boolean,
    hashrate: Number,
    peers: Number,
    pending: Number,
    gasPrice: Number,
    block: {
      number: Number,
      hash: String,
      difficulty: Number,
      totalDifficulty: Number,
      gasLimit: Number,
      timestamp: Number,
      time: Number,
      arrival: Number,
      received: Number,
      propagation: Number,
      transactions: Array,
      uncles: Array
    },
    syncing: Boolean,
    propagationAvg: Number,
    latency: Number,
    uptime: Number
  },
  history: Array,                // 40-element propagation history
  uptime: {
    started: Date,
    up: Number,
    down: Number,
    lastStatus: Boolean,
    lastUpdate: Date
  }
}
```

### Block History Item
```javascript
{
  height: Number,
  block: {
    number: Number,
    hash: String,
    parentHash: String,
    sha3Uncles: String,
    transactionsRoot: String,
    stateRoot: String,
    miner: String,
    difficulty: Number,
    totalDifficulty: Number,
    gasLimit: Number,
    gasUsed: Number,
    timestamp: Number,
    transactions: Array,
    uncles: Array,
    trusted: Boolean,
    arrived: Number,
    received: Number,
    propagation: Number,
    fork: Number,
    time: Number
  },
  forks: Array,                  // Alternative blocks at same height
  propagTimes: [{
    node: String,
    trusted: Boolean,
    fork: Number,
    received: Number,
    propagation: Number
  }]
}
```

---

## Configuration

### Environment Variables
```bash
WS_SECRET="luxeports_network_stats"  # WebSocket auth
PORT=3000                             # Server port
NODE_ENV=production                   # Environment
LITE=true                             # Lite mode (optional)
```

### Trusted IPs
**File:** `lib/utils/config.js`
- Array of trusted node IP addresses
- Trusted nodes prioritized for block data
- Bypasses certain validations

---

## Performance Characteristics

### Memory Usage
- MAX_HISTORY = 2000 blocks stored
- MAX_BINS = 40 for charts
- Node objects retained for 4 hours
- Estimated: ~50MB for 100 nodes

### Network Traffic
- WebSocket heartbeat: 5 seconds (client)
- Node updates: event-driven
- Chart updates: debounced (1 second, max 5 seconds)
- Initial sync: ~100KB per node

### CPU Usage
- Fork comparison: O(n) per block
- Chart calculations: O(MAX_HISTORY)
- Node cleanup: O(n) every hour

---

## Security Considerations

### Current
- WS_SECRET authentication
- IP-based trust system
- XSS filtering in controllers
- Banned IP list

### Gaps
- No HTTPS enforcement
- No rate limiting
- No input validation on blocks
- No CORS configuration
- Secret in plain text

---

## XDC-Specific Missing Features

Since LXP is based on XDC Network, these XDC-specific features are missing:

1. **XDPoS Consensus Display**
   - 108 masternodes
   - 900-block epochs
   - Double validation

2. **Subnet/Shard Support**
   - XDC has subnets
   - Cross-shard transactions
   - Shard health metrics

3. **Voter/Staking Info**
   - Staking statistics
   - Voter rewards
   - Masternode candidates

4. **XDC Token Tracking**
   - XDC balance
   - Staking rewards
   - Token transfers

5. **XDC Client Integration**
   - XDC-specific RPC calls
   - Subnet discovery
   - Checkpoint tracking

---

## Recommendations

### Immediate (Week 1)
1. Add database persistence layer
2. Implement REST API
3. Add authentication system
4. Create proper admin panel

### Short-term (Month 1)
1. Mobile-responsive redesign
2. Transaction explorer
3. Block detail pages
4. Address lookup

### Medium-term (Quarter 1)
1. Smart contract verification
2. Token standards support
3. XDC-specific features
4. Alert system

### Long-term (Year 1)
1. Multi-chain support
2. GraphQL API
3. Advanced analytics
4. Mobile apps

---

## Files Reference

### Core Backend
| File | Lines | Purpose |
|------|-------|---------|
| `app.js` | ~400 | Main server, WebSocket handlers |
| `lib/collection.js` | ~250 | Node collection management |
| `lib/history.js` | ~550 | Block history, charts |
| `lib/node.js` | ~400 | Node object model |
| `lib/express.js` | ~50 | Express setup |

### Frontend
| File | Lines | Purpose |
|------|-------|---------|
| `src/js/controllers.js` | ~650 | Main Angular controller |
| `src/js/directives.js` | ~400 | Custom directives |
| `src/js/filters.js` | ~200 | Angular filters |
| `src/views/index.jade` | ~250 | Main dashboard |
| `src/views/layout.jade` | ~50 | Page layout |

---

*End of Analysis*
