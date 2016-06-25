/**
 * Created by HK on 6/12/2016.
 */
import React from 'react';
import {render} from 'react-dom';

export class Response {
    constructor(id, protocol, status, content, headers, state, parent, hashCode) {
        this.id = id;
        this.protocol = protocol;
        this.status = status;
        this.content = content;
        this.hashCode = hashCode;
        this.headers = headers;
        this.state = state;
        this.parent = parent;
    }

    static parseJSON(source) {
        var status = source["status"];
        var protocol = source["protocol"];
        var content = source["content"];
        var hashCode = source["hashCode"];
        var headers = source["headers"];
        var id = source["id"];
        var state = source["state"];
        var parent = source["parent"];

        return new Response(id, protocol, status, content, headers, state, parent, hashCode);
    }

    clone() {
        var headers = {};
        Object.keys(this.headers).map(function(key, i) {
            headers[key] = this.headers[key];
        }.bind(this));

        return new Response(this.id,
            this.protocol,
            this.status,
            this.content,
            headers,
            this.state,
            this.parent,
            this.hashCode);
    }
}
