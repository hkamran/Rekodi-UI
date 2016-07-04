
import React from 'react';
import {render} from 'react-dom';

import {Subnav} from './Subnav';
import {Header} from './Header';
import {Dashboard} from './pages/dashboard/Dashboard';

import {Service} from '../controllers/Service'

import {Request} from '../models/Request';
import {Response} from '../models/Response';
import {Settings} from '../models/Settings';
import {Event, State} from '../models/Event';
import {Tape} from '../models/Tape';
import {Socket} from '../controllers/Socket';
import {Payload} from '../controllers/models/Payload';

export class Main extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            proxy: "default",
            tape: new Tape(),
            message:  null,
            events: {},
            search: "",
            settings: new Settings(80,"", State.PROXY, true)
        };
        //var url = this.restURL = "http://" + location.host + "/rest";
        //this.socket = new Socket("ws://localhost:8090/ws/");
        this.socket = new Socket("ws://" + location.host + "/ws/");
    }

    componentDidMount() {
        this.socket.setHandlerForTapeUpdate(this.handleTapeUpdate.bind(this));
        this.socket.setHandlerForSettingsUpdate(this.handleSettingsUpdate.bind(this));
        this.socket.setHandlerForEventUpdate(this.handleEventUpdate.bind(this));
        this.socket.setHandlerForResponseUpdate(this.handleResponseUpdate.bind(this));
        this.socket.setHandlerForRequestUpdate(this.handleRequestUpdate.bind(this));
        this.socket.start();
    }

    handleTapeUpdate(obj) {
        if (obj instanceof Tape) {
            this.setTapeHandler(obj);
        }
    }

    handleSettingsUpdate(obj) {
        if (obj instanceof Settings) {
            this.setSettingsHandler(obj);
        }
    }

    handleRequestUpdate(obj) {
        var request = obj;
        if (request instanceof Request) {
            var original = this.state.message;
            if (original.id == request.pastID) {
                this.setMessageHandler(request);
            }
        }
    }

    handleResponseUpdate(obj) {
        var response = obj;
        if (response instanceof Response) {
            var original = this.state.message;
            if (original.parent == response.parent && original.id == response.id) {
                this.setMessageHandler(response);
            }
        }
    }

    handleEventUpdate(obj) {
        if (obj instanceof Event) {
            var event = obj;
            console.log(event);
            var request = event.request;
            var response = event.response;

            if (this.state.tape.containsRequest(request.id)) {
                request = this.state.tape.getRequest(request.id);
                event.request = request;
            }

            if (State.cmp(event.state, State.RECORD)) {
                if (response != null) {
                    this.state.tape.addRequest(request);
                    this.state.tape.addResponse(request.id, response);
                }
            }

            this.state.events[event.id] = event;
            this.refreshState();
        }
    }

    clearTapeHandler() {
        var payload = new Payload(Payload.types.TAPE, new Tape().getJSON());
        this.socket.send(payload);
        this.setMessageHandler(null);
    }

    updateMessageHandler(message) {
        if (message instanceof Request) {
            var payload = new Payload(Payload.types.REQUEST, message);
            this.socket.send(payload);
        } else if (message instanceof Response) {
            var payload = new Payload(Payload.types.RESPONSE, message);
            this.socket.send(payload)
        }
    }

    updateSettingsHandler(settings) {
        var payload = new Payload(Payload.types.SETTINGS, settings);
        this.socket.send(payload);
    }

    toggleStateHandler() {
        var settings = this.state.settings.clone();

        if (State.cmp(settings.state, State.PROXY)) {
            settings.state = State.MOCK;
        } else if (State.cmp(settings.state, State.MOCK)) {
            settings.state = State.RECORD;
        } else {
            settings.state = State.PROXY;
        }

        var payload = new Payload(Payload.types.SETTINGS, settings);
        this.socket.send(payload);
    }

    toggleRedirectHandler() {
        var settings = this.state.settings.clone();
        if (settings.redirect) {
            settings.redirect = false;
        } else{
            settings.redirect = true;
        }

        var payload = new Payload(Payload.types.SETTINGS, settings);
        this.socket.send(payload);
    }

    setTapeHandler(tape) {
        this.setState({
            tape: tape
        });
    }

    setSettingsHandler(settings) {
        this.setState({
            settings: settings
        });
    }

    setSearchHandler(search) {
        this.setState({
            search: search
        });
    }

    setProxyHandler(proxyName) {
        this.setState({
            proxy: proxyName
        });
    }

    setMessageHandler(message) {
        this.setState({
            message: message
        });
    }

    setEventsHandler(events) {
        this.setState({
            events: events
        });
    }


    refreshState() {
        this.setState({
            tape: this.state.tape,
            message: this.state.message,
            events: this.state.events,
            search: this.state.search
        });
    }

    render() {
        return (
            <div className="grow height width">
                <Header />
                <div className="breaker"></div>
                <div className="main">
                    <Subnav settings={this.state.settings}
                            toggleStateHandler={this.toggleStateHandler.bind(this)}
                            toggleRedirectHandler={this.toggleRedirectHandler.bind(this)}
                            tape={this.state.tape}
                            updateSettingsHandler={this.updateSettingsHandler.bind(this)}
                    />
                    <div className="container">
                        <div className="content ">
                            <Dashboard tape={this.state.tape}
                                       events={this.state.events}
                                       message={this.state.message}
                                       search={this.state.search}
                                       setMessageHandler={this.setMessageHandler.bind(this)}
                                       setSearchHandler={this.setSearchHandler.bind(this)}
                                       setEventsHandler={this.setEventsHandler.bind(this)}
                                       updateMessageHandler={this.updateMessageHandler.bind(this)}
                                       clearTapeHandler={this.clearTapeHandler.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


