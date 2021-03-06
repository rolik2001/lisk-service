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
const { Logger } = require('lisk-service-framework');
const config = require('../config');
const core = require('./core');

const liskCoreAddress = config.endpoints.liskHttp;
const logger = Logger();

const CORE_DISCOVERY_INTERVAL = 1 * 1000; // ms

// Report the Lisk Core status
let logConnectStatus = true;

const checkStatus = () => new Promise((resolve, reject) => {
	core.getNetworkConstants().then(result => {
		if (typeof result.data === 'object' && result.data.version) {
			core.setCoreVersion(result.data.version);
			core.setReadyStatus(true);
			if (logConnectStatus) {
				logger.info(`Connected to the node ${liskCoreAddress}, Lisk Core version ${result.data.version}`);
				logConnectStatus = false;
			}
			resolve(result.data);
		} else {
			core.setReadyStatus(false);
			logger.warn(`The node ${liskCoreAddress} has an incompatible API or is not available at the moment.`);
			logConnectStatus = true;
			reject();
		}
	}).catch(() => {
		core.setReadyStatus(false);
		logger.warn(`The node ${liskCoreAddress} not available at the moment.`);
		logConnectStatus = true;
		reject();
	});
});

const waitForNode = () => new Promise((resolve) => {
	setInterval(async () => {
		try {
			const result = await checkStatus();
			resolve(result);
		} catch (err) {
			logger.debug('Could not connect with a Lisk Core node (yet)');
		}
	}, CORE_DISCOVERY_INTERVAL);
});

const getStatus = () => logConnectStatus;

module.exports = {
	waitForNode,
	checkStatus,
	getStatus,
};
