/**
 * Created by hkamran on 6/13/2016.
 */
import {State} from './Event';

export class Filter {
    constructor(port, host, state, redirect) {
        this.port = port;
        this.host = host;
        this.state = state;
        this.redirect = redirect;
    }

    static parseJSON(source) {
        try {
            var host = source["host"];
            var port = source["port"];
            var state = State.valueOf(source["state"]);
            var redirect = source["redirect"];


            return new Filter(port, host, state, redirect);

        } catch (err) {
            console.error("Unable to parse settings ", source);
        }
    }

    clone() {
        return new Filter(this.port, this.host, this.state, this.redirect);
    }
}