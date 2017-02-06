/**
 * Created by HK on 6/10/2016.
 */
import 'whatwg-fetch';
import restful, { fetchBackend } from 'restful.js';
import {Request} from '../models/Request';
import {Response} from '../models/Response';
import {Settings} from '../models/Filter';
import {Tape} from '../models/Tape';
import {State, Event} from '../models/Event';
import $ from 'jquery';

export class Service {

    constructor(home) {
        this.base = home;
    }

    setFilter(name) {
        this.url = this.base + "/" + name;
        this.api = restful(this.url, fetchBackend(fetch));
    }

    getTape(callback) {
        const tapeCollection = this.api.custom ('tape');
        tapeCollection.get().then((tapeEntities) => {
            const tapeEntity = tapeEntities.body();
            const tapeData = tapeEntity.data();

            var tape = Tape.parseJSON(tapeData);
            console.log(tape);
            callback(tape);
        });
    }

    getRequest(id, callback) {
        const requestCollection = this.api.custom ('tape').custom(id);
        requestCollection.get().then((response) => {
            const requestEntity = response.body();
            const requestData = requestEntity.data();

            var request = Request.parseJSON(requestData);
            console.log(request);
            callback(request);
        });
    }

    getSettings(callback) {
        const settingsCollection = this.api.custom ('/');
        settingsCollection.get().then((response) => {
            const settingsEntity = response.body();
            const settingsData = settingsEntity.data();

            var settings = Settings.parseJSON(settingsData);
            console.log(settings);
            callback(settings);
        });
    }

    getEvents(callback) {
        const eventCollection = this.api.all('events');
        eventCollection.getAll().then((response) => {
            const eventEntities = response.body();

            eventEntities.forEach((eventEntity) => {
                const eventData = eventEntity.data();

                let state = eventData.state;

                var event = Event.parseJSON(eventData, state);
                callback(event);
            })
        });
    }

    setSettings(settings, callback) {
        console.log(settings);

        if (State.cmp(settings.state, State.MOCK)) {
            settings.state = "MOCK";
        } else if (State.cmp(settings.state, State.RECORD)) {
            settings.state = "RECORD";
        } else {
            settings.state = "PROXY";
        }

        $.ajax({
            url: this.url + "/settings",
            type: 'POST',
            crossDomain: true,
            headers: {
                "Accept" : "application/json; charset=utf-8",
                "Content-Type": "application/json; charset=utf-8",
            },
            data: JSON.stringify(settings),

            complete: function (jqXHR) {
                callback();
            }
        });
    }

    setTape(tape, callback) {
        $.ajax({
            url: this.url + "/tape/",
            type: 'POST',
            crossDomain: true,
            headers: {
                "Accept": "application/json; charset=utf-8",
                "Content-Type": "application/json; charset=utf-8",
            },
            data: JSON.stringify(tape),
        }).done(function (data) {
                var tape = Tape.parseJSON(data);
                callback(tape)
        })
        .fail(function () {
            callback(null)
        });
    }

    setRequest(request, callback) {
        $.ajax({
            url: this.url + "/tape/" + request.id,
            type: 'POST',
            crossDomain: true,
            headers: {
                "Accept": "application/json; charset=utf-8",
                "Content-Type": "application/json; charset=utf-8",
            },
            data: JSON.stringify(request),
        }).done(function (data) {
                var request = Request.parseJSON(data);
                callback(request)
        })
        .fail(function () {
            callback(null)
        });
    }

    setResponse(response, callback) {
        $.ajax({
            url: this.url + "/tape/" + response.parent + "/" + response.id,
            type: 'POST',
            crossDomain: true,
            headers: {
                "Accept": "application/json; charset=utf-8",
                "Content-Type": "application/json; charset=utf-8",
            },
            data: JSON.stringify(response),
        }).done(function (data) {
                var response = Response.parseJSON(data);
                callback(response)
            })
            .fail(function () {
                callback(null)
            });
    }

}
