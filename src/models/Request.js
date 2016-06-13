/**
 * Created by hkamran on 6/10/2016.
 */
import React from 'react';
import {render} from 'react-dom';

export class Request {
    constructor(id, protocol, method, uri, content, matchType, matchString, state) {
        this.id = id;
        this.protocol = protocol;
        this.method = method;
        this.uri = uri;
        this.content = content;
        this.matchType = matchType;
        this.matchString = matchString;
        this.state = state;
    }
}
