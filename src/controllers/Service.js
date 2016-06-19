/**
 * Created by HK on 6/10/2016.
 */
import 'whatwg-fetch';
import restful, { fetchBackend } from 'restful.js';
import {Request} from '../models/Request';
import {Response} from '../models/Response';
import {Settings} from '../models/Settings';
import {Tape} from '../models/Tape';
import {State, Event} from '../models/Event';
import $ from 'jquery';

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

            var tape = Tape.parseJSON(tapeData);
            console.log(tape);
            callback(tape);
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

        if (settings.state.equals(State.MOCK)) {
            settings.state = "MOCK";
        } else if (settings.state.equals(State.RECORD)) {
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



}
