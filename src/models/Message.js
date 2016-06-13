/**
 * Created by hkamran on 6/10/2016.
 */
import React from 'react';
import {render} from 'react-dom';

export class Message {
    constructor(id, headers, content) {
        this.settings = {
            matchType : "",
            matchString :""
        };
        this.headers = headers;
        this.content = content;

        this.id = id;
    }

    setSettings(matchType, matchString) {
        this.settings.matchType = matchType;
        this.settings.matchString = matchString;
    }

}
