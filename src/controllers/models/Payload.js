/**
 * Created by HK on 7/1/2016.
 */
import {Request} from '../../models/Request';
import {Response} from '../../models/Response';
import {Settings} from '../../models/Settings';
import {Proxy} from '../../models/Proxy';
import {Event, State} from '../../models/Event';
import {Tape} from '../../models/Tape';

export class Payload {

    constructor(id, type, message) {
        this.message = message;
        this.type = type;
        this.id = id;
    }

    static parseMessage(source) {
        var message;
        var type;
        var id;
        try {
            var payload = JSON.parse(source.data);
            console.log(payload);
            message = payload.message;
            type = Payload.types.valueOf(payload.type);
            id = payload.id;

            var obj = {};
            if (Payload.types.cmp(type, Payload.types.EVENT)) {
                obj = Event.parseJSON(message);
            } else if (Payload.types.cmp(type, Payload.types.TAPE)) {
                obj = Tape.parseJSON(message);
            } else if (Payload.types.cmp(type, Payload.types.SETTINGS)) {
                obj = Settings.parseJSON(message);
            } else if (Payload.types.cmp(type, Payload.types.REQUEST)) {
                obj = Request.parseJSON(message);
            } else if (Payload.types.cmp(type, Payload.types.RESPONSE)) {
                obj = Response.parseJSON(message);
            } else if (Payload.types.cmp(type, Payload.types.PROXY)) {
                obj = Proxy.parseJSON(message);
            } else {
                console.error("Unknown payload type", payload);
            }

            return new Payload(id, type, obj);
        } catch (err) {
            console.error("Cannot Parse Payload!", err);
            message = {};
            id = 0;
            type = Event.NONE;
            return new Payload(id, type, message);
        }
    }

}

Payload.types = {
    valueOf : function(source) {
        if (source.localeCompare(Payload.types.TAPE) == 0) {
            return Payload.types.TAPE;
        } else if (source.localeCompare(Payload.types.SETTINGS) == 0) {
            return Payload.types.SETTINGS;
        } else if (source.localeCompare(Payload.types.EVENT) == 0) {
            return Payload.types.EVENT;
        } else if (source.localeCompare(Payload.types.REQUEST) == 0) {
            return Payload.types.REQUEST;
        } else if (source.localeCompare(Payload.types.RESPONSE) == 0) {
            return Payload.types.RESPONSE;
        } else if (source.localeCompare(Payload.types.PROXY) == 0) {
            return Payload.types.PROXY;
        } else {
            return Payload.types.NONE;
        }
    },

    cmp : function(a, b) {
        return (a.localeCompare(b) == 0);
    }
};

Payload.types.TAPE = "TAPE";
Payload.types.SETTINGS = "SETTINGS";
Payload.types.EVENT = "EVENT";
Payload.types.REQUEST = "REQUEST";
Payload.types.RESPONSE = "RESPONSE";
Payload.types.NONE = "NONE";
Payload.types.PROXY = "PROXY";