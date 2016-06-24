
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
            message:  new Response(-1, "", 100, "", {}, State.valueOf("PROXY"), ""),
            events: [],
            search: "",
            settings: new Settings(80,"", new State(State.PROXY), true)
        };

        this.service = new Service("http://127.0.0.1:7090/rest/" + this.state.proxy);
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
            let request = event.request;
            let response = event.response;

            var state;
            if (event.state.equals(State.RECORD)) {
                state = new State(State.RECORD);
                this.state.tape.addRequest(event.request);
                this.state.tape.addResponse(request.id, response);
            } else if (event.state.equals(State.PROXY)) {
                state = new State(State.PROXY);
            } else {
                state = new State(State.MOCK);
            }

            event.request.state = state;
            event.response.state = state;

            this.state.events.push(event);
            this.refreshState();

        }.bind(this));

    }

    componentDidMount() {
        this.fetchTape();
        this.fetchEvents();
        this.fetchSettings();
        setInterval(function () {
            this.fetchEvents();
        }.bind(this), 1000);
    }

    setProxyHandler(proxyName) {
        this.setState({
            proxy: proxyName
        });
        this.service = new Service("http://127.0.0.1:7090/rest/" + this.state.proxy);
    }

    setMessageHandler(message) {

        this.setState({
            message: message
        });
    }

    toggleStateHandler() {
        var settings = this.state.settings.clone();
        if (settings.state.equals(State.PROXY)) {
            settings.state = new State(State.MOCK);
        } else if (settings.state.equals(State.MOCK)) {
            settings.state = new State(State.RECORD);
        } else {
            settings.state = new State(State.PROXY);
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

    setEventsHandler(events) {
        this.setState({
            events: events
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
                                       setSearchHandler={this.setSearchHandler.bind(this)} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


