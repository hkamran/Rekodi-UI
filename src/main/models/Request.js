/**
 * Created by hkamran on 6/10/2016.
 */
import React from 'react';
import {render} from 'react-dom';

export class Request {
    constructor(id, protocol, method, uri, content, headers, state, pastID, matchType, matchString) {
        this.id = id;
        this.protocol = protocol;
        this.method = method;
        this.uri = uri;
        this.content = content;
        this.matchType = matchType;
        this.state = state;
        this.matchString = matchString;
        this.headers = headers;
        this.pastID = pastID;
    }

    static parseJSON(source) {
        var id = source["id"];
        var protocol = source["protocol"];
        var method = source["method"];
        var uri = source["uri"];
        var content = source["content"];
        var headers = source["headers"];
        var state = source["state"];
        var matchType = source["matchType"];
        var matchString = source["matchString"];
        var pastID = source["pastID"];

        return new Request(id, protocol, method, uri, content, headers, state, pastID, matchType, matchString);
    }

    equals(msg) {
        if (msg instanceof Request) {
            if (msg.id == this.id) {
                return true;
            }
        }
        return false;
    }

    clone() {
        var headers = {};
        Object.keys(this.headers).map(function(key, i) {
            headers[key] = this.headers[key];
        }.bind(this));

        return new Request(this.id,
            this.protocol,
            this.method,
            this.uri,
            this.content,
            headers,
            this.state,
            this.pastID,
            this.matchType,
            this.matchString);
    }

}
