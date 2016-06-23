/**
 * Created by hkamran on 6/10/2016.
 */
import React from 'react';
import {render} from 'react-dom';

export class Request {
    constructor(id, protocol, method, uri, content, headers, matchType, matchString, state) {
        this.id = id;
        this.protocol = protocol;
        this.method = method;
        this.uri = uri;
        this.content = content;
        this.matchType = matchType;
        this.matchString = matchString;
        this.state = state;
        this.headers = headers;
    }

    static parseJSON(source, state) {
        var id = source["id"];
        var protocol = source["protocol"];
        var method = source["method"];
        var uri = source["uri"];
        var content = source["content"];
        var headers = source["headers"];
        var matchType = source["matchType"];
        var matchString = source["matchString"];

        return new Request(id, protocol, method, uri, content, headers, matchType, matchString, state);
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
            this.matchType,
            this.matchString,
            this.state);
    }

}
