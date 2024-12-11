import { exists } from '../runtime.js';

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
        'rpcUrl': !exists(json, 'rpcUrl') ? undefined : json['rpcUrl'],
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

export { NetworkFromJSON, NetworkFromJSONTyped, NetworkToJSON };
