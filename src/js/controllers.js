
/* Controllers */

netStatsApp.controller('StatsCtrl', function($scope, $filter, $localStorage, socket, _, toastr) {

	var MAX_BINS = 40;

	// Main Stats init
	// ---------------

	$scope.frontierHash = '0x11bbe8db4e347b4e8c937c1c8370e4b5ed33adb3db69cbdb7a38e1e50b1b82fa';
	$scope.nodesTotal = 0;
	$scope.nodesActive = 0;
	$scope.bestBlock = 0;
	$scope.lastBlock = 0;
	$scope.lastDifficulty = 0;
	$scope.upTimeTotal = 0;
	$scope.avgBlockTime = 0;
	$scope.blockPropagationAvg = 0;
	$scope.avgHashrate = 0;
	$scope.uncleCount = 0;
	$scope.bestStats = {};
	
	// XDPoS Epoch Data
	$scope.epoch = {
		currentEpoch: 0,
		currentBlock: 0,
		epochStartBlock: 0,
		epochEndBlock: 899,
		blocksInEpoch: 0,
		blocksRemaining: 900,
		epochProgress: 0,
		isCheckpoint: false,
		avgBlockTime: 2,
		estimatedTimeRemaining: 1800,
		epochLength: 900
	};
	$scope.checkpoints = [];
	
	// XDPoS Validation Stats
	$scope.validationStats = {
		totalBlocks: 0,
		doubleValidated: 0,
		primaryOnly: 0,
		failed: 0,
		doubleValidationRate: 0
	};

	// Client Version Diversity
	$scope.diversity = {
		score: 0,
		versions: [],
		totalNodes: 0,
		maxClientPercent: 0,
		status: 'unknown'
	};

	// Bootnode Health
	$scope.bootnodes = [
		{ id: 'bootnode1', name: 'Primary Bootnode', url: 'enode://ec569f5d52cefee5c5405a0c5db720dc7061f3085e0682dd8321413430ddda6a177b85db75b0daf83d2e68760ba3f5beb4ba9e333e7d52072fba4d39b05a0451@78.129.229.60:30301', status: 'unknown', latency: 0, lastCheck: 0 },
		{ id: 'bootnode2', name: 'Backup Bootnode', url: 'enode://...', status: 'unknown', latency: 0, lastCheck: 0 }
	];

	$scope.showBootnodes = false;

	// Network Upgrade Readiness
	$scope.upgradeReadiness = {
		targetVersion: '1.0.0',
		currentVersion: '0.9.0',
		adoptionRate: 0,
		totalNodes: 0,
		upgradedNodes: 0,
		status: 'pending'
	};

	// Network Fork Status
	$scope.forkStatus = {
		isForked: false,
		hashCount: 1,
		primaryHash: '',
		primaryHashCount: 0,
		consensusPercent: 100
	};

	// Masternode Performance Leaderboard
	$scope.masternodes = [];
	$scope.showLeaderboard = false;

	// Gas Price Prediction
	$scope.gasPrediction = {
		current: 0,
		predicted: 0,
		trend: 'stable',
		confidence: 0
	};

	// Node Reputation System
	$scope.nodeReputations = [];
	$scope.showReputations = false;

	// Uncle Rate Analysis
	$scope.uncleAnalysis = {
		totalUncles: 0,
		uncleRate: 0,
		avgUnclesPerBlock: 0,
		byMiner: []
	};

	// XDC Staking Calculator
	$scope.stakingCalc = {
		voteAmount: 1000000,
		masternode: null,
		rewardPerDay: 0,
		rewardPerMonth: 0,
		rewardPerYear: 0,
		roi: 0,
		showCalculator: false
	};

	$scope.lastGasLimit = _.fill(Array(MAX_BINS), 2);
	$scope.lastBlocksTime = _.fill(Array(MAX_BINS), 2);
	$scope.difficultyChart = _.fill(Array(MAX_BINS), 2);
	$scope.transactionDensity = _.fill(Array(MAX_BINS), 2);
	$scope.gasSpending = _.fill(Array(MAX_BINS), 2);
	$scope.miners = [];


	$scope.nodes = [];
	$scope.map = [];
	$scope.blockPropagationChart = [];
	$scope.uncleCountChart = _.fill(Array(MAX_BINS), 2);
	$scope.coinbases = [];

	$scope.latency = 0;

	$scope.currentApiVersion = "0.1.1";

	$scope.predicate = $localStorage.predicate || ['-pinned', '-stats.active', '-stats.block.number', 'stats.block.propagation'];
	$scope.reverse = $localStorage.reverse || false;
	$scope.pinned = $localStorage.pinned || [];

	$scope.prefixPredicate = ['-pinned', '-stats.active'];
	$scope.originalPredicate = ['-stats.block.number', 'stats.block.propagation'];

	$scope.orderTable = function(predicate, reverse)
	{
		if(!_.isEqual(predicate, $scope.originalPredicate))
		{
			$scope.reverse = reverse;
			$scope.originalPredicate = predicate;
			$scope.predicate = _.union($scope.prefixPredicate, predicate);
		}
		else
		{
			$scope.reverse = !$scope.reverse;

			if($scope.reverse === true){
				_.forEach(predicate, function (value, key) {
					predicate[key] = (value[0] === '-' ? value.replace('-', '') : '-' + value);
				});
			}

			$scope.predicate = _.union($scope.prefixPredicate, predicate);
		}

		$localStorage.predicate = $scope.predicate;
		$localStorage.reverse = $scope.reverse;
	}

	$scope.pinNode = function(id)
	{
		index = findIndex({id: id});

		if( !_.isUndefined($scope.nodes[index]) )
		{
			$scope.nodes[index].pinned = !$scope.nodes[index].pinned;

			if($scope.nodes[index].pinned)
			{
				$scope.pinned.push(id);
			}
			else
			{
				$scope.pinned.splice($scope.pinned.indexOf(id), 1);
			}
		}

		$localStorage.pinned = $scope.pinned;
	}

	var timeout = setInterval(function ()
	{
		$scope.$apply();
	}, 300);

	$scope.getNumber = function (num) {
		return new Array(num);
	}

	// Socket listeners
	// ----------------

	socket.on('open', function open() {
		socket.emit('ready');
		console.log('The connection has been opened.');
	})
	.on('end', function end() {
		console.log('Socket connection ended.')
	})
	.on('error', function error(err) {
		console.log(err);
	})
	.on('reconnecting', function reconnecting(opts) {
		console.log('We are scheduling a reconnect operation', opts);
	})
	.on('data', function incoming(data) {
		$scope.$apply(socketAction(data.action, data.data));
	});

	socket.on('init', function(data)
	{
		$scope.$apply(socketAction("init", data.nodes));
	});

	socket.on('client-latency', function(data)
	{
		$scope.latency = data.latency;
	})

	function socketAction(action, data)
	{
		// filter data
		data = xssFilter(data);

		// console.log('Action: ', action);
		// console.log('Data: ', data);

		switch(action)
		{
			case "init":
				$scope.nodes = data;

				_.forEach($scope.nodes, function (node, index) {

					// Init hashrate
					if( _.isUndefined(node.stats.hashrate) )
						node.stats.hashrate = 0;

					// Init latency
					latencyFilter(node);

					// Init history
					if( _.isUndefined(data.history) )
					{
						data.history = new Array(40);
						_.fill(data.history, -1);
					}

					// Init or recover pin
					node.pinned = ($scope.pinned.indexOf(node.id) >= 0 ? true : false);
				});

				if( $scope.nodes.length > 0 )
				{
					toastr['success']("Got nodes list", "Got nodes!");

					updateActiveNodes();
				}

				break;

			case "add":
				var index = findIndex({id: data.id});

				// if( addNewNode(data) )
				// 	toastr['success']("New node "+ $scope.nodes[findIndex({id: data.id})].info.name +" connected!", "New node!");
				// else
				// 	toastr['info']("Node "+ $scope.nodes[index].info.name +" reconnected!", "Node is back!");

				break;

			// TODO: Remove when everybody updates api client to 0.0.12
			case "update":
				var index = findIndex({id: data.id});

				if( index >= 0 && !_.isUndefined($scope.nodes[index]) && !_.isUndefined($scope.nodes[index].stats) )
				{
					if( !_.isUndefined($scope.nodes[index].stats.latency) )
						data.stats.latency = $scope.nodes[index].stats.latency;

					if( _.isUndefined(data.stats.hashrate) )
						data.stats.hashrate = 0;

					if( $scope.nodes[index].stats.block.number < data.stats.block.number )
					{
						var best = _.max($scope.nodes, function (node) {
							return parseInt(node.stats.block.number);
						}).stats.block;

						if (data.stats.block.number > best.number) {
							data.stats.block.arrived = _.now();
						} else {
							data.stats.block.arrived = best.arrived;
						}

						$scope.nodes[index].history = data.history;
					}

					$scope.nodes[index].stats = data.stats;

					if( !_.isUndefined(data.stats.latency) && _.get($scope.nodes[index], 'stats.latency', 0) !== data.stats.latency )
					{
						$scope.nodes[index].stats.latency = data.stats.latency;

						latencyFilter($scope.nodes[index]);
					}

					updateBestBlock();
				}

				break;

			case "block":
				var index = findIndex({id: data.id});

				if( index >= 0 && !_.isUndefined($scope.nodes[index]) && !_.isUndefined($scope.nodes[index].stats) )
				{
					if( $scope.nodes[index].stats.block.number < data.block.number )
					{
						var best = _.max($scope.nodes, function (node) {
							return parseInt(node.stats.block.number);
						}).stats.block;

						if (data.block.number > best.number) {
							data.block.arrived = _.now();
						} else {
							data.block.arrived = best.arrived;
						}

						$scope.nodes[index].history = data.history;
					}

					$scope.nodes[index].stats.block = data.block;
					$scope.nodes[index].stats.propagationAvg = data.propagationAvg;

					updateBestBlock();
				}

				break;

			case "pending":
				var index = findIndex({id: data.id});

				if( !_.isUndefined(data.id) && index >= 0 )
				{
					var node = $scope.nodes[index];

					if( !_.isUndefined(node) && !_.isUndefined(node.stats.pending) && !_.isUndefined(data.pending) )
						$scope.nodes[index].stats.pending = data.pending;
				}

				break;

			case "stats":
				var index = findIndex({id: data.id});

				if( !_.isUndefined(data.id) && index >= 0 )
				{
					var node = $scope.nodes[index];

					if( !_.isUndefined(node) && !_.isUndefined(node.stats) )
					{
						$scope.nodes[index].stats.active = data.stats.active;
						$scope.nodes[index].stats.mining = data.stats.mining;
						$scope.nodes[index].stats.hashrate = data.stats.hashrate;
						$scope.nodes[index].stats.peers = data.stats.peers;
						$scope.nodes[index].stats.gasPrice = data.stats.gasPrice;
						$scope.nodes[index].stats.uptime = data.stats.uptime;

						if( !_.isUndefined(data.stats.latency) && _.get($scope.nodes[index], 'stats.latency', 0) !== data.stats.latency )
						{
							$scope.nodes[index].stats.latency = data.stats.latency;

							latencyFilter($scope.nodes[index]);
						}

						updateActiveNodes();
					}
				}

				break;

			case "info":
				var index = findIndex({id: data.id});

				if( index >= 0 )
				{
					$scope.nodes[index].info = data.info;

					if( _.isUndefined($scope.nodes[index].pinned) )
						$scope.nodes[index].pinned = false;

					// Init latency
					latencyFilter($scope.nodes[index]);

					updateActiveNodes();
				}

				break;

			case "blockPropagationChart":
				$scope.blockPropagationChart = data.histogram;
				$scope.blockPropagationAvg = data.avg;

				break;

			case "uncleCount":
				$scope.uncleCount = data[0] + data[1];
				data.reverse();
				$scope.uncleCountChart = data;

				break;

			case "charts":
				if( !_.isEqual($scope.avgBlockTime, data.avgBlocktime) )
					$scope.avgBlockTime = data.avgBlocktime;

				if( !_.isEqual($scope.avgHashrate, data.avgHashrate) )
					$scope.avgHashrate = data.avgHashrate;

				if( !_.isEqual($scope.lastGasLimit, data.gasLimit) && data.gasLimit.length >= MAX_BINS )
					$scope.lastGasLimit = data.gasLimit;

				if( !_.isEqual($scope.lastBlocksTime, data.blocktime) && data.blocktime.length >= MAX_BINS )
					$scope.lastBlocksTime = data.blocktime;

				if( !_.isEqual($scope.difficultyChart, data.difficulty) && data.difficulty.length >= MAX_BINS )
					$scope.difficultyChart = data.difficulty;

				if( !_.isEqual($scope.blockPropagationChart, data.propagation.histogram) ) {
					$scope.blockPropagationChart = data.propagation.histogram;
					$scope.blockPropagationAvg = data.propagation.avg;
				}

				data.uncleCount.reverse();

				if( !_.isEqual($scope.uncleCountChart, data.uncleCount) && data.uncleCount.length >= MAX_BINS ) {
					$scope.uncleCount = data.uncleCount[data.uncleCount.length-2] + data.uncleCount[data.uncleCount.length-1];
					$scope.uncleCountChart = data.uncleCount;
				}

				if( !_.isEqual($scope.transactionDensity, data.transactions) && data.transactions.length >= MAX_BINS )
					$scope.transactionDensity = data.transactions;

				if( !_.isEqual($scope.gasSpending, data.gasSpending) && data.gasSpending.length >= MAX_BINS )
					$scope.gasSpending = data.gasSpending;

				if( !_.isEqual($scope.miners, data.miners) ) {
					$scope.miners = data.miners;
					getMinersNames();
				}
				
				// XDPoS Epoch Data
				if( !_.isUndefined(data.epoch) ) {
					$scope.epoch = data.epoch;
				}
				
				if( !_.isUndefined(data.checkpoints) ) {
					$scope.checkpoints = data.checkpoints;
				}
				
				// XDPoS Validation Stats
				if( !_.isUndefined(data.validationStats) ) {
					$scope.validationStats = data.validationStats;
				}

				break;

			case "inactive":
				var index = findIndex({id: data.id});

				if( index >= 0 )
				{
					if( !_.isUndefined(data.stats) )
						$scope.nodes[index].stats = data.stats;

					// toastr['error']("Node "+ $scope.nodes[index].info.name +" went away!", "Node connection was lost!");

					updateActiveNodes();
				}

				break;

			case "latency":
				if( !_.isUndefined(data.id) && !_.isUndefined(data.latency) )
				{
					var index = findIndex({id: data.id});

					if( index >= 0 )
					{
						var node = $scope.nodes[index];

						if( !_.isUndefined(node) && !_.isUndefined(node.stats) && !_.isUndefined(node.stats.latency) && node.stats.latency !== data.latency )
						{
							node.stats.latency = data.latency;
							latencyFilter(node);
						}
					}
				}

				break;

			case "client-ping":
				socket.emit('client-pong', {
					serverTime: data.serverTime,
					clientTime: _.now()
				});

				break;
		}

		// $scope.$apply();
	}

	function findIndex(search)
	{
		return _.findIndex($scope.nodes, search);
	}

	function getMinersNames()
	{
		if( $scope.miners.length > 0 )
		{
			_.forIn($scope.miners, function (value, key)
			{
				if(value.name !== false)
					return;

				if(value.miner === "0x0000000000000000000000000000000000000000")
					return;

				var name = _.result(_.find(_.pluck($scope.nodes, 'info'), 'coinbase', value.miner), 'name');

				if( !_.isUndefined(name) )
					$scope.miners[key].name = name;
			});
		}

		calculateMasternodeLeaderboard();
	}

	function addNewNode(data)
	{
		var index = findIndex({id: data.id});

		if( _.isUndefined(data.history) )
		{
			data.history = new Array(40);
			_.fill(data.history, -1);
		}

		if( index < 0 )
		{
			if( !_.isUndefined(data.stats) && _.isUndefined(data.stats.hashrate) )
			{
				data.stats.hashrate = 0;
			}

			data.pinned = false;

			$scope.nodes.push(data);

			return true;
		}

		data.pinned = ( !_.isUndefined($scope.nodes[index].pinned) ? $scope.nodes[index].pinned : false);

		if( !_.isUndefined($scope.nodes[index].history) )
		{
			data.history = $scope.nodes[index].history;
		}

		$scope.nodes[index] = data;

		updateActiveNodes();

		return false;
	}

	function updateActiveNodes()
	{
		updateBestBlock();

		$scope.nodesTotal = $scope.nodes.length;

		$scope.nodesActive = _.filter($scope.nodes, function (node) {
			// forkFilter(node);
			return node.stats.active == true;
		}).length;

		$scope.upTimeTotal = _.reduce($scope.nodes, function (total, node) {
			return total + node.stats.uptime;
		}, 0) / $scope.nodes.length;

		$scope.map = _.map($scope.nodes, function (node) {
			var fill = $filter('bubbleClass')(node.stats, $scope.bestBlock);

			if(node.geo != null)
				return {
					radius: 3,
					latitude: node.geo.ll[0],
					longitude: node.geo.ll[1],
					nodeName: node.info.name,
					fillClass: "text-" + fill,
					fillKey: fill,
				};
			else
				return {
					radius: 0,
					latitude: 0,
					longitude: 0
				};
		});

		calculateNodeReputations();
		calculateUncleAnalysis();
	}

	function updateBestBlock()
	{
		if( $scope.nodes.length )
		{
			var chains = {};
			var maxScore = 0;

			// _($scope.nodes)
			// 	.map(function (item)
			// 	{
			// 		maxScore += (item.trusted ? 50 : 1);

			// 		if( _.isUndefined(chains[item.stats.block.number]) )
			// 			chains[item.stats.block.number] = [];

			// 		if( _.isUndefined(chains[item.stats.block.number][item.stats.block.fork]) )
			// 			chains[item.stats.block.number][item.stats.block.fork] = {
			// 				fork: item.stats.block.fork,
			// 				count: 0,
			// 				trusted: 0,
			// 				score: 0
			// 			};

			// 		if(item.stats.block.trusted)
			// 			chains[item.stats.block.number][item.stats.block.fork].trusted++;
			// 		else
			// 			chains[item.stats.block.number][item.stats.block.fork].count++;

			// 		chains[item.stats.block.number][item.stats.block.fork].score = chains[item.stats.block.number][item.stats.block.fork].trusted * 50 + chains[item.stats.block.number][item.stats.block.fork].count;
			// 	})
			// 	.value();

			// $scope.maxScore = maxScore;
			// $scope.chains = _.reduce(chains, function (result, item, key)
			// {
			// 	result[key] = _.max(item, 'score');
			// 	return result;
			// }, {});

			var bestBlock = _.max($scope.nodes, function (node)
			{
				// if( $scope.chains[node.stats.block.number].fork === node.stats.block.fork && $scope.chains[node.stats.block.number].score / $scope.maxScore >= 0.5 )
				// {
					return parseInt(node.stats.block.number);
				// }

				// return 0;
			}).stats.block.number;

			if( bestBlock !== $scope.bestBlock )
			{
				$scope.bestBlock = bestBlock;
				$scope.bestStats = _.max($scope.nodes, function (node) {
					return parseInt(node.stats.block.number);
				}).stats;

				$scope.lastBlock = $scope.bestStats.block.arrived;
				$scope.lastDifficulty = $scope.bestStats.block.difficulty;
			}
		}

		checkForForks();
		calculateGasPrediction();
	}

	// Calculate masternode performance leaderboard
	function calculateMasternodeLeaderboard() {
		if($scope.miners.length === 0) return;

		var masternodes = _.map($scope.miners, function(miner, index) {
			var score = 100 - (index * 10); // Higher rank = higher score
			var badge = 'platinum';
			if(score < 90) badge = 'gold';
			if(score < 80) badge = 'silver';
			if(score < 70) badge = 'bronze';

			return {
				address: miner.miner,
				blocks: miner.blocks,
				score: score,
				badge: badge,
				rank: index + 1
			};
		});

		$scope.masternodes = masternodes;
	}

	// Calculate gas price prediction
	function calculateGasPrediction() {
		if(!$scope.bestStats || !$scope.bestStats.gasPrice) return;

		var currentGas = parseInt($scope.bestStats.gasPrice) || 0;
		var avgGas = 0;
		var gasHistory = [];

		_.forEach($scope.nodes, function(node) {
			if(node.stats && node.stats.gasPrice) {
				gasHistory.push(parseInt(node.stats.gasPrice) || 0);
			}
		});

		if(gasHistory.length > 0) {
			avgGas = Math.round(_.sum(gasHistory) / gasHistory.length);
		}

		var alpha = 0.3;
		var predicted = Math.round(alpha * currentGas + (1 - alpha) * avgGas);

		var trend = 'stable';
		if(predicted > currentGas * 1.1) trend = 'up';
		else if(predicted < currentGas * 0.9) trend = 'down';

		var confidence = Math.min(100, Math.round((gasHistory.length / $scope.nodesActive) * 100));

		$scope.gasPrediction = {
			current: currentGas,
			predicted: predicted,
			trend: trend,
			confidence: confidence
		};
	}

	// Calculate node reputation scores
	function calculateNodeReputations() {
		if($scope.nodes.length === 0) return;

		var reputations = _.map($scope.nodes, function(node) {
			var uptimeScore = (node.stats.uptime || 0);
			var latencyScore = Math.max(0, 100 - (node.stats.latency || 0) / 10);
			var blockScore = node.stats.block && node.stats.block.number >= $scope.bestBlock - 5 ? 100 : 50;
			var peerScore = Math.min(100, (node.stats.peers || 0) * 20);

			var totalScore = Math.round((uptimeScore * 0.4) + (latencyScore * 0.3) + (blockScore * 0.2) + (peerScore * 0.1));

			var badge = 'new';
			if(totalScore >= 90) badge = 'elite';
			else if(totalScore >= 80) badge = 'trusted';
			else if(totalScore >= 60) badge = 'established';

			return {
				id: node.id,
				name: node.info.name || 'Unknown',
				score: totalScore,
				badge: badge,
				uptime: node.stats.uptime || 0,
				latency: node.stats.latency || 0
			};
		});

		$scope.nodeReputations = _.sortByOrder(reputations, 'score', false).slice(0, 10);
	}

	// Calculate uncle rate analysis
	function calculateUncleAnalysis() {
		if(!$scope.miners || $scope.miners.length === 0) return;

		var totalUncles = $scope.uncleCount || 0;
		var totalBlocks = $scope.bestBlock || 1;
		var uncleRate = (totalUncles / totalBlocks) * 100;

		// Calculate uncle rate by miner (simplified)
		var byMiner = _.map($scope.miners, function(miner) {
			// Estimate uncle rate based on block percentage
			var blockShare = miner.blocks / _.sum(_.pluck($scope.miners, 'blocks'));
			var estimatedUncles = Math.round(totalUncles * blockShare);

			return {
				miner: miner.miner,
				blocks: miner.blocks,
				estimatedUncles: estimatedUncles,
				uncleRate: blockShare > 0 ? (estimatedUncles / miner.blocks * 100).toFixed(2) : 0
			};
		});

		$scope.uncleAnalysis = {
			totalUncles: totalUncles,
			uncleRate: uncleRate.toFixed(2),
			avgUnclesPerBlock: (totalUncles / totalBlocks).toFixed(3),
			byMiner: _.sortByOrder(byMiner, 'estimatedUncles', false).slice(0, 5)
		};
	}

	// Calculate staking rewards
	$scope.calculateStaking = function() {
		var voteAmount = parseFloat($scope.stakingCalc.voteAmount) || 0;
		
		// XDC staking formula (simplified)
		// Daily block reward is approximately 5000 XDC
		var dailyBlockReward = 5000;
		var voterShare = 0.5; // 50% distributed to voters
		
		// Assuming average total stake per masternode is 10M XDC
		var avgTotalStake = 10000000;
		var voterRatio = voteAmount / avgTotalStake;
		
		var rewardPerDay = dailyBlockReward * voterShare * voterRatio * 0.98; // 2% fee
		var rewardPerMonth = rewardPerDay * 30;
		var rewardPerYear = rewardPerDay * 365;
		var roi = voteAmount > 0 ? ((rewardPerYear / voteAmount) * 100).toFixed(2) : 0;

		$scope.stakingCalc.rewardPerDay = rewardPerDay.toFixed(2);
		$scope.stakingCalc.rewardPerMonth = rewardPerMonth.toFixed(2);
		$scope.stakingCalc.rewardPerYear = rewardPerYear.toFixed(2);
		$scope.stakingCalc.roi = roi;
	};

	// Initialize staking calculator
	$scope.initStakingCalc = function() {
		$scope.calculateStaking();
	};

	// function forkFilter(node)
	// {
	// 	if( _.isUndefined(node.readable) )
	// 		node.readable = {};

	// 	node.readable.forkClass = 'hidden';
	// 	node.readable.forkMessage = '';

	// 	return true;

	// 	if( $scope.chains[node.stats.block.number].fork === node.stats.block.fork && $scope.chains[node.stats.block.number].score / $scope.maxScore >= 0.5 )
	// 	{
	// 		node.readable.forkClass = 'hidden';
	// 		node.readable.forkMessage = '';

	// 		return true;
	// 	}

	// 	if( $scope.chains[node.stats.block.number].fork !== node.stats.block.fork )
	// 	{
	// 		node.readable.forkClass = 'text-danger';
	// 		node.readable.forkMessage = 'Wrong chain.<br/>This chain is a fork.';

	// 		return false;
	// 	}

	// 	if( $scope.chains[node.stats.block.number].score / $scope.maxScore < 0.5)
	// 	{
	// 		node.readable.forkClass = 'text-warning';
	// 		node.readable.forkMessage = 'May not be main chain.<br/>Waiting for more confirmations.';

	// 		return false;
	// 	}
	// }

	function latencyFilter(node)
	{
		if( _.isUndefined(node.readable) )
			node.readable = {};

		if( _.isUndefined(node.stats) ) {
			node.readable.latencyClass = 'text-danger';
			node.readable.latency = 'offline';
		}

		if (node.stats.active === false)
		{
			node.readable.latencyClass = 'text-danger';
			node.readable.latency = 'offline';
		}
		else
		{
			if (node.stats.latency <= 100)
				node.readable.latencyClass = 'text-success';

			if (node.stats.latency > 100 && node.stats.latency <= 1000)
				node.readable.latencyClass = 'text-warning';

			if (node.stats.latency > 1000)
				node.readable.latencyClass = 'text-danger';

			node.readable.latency = node.stats.latency + ' ms';
		}
	}

	// very simple xss filter
	function xssFilter(obj){
		if(_.isArray(obj)) {
			return _.map(obj, xssFilter);

		} else if(_.isObject(obj)) {
			return _.mapValues(obj, xssFilter);

		} else if(_.isString(obj)) {
			return obj.replace(/\< *\/* *script *>*/gi,'').replace(/javascript/gi,'');
		} else
			return obj;
	}

	// Calculate client version diversity score
	function calculateDiversity() {
		if($scope.nodes.length === 0) return;

		var versionCounts = {};
		var totalNodes = $scope.nodes.length;

		_.forEach($scope.nodes, function(node) {
			var version = node.info.node || 'unknown';
			// Extract just the client/version part (e.g., "Geth/v1.10.0")
			var shortVersion = version.split('/').slice(0, 2).join('/');
			versionCounts[shortVersion] = (versionCounts[shortVersion] || 0) + 1;
		});

		var versions = _.map(versionCounts, function(count, version) {
			return {
				version: version,
				count: count,
				percent: Math.round((count / totalNodes) * 100)
			};
		});

		versions = _.sortByOrder(versions, 'count', false);

		var maxCount = versions.length > 0 ? versions[0].count : 0;
		var maxClientPercent = Math.round((maxCount / totalNodes) * 100);

		// Shannon diversity index calculation (simplified)
		var diversity = 0;
		_.forEach(versionCounts, function(count) {
			var p = count / totalNodes;
			diversity -= p * Math.log2(p);
		});

		var maxDiversity = Math.log2(_.keys(versionCounts).length || 1);
		var score = maxDiversity > 0 ? Math.round((diversity / maxDiversity) * 100) : 100;

		var status = 'excellent';
		if(maxClientPercent > 66) status = 'danger';
		else if(maxClientPercent > 50) status = 'warning';
		else if(maxClientPercent > 33) status = 'good';

		$scope.diversity = {
			score: score,
			versions: versions,
			totalNodes: totalNodes,
			maxClientPercent: maxClientPercent,
			status: status
		};

		// Calculate upgrade readiness
		var upgradedNodes = _.filter($scope.nodes, function(node) {
			var version = node.info.node || '';
			return version.indexOf('v1.0') >= 0 || version.indexOf('v1.1') >= 0 || version.indexOf('v1.2') >= 0;
		}).length;

		$scope.upgradeReadiness = {
			targetVersion: 'v1.0.x',
			currentVersion: 'v0.9.x',
			adoptionRate: Math.round((upgradedNodes / totalNodes) * 100),
			totalNodes: totalNodes,
			upgradedNodes: upgradedNodes,
			status: upgradedNodes / totalNodes >= 0.75 ? 'ready' : 'pending'
		};
	}

	// Check for network forks
	function checkForForks() {
		if($scope.nodes.length === 0) return;

		var blockHashes = {};
		var bestBlock = $scope.bestBlock;

		_.forEach($scope.nodes, function(node) {
			if(node.stats.block.number === bestBlock) {
				var hash = node.stats.block.hash;
				blockHashes[hash] = (blockHashes[hash] || 0) + 1;
			}
		});

		var hashCount = _.keys(blockHashes).length;
		var isForked = hashCount > 1;

		$scope.forkStatus = {
			isForked: isForked,
			hashCount: hashCount,
			primaryHash: _.maxBy(_.keys(blockHashes), function(h) { return blockHashes[h]; }),
			primaryHashCount: _.max(blockHashes),
			consensusPercent: Math.round((_.max(blockHashes) / $scope.nodesActive) * 100) || 0
		};
	}
});