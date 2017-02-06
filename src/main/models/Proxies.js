/**
 * Created by HK on 7/10/2016.
 */
import {Proxy} from './Proxy';

export class Proxies {

    constructor() {
        this.proxies = {};
    }

    put(id, proxy) {
        this.proxies[id] = proxy;
    }

    remove(id) {
        delete this.proxies[id];
    }

    get(id) {
        return this.proxies[id];
    }

    keySet() {
        return Object.keys(this.proxies);
    }

    contains(id) {
        return id in this.proxies;
    }

    static parseJSON(source) {
        var keys = Object.keys(source);
        var proxies = new Proxies();

        keys.map(function(id) {
            var proxy = Proxy.parseJSON(source[id]);
            proxies.put(id, proxy);
        }.bind(this));

        return proxies;
    }
}