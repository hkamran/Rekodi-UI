/**
 * Created by hkamran on 6/13/2016.
 */
import {State} from './Event';

export class Filter {
    constructor(id, port, host, state, redirect, recordMock) {
        this.id = id;
        this.port = port;
        this.host = host;
        this.state = state;
        this.redirect = redirect;
        this.recordMock = recordMock;
    }

    static parseJSON(source) {
        try {
            var id = source["id"];
            var host = source["host"];
            var port = source["port"];
            var state = State.valueOf(source["state"]);
            var redirect = source["redirect"];
            var recordMock = source["recordMock"];


            return new Filter(id, port, host, state, redirect, recordMock);

        } catch (err) {
            console.error("Unable to parse settings ", source);
        }
    }

    clone() {
        return new Filter(this.id, this.port, this.host, this.state, this.redirect, this.recordMock);
    }
}