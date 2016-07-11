/**
 * Created by HK on 7/10/2016.
 */

import {Request} from './Request';
import {Response} from './Response';
import {Proxy} from './Proxy';
import {Filter} from './Filter';
import {Event, State} from './Event';
import {Tape} from './Tape';

export class Window {

    constructor(id) {
        this.id = id;
        this.proxy = new Proxy(0, 9090,"???", "START");
        this.tape = new Tape();
        this.message =   null;
        this.events = {};
        this.search = "";
        this.filter = new Filter(80,"localhost", State.PROXY, true);
    }

    static create(id) {
        return new Window(id);
    }
}