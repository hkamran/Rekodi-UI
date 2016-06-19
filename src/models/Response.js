/**
 * Created by HK on 6/12/2016.
 */
import React from 'react';
import {render} from 'react-dom';

export class Response {
    constructor(id, protocol, status, content, headers, state, hashCode) {
        this.id = id;
        this.protocol = protocol;
        this.status = status;
        this.content = content;
        this.state = state;
        this.hashCode = hashCode;
        this.headers = headers;
    }

    static parseJSON(source, state) {

        var status = source["status"];
        var protocol = source["protocol"];
        var content = source["content"];
        var hashCode = source["hashCode"];
        var headers = source["headers"];
        var id = source["id"];

        return new Response(id, protocol, status, content, headers, state, hashCode);
    }
}
