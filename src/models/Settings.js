/**
 * Created by hkamran on 6/13/2016.
 */
import {State} from './Event';

export class Settings {
    constructor(port, host, state, redirect) {
        this.port = port;
        this.host = host;
        this.state = state;
        this.redirect = redirect;
    }

    static parseJSON(source) {
        try {
            console.info("Loading Settings...");

            var host = source["host"];
            var port = source["port"];
            var state = State.valueOf(source["state"]);
            var redirect = source["redirect"];

            console.info("Settings loaded successfully!");

            return new Settings(port, host, state, redirect);

        } catch (err) {
            console.error("Unable to parse settings ", source);
        }
    }

    clone() {
        return new Settings(this.port, this.host, this.state, this.redirect);
    }
}