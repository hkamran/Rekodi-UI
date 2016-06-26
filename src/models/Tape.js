/**
 * Created by HK on 6/10/2016.
 */
import React from 'react';
import {render} from 'react-dom';
import {State} from './Event';
import {Request} from './Request';
import {Response} from './Response';

export class Tape {
    constructor() {
        this.requests = {};
    }

    getRequest(hashCode) {
        return this.requests[hashCode].request;
    }

    containsRequest(hashCode) {
        if (typeof this.requests[hashCode] === 'undefined') {
            return false;
        }
        return true;
    }

    setRequest(hashCode, request) {
        var responses = this.requests[hashCode].responses;
        for (var response of responses) {
            response.parent = request.id;
        }
        delete this.requests[hashCode];
        this.requests[request.id] = {
            request: request,
            responses: responses
        };

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

    static parseJSON(source) {
        console.info("Loading Tape...");
        var keys = Object.getOwnPropertyNames(source);

        var tape = new Tape();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];

            var dataObj = source[key];
            var request = Request.parseJSON(dataObj.request, new State(State.RECORD));
            var responses = dataObj.responses;

            tape.addRequest(request);
            for (var x = 0; x < responses.length; x++) {
                var responseData = dataObj.responses[x];
                var response = Response.parseJSON(responseData, new State(State.RECORD));
                tape.addResponse(request.id, response);

            }
        }

        console.info("Tape loaded successfully!");
        return tape;
    }

    getJSON() {
        return this.requests;
    }
}