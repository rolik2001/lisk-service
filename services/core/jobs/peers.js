/*
 * LiskHQ/lisk-service
 * Copyright © 2020 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */
const logger = require('lisk-service-framework').Logger();

const peerCache = require('./services/peerCache');
const core = require('./services/core');

module.exports = [
	{
		name: 'refresh.peers',
		description: 'Keep the peer list up-to-date',
		schedule: '* * * * *', // Every 1 min
		// * TODO: Update when service-framework receives support for interval-based schedule
		// schedule: 'interval-based',
		// interval: 45 * 1000, // ms
		updateOnInit: true,
		controller: () => {
			logger.info(`Scheduling peer list reload...`);
			peerCache.reload(core);
		},
	},
];
