/**
 * Created by hkamran on 6/29/2016.
 */
import {Payload} from '../controllers/models/Payload';

export class Socket {

    constructor(url) {
        this.url = url;
    }

    start() {
        this.socket = new WebSocket(this.url);
        this.socket.onmessage = this._onMessage.bind(this);
        this.socket.onclose = this._onClose.bind(this);
        this.socket.onopen = this._onOpen.bind(this);
        this.socket.onerror = this._onError.bind(this);

    }

    setHandlerForTapeUpdate(callback) {
        this.tapeUpdateHandler = callback;
    }

    setHandlerForFilterUpdate(callback) {
        this.filterUpdateHandler = callback;
    }

    setHandlerForEventUpdate(callback) {
        this.eventUpdateHandler = callback;
    }

    setHandlerForRequestUpdate(callback) {
        this.requestUpdateHandler = callback;
    }

    setHandlerForResponseUpdate(callback) {
        this.responseUpdateHandler = callback;
    }

    setHandlerForProxyUpdate(callback) {
        this.proxyUpdateHandler = callback;
    }

    setHandlerForProxyInsert(callback) {
        this.proxyInsertHandler = callback;
    }

    setHandlerForProxyDelete(callback) {
        this.proxyDeleteHandler = callback;
    }

    setHandlerForProxiesUpdate(callback) {
        this.proxiesUpdateHandler = callback;
    }

    send(event) {
        if (event instanceof Payload) {
            this.socket.send(JSON.stringify(event));
            return;
        }
        console.error("Cannot send to server obj is not of type Event");
    }

    _onMessage(message) {
        console.info("Receiving a message from server.")
        var payload = Payload.parseMessage(message);
        if (Payload.types.cmp(payload.type, Payload.types.TAPE)) {
            this.tapeUpdateHandler(payload);
        } else if (Payload.types.cmp(payload.type, Payload.types.FILTER)) {
            this.filterUpdateHandler(payload);
        } else if (Payload.types.cmp(payload.type, Payload.types.EVENT)) {
            this.eventUpdateHandler(payload);
        } else if (Payload.types.cmp(payload.type, Payload.types.REQUEST)) {
            this.requestUpdateHandler(payload);
        } else if (Payload.types.cmp(payload.type, Payload.types.RESPONSE)) {
            this.responseUpdateHandler(payload);
        } else if (Payload.types.cmp(payload.type, Payload.types.PROXY)) {

            if (Payload.actions.cmp(payload.action, Payload.actions.UPDATE)) {
                this.proxyUpdateHandler(payload);
            } else if (Payload.actions.cmp(payload.action, Payload.actions.DELETE)) {
                this.proxyDeleteHandler(payload);
            } else if (Payload.actions.cmp(payload.action, Payload.actions.INSERT)) {
                this.proxyInsertHandler(payload);
            }

        } else if (Payload.types.cmp(payload.type, Payload.types.PROXIES)) {
            this.proxiesUpdateHandler(payload);
        } else {
            console.error("Can't read payload", payload);
            //BLAH
        }
    }

    _onClose(event) {
        console.info("Closed WS to " + this.url);
        console.info("Resetting...");
        this.start();
    }

    _onOpen(event) {
        console.info("Connect WS to " + this.url);
    }

    _onError(event) {
        console.info("Error from WS", event);
    }

}

