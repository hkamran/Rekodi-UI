/**
 * Created by hkamran on 6/29/2016.
 */

export class Event {

    constructor(message, type) {
        this.message = message;
        this.type = type;
    }

    static parseMessage(source) {
        var message;
        var type;
        try {
            var payload = JSON.parse(source);
            message = payload.message;
            type = Event.types.valueOf(payload.type);
            return new Event(message, type);
        } catch (err) {
            console.error("Cannot Parse Event Payload!", err);
            message = {};
            type = Event.NONE;
            return new Event(message, type);
        }
    }

}

Event.types = {
     valueOf : function(source) {
        if (source.localeCompare(Event.types.TAPE) == 0) {
            return Event.types.TAPE;
        } else if (source.localeCompare(Event.types.SETTINGS) == 0) {
            return Event.types.SETTINGS;
        } else if (source.localeCompare(Event.types.MESSAGE) == 0) {
            return Event.types.MESSAGE;
        } else {
            return Event.types.NONE;
        }
    },

    cmp : function(a, b) {
        return (a.localeCompare(b) == 0);
    }
};

Event.types.TAPE = "TAPE";
Event.types.SETTINGS = "SETTINGS";
Event.types.MESSAGE = "EVENT";
Event.types.NONE = "NONE";

export class WebSocket {

    constructor(url) {
        this.url = url;
        this.socket = new WebSocket(url);

        this.socket.onmessage = this._onMessage.bind(this);
        this.socket.onclose = this._onClose.bind(this);
        this.socket.onopen = this._onOpen.bind(this);
        this.socket.onerror = this._onError.bind(this);

        this.setHandlerForEventUpdate(function (event) {
            console.log("Handling Event Update");
            console.log(event);
        });

        this.setHandlerForSettingsUpdate(function(event) {
            console.log("Handling Settings Update");
            console.log(event);
        });

        this.setHandlerForTapeUpdate(function(event) {
            console.log("Handling Tape Update");
            console.log(event);
        })

    }

    _onMessage(message) {
        console.info("Receiving a message from server.")
        var event = Event.parseMessage(message);
        if (Event.types.cmp(event.type, Event.types.TAPE)) {
            this.tapeUpdateHandler(event.message);
        } else if (Event.types.cmp(event.type, Event.types.SETTINGS)) {
            this.settingsUpdateHandler(event.message);
        } else if (Event.types.cmp(event.type, Event.types.MESSAGE)) {
            this.eventUpdateHandler(event.message);
        } else {
            //BLAH
        }
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

    send(event) {
        if (event instanceof Event) {
            this.socket.send(event);
            return;
        }
        console.error("Cannot send to server obj is not of type Event");
    }

    _onClose(event) {
        console.info("Closed WS to " + this.url);
    }

    _onOpen(event) {
        console.info("Connect WS to " + this.url);
    }

    _onError(event) {
        console.info("Error from WS", event);
    }

}