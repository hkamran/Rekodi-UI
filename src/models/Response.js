/**
 * Created by HK on 6/12/2016.
 */
import React from 'react';
import {render} from 'react-dom';

export class Response {
    constructor(id, protocol, status, content, contentLength, contentType, state) {
        this.id = id;
        this.protocol = protocol;
        this.status = status;
        this.content = content;
        this.contentLength = contentLength;
        this.contentType = contentType;
        this.state = state;
    }
}
