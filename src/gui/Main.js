
import React from 'react';
import {render} from 'react-dom';

import {Subnav} from './Subnav';
import {Header} from './Header';
import {Dashboard} from './pages/dashboard/Dashboard';

import {Service} from '../controllers/Service'

import {Request} from '../models/Request';
import {Response} from '../models/Response';
import {Event} from '../models/Event';
import {Tape} from '../models/Tape';

export class Main extends React.Component {

    constructor(props) {
        super(props);

        this.service = new Service("http://127.0.0.1:7090/rest");
        this.state = {
            tape: new Tape(),
            message:  new Response(1, "", "", "", "", ""),
            events: [],
            search: ""
        };
    }

    fetchEvents() {
        this.service.getEvents(function(event) {
            let request = event.request;
            let response = event.response;

            if (event.state == "RECORD") {
                this.state.tape.addRequest(event.request);
                this.state.tape.addResponse(request.id, response);
            }

            this.state.events.push(event);
            this.refreshState();

        }.bind(this));

    }

    componentDidMount() {
        this.fetchEvents();
        setInterval(function () {
            this.fetchEvents();
        }.bind(this), 1000);
    }

    setMessageHandler(message) {
        this.setState({
            tape: this.state.tape,
            message: message,
            events: this.state.events,
            search: this.state.search
        });
    }

    setTapeHandler(tape) {
        this.setState({
            tape: tape,
            message: this.state.message,
            events: this.state.events,
            search: this.state.search
        });
    }

    setEventsHandler(events) {
        this.setState({
            tape: this.state.tape,
            message: this.state.message,
            events: events,
            search: this.state.search
        });
    }

    setSearchHandler(search) {
        this.setState({
            tape: this.state.tape,
            message: this.state.message,
            events: this.state.events,
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
                    <Subnav />
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


