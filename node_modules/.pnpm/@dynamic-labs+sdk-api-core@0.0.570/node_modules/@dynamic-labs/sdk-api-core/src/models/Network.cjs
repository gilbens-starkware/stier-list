'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var runtime = require('../runtime.cjs');

/* tslint:disable */
function NetworkFromJSON(json) {
    return NetworkFromJSONTyped(json);
}
function NetworkFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'networkId': json['networkId'],
        'chainName': json['chainName'],
        'enabled': json['enabled'],
        'rpcUrl': !runtime.exists(json, 'rpcUrl') ? undefined : json['rpcUrl'],
    };
}
function NetworkToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'networkId': value.networkId,
        'chainName': value.chainName,
        'enabled': value.enabled,
        'rpcUrl': value.rpcUrl,
    };
}

exports.NetworkFromJSON = NetworkFromJSON;
exports.NetworkFromJSONTyped = NetworkFromJSONTyped;
exports.NetworkToJSON = NetworkToJSON;
