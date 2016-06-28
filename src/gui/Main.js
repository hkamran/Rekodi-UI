
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

export class Main extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            proxy: "default",
            tape: new Tape(),
            message:  null,
            events: [],
            search: "",
            settings: new Settings(80,"", State.PROXY, true)
        };

        this.restURL = "http://" + location.host + "/rest";
        //this.restURL = "http://localhost:8090/rest";
        this.service = new Service(this.restURL);
        this.service.setFilter(this.state.proxy);
    }

    componentDidMount() {
        this.fetchTape();
        this.fetchEvents();
        this.fetchSettings();
        setInterval(function () {
            this.fetchEvents();
        }.bind(this), 1000);
    }


    fetchTape() {
        this.service.getTape(function(tape){
            this.setTapeHandler(tape);
        }.bind(this));
    }

    fetchSettings() {
        this.service.getSettings(function(settings){
            this.setSettingsHandler(settings);
        }.bind(this));
    }

    fetchEvents() {
        this.service.getEvents(function(event) {
            var request = event.request;
            var response = event.response;


            if (this.state.tape.containsRequest(request.id)) {
                request = this.state.tape.getRequest(request.id);
                event.request = request;
            }

            if (State.cmp(event.state, State.RECORD)) {
                this.state.tape.addRequest(request);
                this.state.tape.addResponse(request.id, response);
            }

            this.state.events.push(event);
            this.refreshState();

        }.bind(this));

    }

    clearTapeHandler() {
        this.service.setTape(new Tape().getJSON(), function(tape) {
            if (tape instanceof Tape) {
                this.fetchTape();
                this.state.message = null;
            }
        }.bind(this));
    }

    updateMessageHandler(message, editor) {
        var content = editor.getValue();
        if (message instanceof Request) {
            message.content = content;
            this.service.setRequest(message, function(request) {
                if (request instanceof Request) {
                    this.state.tape.setRequest(this.state.message.id, request);
                    this.state.message.id = request.id;
                    this.setMessageHandler(request);
                }
            }.bind(this));
        } else if (message instanceof Response) {
            message.content = content;
            this.service.setResponse(message, function(response) {
                if (response instanceof Response) {
                    this.state.message.hashCode = response.hashCode;
                    this.state.tape.getResponses(this.state.message.parent)[this.state.message.id] = response;
                    this.setMessageHandler(response);
                }
            }.bind(this));
        }
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

        this.service.setSettings(settings, function() {
            this.fetchSettings();
        }.bind(this));
    }

    toggleRedirectHandler() {
        var settings = this.state.settings.clone();
        if (settings.redirect) {
            settings.redirect = false;
        } else{
            settings.redirect = true;
        }

        this.service.setSettings(settings, function() {
            this.fetchSettings();
        }.bind(this));
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
        this.service = new Service("http://127.0.0.1:7090/rest/" + this.state.proxy);
    }

    setMessageHandler(message) {
        if (message instanceof Response) {
            if (State.cmp(message.state, State.RECORD)) {
                if (this.state.tape.containsRequest(message.parent)) {
                    var responses = this.state.tape.getResponses(message.parent);
                    if (message.id > responses.length) {
                        message = null;
                    } else {
                        message = responses[message.id];
                    }
                } else {
                    message = null;
                }
            }
        } else if (message instanceof Request) {
            if (State.cmp(message.state, State.RECORD)) {
                if (this.state.tape.containsRequest(message.id)) {
                    message = this.state.tape.getRequest(message.id);
                } else {
                    message = null;
                }
            }
        }

        this.setState({
            message: message
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
                            toggleRedirectHandler={this.toggleRedirectHandler.bind(this)}/>
                    <div className="container">
                        <div className="content ">
                            <Dashboard tape={this.state.tape}
                                       events={this.state.events}
                                       message={this.state.message}
                                       search={this.state.search}
                                       setMessageHandler={this.setMessageHandler.bind(this)}
                                       setSearchHandler={this.setSearchHandler.bind(this)}
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


