# LXPStats Phase 4 Implementation Plan

**Start Time:** 2026-03-17 18:15 UTC
**Target:** Implement remaining 9 open issues
**Priority:** P2 first (quicker wins), then P1, then P0

## Implementation Order

### Phase 4A: Quick P2 Wins (2-3 hours)
1. **#45** - XDC Staking Calculator
   - Simple calculator UI with formulas
   - No external dependencies
   
2. **#55** - Real-time Mempool Visualizer
   - Show pending transaction stats
   - Use existing pending tx data

3. **#51** - Propagation Heatmap Matrix
   - Node-to-node propagation visualization
   - Use existing propagation data

### Phase 4B: P1 Features (4-6 hours)
4. **#47** - Validator Set History Explorer
   - Store validator snapshots per epoch
   - Simple history browser

5. **#42** - XDC Subnet Health Monitor
   - Mock subnet data for now
   - Health indicators UI

6. **#58** - Visual Alert Rule Builder
   - Alert configuration UI
   - Simple rule storage

### Phase 4C: Complex Features (6-8 hours)
7. **#48** - Cross-Subnet Transaction Flow
   - Visual flow diagram
   - Cross-subnet detection logic

8. **#40** - Master Node Voter Analytics (P0)
   - Requires XDC contract integration
   - May need RPC calls to XDC node

9. **#57** - Multi-chain Node Operator Dashboard (P3)
   - Only if time permits

## Notes
- Use simplified Jade syntax
- Avoid ternary operators in ng-class
- All features must build with grunt --force
- Deploy after each feature batch
