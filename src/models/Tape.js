/**
 * Created by HK on 6/10/2016.
 */
import React from 'react';
import {render} from 'react-dom';
import {Message} from './Message';

export class Tape {
    constructor() {
        this.requests = {};
    }

    getRequest(hashCode) {
        return this.requests[hashCode].request;
    }

    addRequest(request) {
        var key = this.requests[request.id];
        if (typeof key === 'undefined') {
            this.requests[request.id] = {
                request: request,
                responses: []
            };
        } else {
            return;
        }
    }

    getRequests() {
        return Object.getOwnPropertyNames(this.requests);
    }

    getResponses(id) {
        var obj = this.requests[id];
        if (typeof obj === 'undefined') {
            return [];
        } else {
            return obj.responses;
        }
    }

    addResponse(id, response) {
        var val = this.requests[id];

        if (typeof val === 'undefined') {
        } else {
            this.requests[id].responses.push(response);
        }
    }
}