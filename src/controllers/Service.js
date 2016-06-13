/**
 * Created by HK on 6/10/2016.
 */
import 'whatwg-fetch';
import restful, { fetchBackend } from 'restful.js';
import {Message} from '../models/Message';
import {Request} from '../models/Request';
import {Response} from '../models/Response';
import {Settings} from '../models/Settings';
import {Tape} from '../models/Tape';
import {Event} from '../models/Event';


export class Service {

    constructor(url) {
        this.url = url;
        this.api = restful(url, fetchBackend(fetch));
    }

    getTape(callback) {
        const tapeCollection = this.api.custom ('tape');
        tapeCollection.get().then((tapeEntities) => {
            const tapeEntity = tapeEntities.body();
            const tapeData = tapeEntity.data();

            var tape = Parser.parseTape(tapeData);
            callback(tape);
        });
    }

    getSettings(callback) {
        const settingsCollection = this.api.custom ('settings');
        settingsCollection.get().then((response) => {
            const settingsEntity = response.body();
            const settingsData = settingsEntity.data();

            var settings = Parser.parseSettings(settingsData);
            callback(settings);
        });
    }

    getEvents(callback) {
        const eventCollection = this.api.all('events');
        eventCollection.getAll().then((response) => {
            const eventEntities = response.body();

            eventEntities.forEach((eventEntity) => {
                const eventData = eventEntity.data();

                let request = Parser.parseRequest(eventData.request, eventData.state);
                let response = Parser.parseResponse(eventData.response, eventData.state);
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

    static parseTape(obj) {
        var keys = Object.getOwnPropertyNames(obj);

        var tape = new Tape();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];

            var dataObj = obj[key];
            var request = Parser.parseRequest(dataObj.request, "RECORD");
            var responses = dataObj.responses;

            tape.addRequest(request);
            for (var x = 0; x < responses.length; x++) {
                var responseData = dataObj.responses[x];
                var response = Parser.parseResponse(responseData, "RECORD");
                tape.addResponse(request.id, response);
            }
        }

        return tape;
    }

    static parseSettings(obj) {
        var port = obj["port"];
        var host = obj["host"];
        var state = obj["proxy"];
        var redirect = obj["state"];

        //port, host, state, redirect
        var settings = new Settings(port, host, state, redirect);
        return settings;
    }

    static parseRequest(obj, state) {
        var method = obj["Method"];
        var protocol = obj["Protocol"];
        var uri = obj["URI"];
        var content = obj["content"];
        var matchType =  obj["Match Type"];
        var matchString =  obj["Matched String"];
        var content =  obj["content"];
        var hashCode =  obj["hashCode"];

        //(id, protocol, method, uri, content, matchType, matchString)
        var request = new Request(hashCode, protocol, method, uri, content, matchType, matchString, state);

        return request;
    }

    static parseResponse(obj, state) {
        var hashCode = obj["hashCode"];
        var contentLength = obj["Content-Length"];
        var contentType = obj["Content-Type"];
        var protocol = obj["Protocol"];
        var status = obj["Status"];
        var content = obj["content"];

        //(id, protocol, status, content, contentLength)
        let response = new Response(hashCode, protocol, status, content, contentLength, contentType, state);

        return response;
    }
}
