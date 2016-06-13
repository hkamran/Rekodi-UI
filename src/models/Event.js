/**
 * Created by HK on 6/11/2016.
 */
import {Message} from './Message';

export class Event {
    constructor(request, response, startTime, duration, state) {
        this.request = request;
        this.response = response;
        this.startTime = startTime;
        this.duration = duration;
        this.state = state;
    }
}