/**
 * Created by HK on 6/11/2016.
 */
import {Request} from './Request';
import {Response} from './Response';

export class State {

    constructor(val) {
        this.state = val;
    }

    equals(obj) {
        if (obj instanceof State) {
            if (obj.state == this.state) {
                return true;
            }
            return false;
        }

        if (this.state == obj) {
            return true;
        }
        return false;
    }

    static valueOf(source) {

        if (source.localeCompare("RECORD") == 0) {
            return new State(State.RECORD);
        } else if (source.localeCompare("PROXY") == 0) {
            return new State(State.PROXY);
        } else if (source.localeCompare("MOCK") == 0) {
            return new State(State.MOCK);
        } else {
            asdasdasdasdasd.asdasdasd;
        }
    }
}

State.RECORD = 1;
State.PROXY = 2;
State.MOCK = 3;

export class Event {

    constructor(request, response, startTime, duration, state) {
        this.request = request;
        this.response = response;
        this.startTime = startTime;
        this.duration = duration;
        this.state = state;
    }

    static parseJSON(source, state) {
        var stateObj = State.valueOf(state);
        var request = Request.parseJSON(source.request, stateObj);
        var response = Response.parseJSON(source.response), stateObj;
        var duration = source.duration;
        var startTime = source.start;

        return new Event(request, response, startTime, duration, stateObj);
    }
}