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

    setHandlerForSettingsUpdate(callback) {
        this.settingsUpdateHandler = callback;
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

    send(event) {
        if (event instanceof Payload) {
            this.socket.send(JSON.stringify(event));
            return;
        }
        console.error("Cannot send to server obj is not of type Event");
    }

    _onMessage(message) {
        console.info("Receiving a message from server.")
        var event = Payload.parseMessage(message);
        if (Payload.types.cmp(event.type, Payload.types.TAPE)) {
            this.tapeUpdateHandler(event.message);
        } else if (Payload.types.cmp(event.type, Payload.types.SETTINGS)) {
            this.settingsUpdateHandler(event.message);
        } else if (Payload.types.cmp(event.type, Payload.types.EVENT)) {
            this.eventUpdateHandler(event.message);
        } else if (Payload.types.cmp(event.type, Payload.types.REQUEST)) {
            this.requestUpdateHandler(event.message);
        } else if (Payload.types.cmp(event.type, Payload.types.RESPONSE)) {
            this.responseUpdateHandler(event.message);
        } else if (Payload.types.cmp(event.type, Payload.types.PROXY)) {
            this.proxyUpdateHandler(event.message);
        } else {
            console.error("Can't read payload", event);
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

