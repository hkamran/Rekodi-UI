/**
 * Created by HK on 6/11/2016.
 */
import {Request} from './Request';
import {Response} from './Response';

export class State {

    static valueOf(source) {

        if (source.localeCompare("RECORD") == 0) {
            return State.RECORD;
        } else if (source.localeCompare("PROXY") == 0) {
            return State.PROXY;
        } else {
            //(source.localeCompare("MOCK") == 0)
            return State.MOCK;
        }
    }

    static cmp(a, b) {


        if (a.localeCompare(b) == 0) {
            return true;
        }
        return false;
    }
}

State.RECORD = "RECORD";
State.PROXY = "PROXY";
State.MOCK = "MOCK";

export class Event {

    constructor(id, request, response, startTime, duration, state) {
        this.id = id;
        this.request = request;
        this.response = response;
        this.startTime = startTime;
        this.duration = duration;
        this.state = state;
        this.viewed = false;
    }

    static parseJSON(source) {
        console.log(source);
        var id = source.id;
        var stateObj = State.valueOf(source.state);
        var request = Request.parseJSON(source.request);
        var response = null;
        if (Object.keys(source.response).length > 0) {
            response = Response.parseJSON(source.response);
        }
        var duration = source.duration;
        var startTime = source.start;

        return new Event(id, request, response, startTime, duration, stateObj);
    }
}