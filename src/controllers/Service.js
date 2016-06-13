/**
 * Created by HK on 6/10/2016.
 */
import 'whatwg-fetch';
import restful, { fetchBackend } from 'restful.js';
import {Message} from '../models/Message';
import {Request} from '../models/Request';
import {Response} from '../models/Response';

import {Event} from '../models/Event';


export class Service {

    constructor(url) {
        this.url = url;
        this.api = restful(url, fetchBackend(fetch));
    }

    getEvents(callback) {
        const eventCollection = this.api.all('events');
        eventCollection.getAll().then((response) => {
            const eventEntities = response.body();

            eventEntities.forEach((eventEntity) => {
                const eventData = eventEntity.data();

                let request = Parser.parseRequest(eventData.request);
                let response = Parser.parseResponse(eventData.response);
                let duration = eventData.duration;
                let startTime = eventData.start;
                let state = eventData.state;

                let  event = new Event(request, response, startTime, duration, state);

                callback(event);
            })
        });
    }

    getRequest(request, callback) {
        this.api.one('request', request.hashCode).get().then((response) => {
            const requestEntity = response.body();
            const request = requestEntity.data();

            callback(request);
        })
    }

    getResponse(request, response) {
        this.api.one('request', request.hashCode).one('response', response.index).get().then((response) => {
            const requestEntity = response.body();
            const request = requestEntity.data();

            callback(request);
        })
    }

}

class Parser {

    static parseRequest(obj) {
        var method = obj["Method"];
        var protocol = obj["Protocol"];
        var uri = obj["URI"];
        var content = obj["content"];
        var matchType =  obj["Match Type"];
        var matchString =  obj["Matched String"];
        var content =  obj["content"];
        var hashCode =  obj["hashCode"];

        //(id, protocol, method, uri, content, matchType, matchString)
        var request = new Request(hashCode, protocol, method, uri, content, matchType, matchString);

        return request;
    }

    static parseResponse(obj) {
        var hashCode = obj["hashCode"];
        var contentLength = obj["Content-Length"];
        var contentType = obj["Content-Type"];
        var protocol = obj["Protocol"];
        var status = obj["Status"];
        var content = obj["content"];

        //(id, protocol, status, content, contentLength)
        let response = new Response(hashCode, protocol, status, content, contentLength, contentType);

        return response;
    }
}
