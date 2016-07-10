/**
 * Created by HK on 7/1/2016.
 */
import {Request} from '../../models/Request';
import {Response} from '../../models/Response';
import {Filter} from '../../models/Filter';
import {Proxies} from '../../models/Proxies';
import {Proxy} from '../../models/Proxy';
import {Event, State} from '../../models/Event';
import {Tape} from '../../models/Tape';

export class Payload {

    constructor(id, action, type, message) {
        this.message = message;
        this.type = type;
        this.id = id;
        this.action = action;
    }

    static parseMessage(source) {
        var message;
        var type;
        var id;
        var action;
        try {
            var payload = JSON.parse(source.data);
            console.log(payload);
            message = payload.message;
            type = Payload.types.valueOf(payload.type);
            action = Payload.actions.valueOf(payload.action);
            id = payload.id;

            var obj = {};
            if (Payload.types.cmp(type, Payload.types.EVENT)) {
                obj = Event.parseJSON(message);
            } else if (Payload.types.cmp(type, Payload.types.TAPE)) {
                obj = Tape.parseJSON(message);
            } else if (Payload.types.cmp(type, Payload.types.FILTER)) {
                obj = Filter.parseJSON(message);
            } else if (Payload.types.cmp(type, Payload.types.REQUEST)) {
                obj = Request.parseJSON(message);
            } else if (Payload.types.cmp(type, Payload.types.RESPONSE)) {
                obj = Response.parseJSON(message);
            } else if (Payload.types.cmp(type, Payload.types.PROXY)) {
                obj = Proxy.parseJSON(message);
            } else if (Payload.types.cmp(type, Payload.types.PROXIES)) {
                obj = Proxies.parseJSON(message);
            } else {
                console.error("Unknown payload type", payload);
            }

            return new Payload(id, action, type, obj);
        } catch (err) {
            console.error("Cannot Parse Payload!", err);
            message = {};
            id = 0;
            type = Event.NONE;
            action = Payload.actions.NONE;
            return new Payload(id, action, type, message);
        }
    }

}

Payload.types = {
    valueOf : function(source) {
        if (source.localeCompare(Payload.types.TAPE) == 0) {
            return Payload.types.TAPE;
        } else if (source.localeCompare(Payload.types.FILTER) == 0) {
            return Payload.types.FILTER;
        } else if (source.localeCompare(Payload.types.EVENT) == 0) {
            return Payload.types.EVENT;
        } else if (source.localeCompare(Payload.types.REQUEST) == 0) {
            return Payload.types.REQUEST;
        } else if (source.localeCompare(Payload.types.RESPONSE) == 0) {
            return Payload.types.RESPONSE;
        } else if (source.localeCompare(Payload.types.PROXY) == 0) {
            return Payload.types.PROXY;
        } else if (source.localeCompare(Payload.types.PROXIES) == 0) {
            return Payload.types.PROXIES;
        } else {
            console.error("Unknown payload type " + source);
            return Payload.types.NONE;
        }
    },

    cmp : function(a, b) {
        return (a.localeCompare(b) == 0);
    }
};

Payload.types.TAPE = "TAPE";
Payload.types.FILTER = "FILTER";
Payload.types.EVENT = "EVENT";
Payload.types.REQUEST = "REQUEST";
Payload.types.RESPONSE = "RESPONSE";
Payload.types.NONE = "NONE";
Payload.types.PROXY = "PROXY";
Payload.types.PROXIES = "PROXIES";

Payload.actions = {
    valueOf : function(source) {
        if (source.localeCompare(Payload.actions.INSERT) == 0) {
            return Payload.actions.INSERT;
        } else if (source.localeCompare(Payload.actions.DELETE) == 0) {
            return Payload.actions.DELETE;
        } else if (source.localeCompare(Payload.actions.UPDATE) == 0) {
            return Payload.actions.UPDATE;
        } else {
            console.error("Unknown payload action " + source);
            return Payload.actions.NONE;
        }
    },

    cmp : function(a, b) {
        return (a.localeCompare(b) == 0);
    }
};

Payload.actions.INSERT = "INSERT";
Payload.actions.DELETE = "DELETE";
Payload.actions.UPDATE = "UPDATE";
Payload.actions.NONE = "NONE";