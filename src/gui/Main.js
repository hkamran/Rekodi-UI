
import React from 'react';
import {render} from 'react-dom';

import {Subnav} from './Subnav';
import {Header} from './Header';
import {Dashboard} from './pages/dashboard/Dashboard';

import {Service} from '../controllers/Service'

import {Request} from '../models/Request';
import {Response} from '../models/Response';
import {Proxy} from '../models/Proxy';
import {Proxies} from '../models/Proxies';
import {Filter} from '../models/Filter';
import {Window} from '../models/Window';
import {Event, State} from '../models/Event';
import {Tape} from '../models/Tape';
import {Socket} from '../controllers/Socket';
import {Payload} from '../controllers/models/Payload';

export class Main extends React.Component {

    constructor(props) {
        super(props);

        var windows = {0: Window.create()};
        var proxies = new Proxies();
        var proxy = new Proxy(0, 9090,"???", "START");
        proxies.put(0, proxy);

        this.state = {
            windows: windows,
            proxies: proxies,
            selectedWindow: 0,
        };
        //var url = this.restURL = "http://" + location.host + "/rest";
        this.socket = new Socket("ws://localhost:8090/ws/");
        //this.socket = new Socket("ws://" + location.host + "/ws/");
    }

    componentDidMount() {
        this.socket.setHandlerForTapeUpdate(this.handleTapeUpdate.bind(this));
        this.socket.setHandlerForFilterUpdate(this.handleFilterUpdate.bind(this));
        this.socket.setHandlerForEventUpdate(this.handleEventUpdate.bind(this));
        this.socket.setHandlerForResponseUpdate(this.handleResponseUpdate.bind(this));
        this.socket.setHandlerForRequestUpdate(this.handleRequestUpdate.bind(this));
        this.socket.setHandlerForProxyUpdate(this.handleProxyUpdate.bind(this));
        this.socket.setHandlerForProxyDelete(this.handleProxyDelete.bind(this));
        this.socket.setHandlerForProxyInsert(this.handleProxyInsert.bind(this));
        this.socket.setHandlerForProxiesUpdate(this.handleProxiesUpdate.bind(this));
        this.socket.start();
    }

    setSelectedWindow(id) {
        console.log("SETTING TO " + id);
        this.setState({
            selectedWindow: id
        });
    }

    getSelectedWindow() {
        if (this.state.selectedWindow in this.state.windows) {
            return this.state.windows[this.state.selectedWindow];
        }
        console.error("Unable to find window information for " + this.state.selectedWindow);
        console.log(this.state.windows);
    }

    handleProxiesUpdate(obj) {
        if (obj instanceof Proxies) {
            var proxies = obj;
            proxies.keySet().map(function(id) {
               if (!(id in this.state.windows)) {
                    this.state.windows[id] = Window.create();
               }
            }.bind(this));

            this.setState({
                proxies : obj
            })
        }
    }

    handleProxyUpdate(obj) {
        if (obj instanceof Proxy) {
            var proxy = obj;
            this.state.proxies.put(proxy.id, proxy);
            this.setState({
                proxies : this.state.proxies
            })
        }
    }

    handleProxyInsert(obj) {
        if (obj instanceof Proxy) {
            var proxy = obj;
            this.state.proxies.put(proxy.id, proxy)
            this.state.windows[proxy.id] = Window.create();

            this.setState({
                proxies : this.state.proxies,
                windows : this.state.windows
            })
        }
    }

    handleProxyDelete(obj) {
        if (obj instanceof Proxy) {
            var proxy = obj;
            this.state.proxies.remove(proxy.id);
            delete this.state.windows[proxy.id];

            var keys = Object.keys(this.state.windows);
            this.state.selectedWindow = keys[keys.length - 1];
            console.log("LOOK " + this.state.selectedWindow);

            this.setState({
                proxies : this.state.proxies,
                windows : this.state.windows,
                selectedWindow : this.state.selectedWindow
            })
        }
    }

    handleTapeUpdate(obj) {
        if (obj instanceof Tape) {
            var tape = obj;
            var window = this.getSelectedWindow();

            window.tape = tape;
            this.setState({
                windows: this.state.windows
            });
        }
    }

    handleFilterUpdate(obj) {
        if (obj instanceof Filter) {
            var filter = obj;
            var window = this.getSelectedWindow();

            window.filter = filter;
            this.setState({
                windows: this.state.windows
            });
        }
    }

    handleRequestUpdate(obj) {
        var request = obj;
        if (request instanceof Request) {
            var window = this.getSelectedWindow();
            var original = window.message;
            if (original.id == request.pastID) {

                window.message = request;
                this.setState({
                    windows: this.state.windows
                });
            }
        }
    }

    handleResponseUpdate(obj) {
        var response = obj;
        if (response instanceof Response) {
            var window = this.getSelectedWindow();
            var original = window.message;
            if (original.parent == response.parent && original.id == response.id) {

                window.message = response;
                this.setState({
                    windows: this.state.windows
                });
            }
        }
    }

    handleEventUpdate(obj) {
        if (obj instanceof Event) {
            var event = obj;
            console.log(event);
            var request = event.request;
            var response = event.response;

            var window = this.getSelectedWindow();
            var tape = window.tape;

            if (tape.containsRequest(request.id)) {
                request = tape.getRequest(request.id);
                event.request = request;
            }

            if (State.cmp(event.state, State.RECORD)) {
                if (response != null) {
                    tape.addRequest(request);
                    tape.addResponse(request.id, response);
                }
            }

            window.events[event.id] = event;
            this.setState({
                windows: this.state.windows
            });
        }
    }

    updateTapeHandler(action, tape) {
        var payload = new Payload(this.state.selectedWindow, action, Payload.types.TAPE, tape.getJSON());
        this.socket.send(payload);
    }

    updateMessageHandler(action, message) {
        if (message instanceof Request) {
            var payload = new Payload(this.state.selectedWindow, action, Payload.types.REQUEST, message);
            this.socket.send(payload);
        } else if (message instanceof Response) {
            var payload = new Payload(this.state.selectedWindow, action, Payload.types.RESPONSE, message);
            this.socket.send(payload)
        }
    }

    updateProxyHandler(action, proxy) {
        var payload = new Payload(proxy.id, action, Payload.types.PROXY, proxy);
        this.socket.send(payload);
    }

    updateFilterHandler(action, filter) {
        var payload = new Payload(this.state.selectedWindow, action, Payload.types.FILTER, filter);
        this.socket.send(payload);
    }

    toggleStateHandler() {
        var window = this.getSelectedWindow();
        var filter = window.filter.clone();

        if (State.cmp(filter.state, State.PROXY)) {
            filter.state = State.MOCK;
        } else if (State.cmp(filter.state, State.MOCK)) {
            filter.state = State.RECORD;
        } else {
            filter.state = State.PROXY;
        }

        this.updateFilterHandler(Payload.actions.UPDATE, filter);
    }

    toggleRedirectHandler() {
        var window = this.getSelectedWindow();
        var filter = window.filter.clone();

        if (filter.redirect) {
            filter.redirect = false;
        } else{
            filter.redirect = true;
        }

        this.updateFilterHandler(Payload.actions.UPDATE, filter);
    }

    setMessageHandler(msg) {
        var window = this.getSelectedWindow();
        window.message = msg;

        this.setState({
            windows: this.state.windows
        })
    }

    setSearchHandler(search) {
        var window = this.getSelectedWindow();
        window.search = search;

        this.setState({
            windows: this.state.windows
        })
    }

    setEventsHandler(events) {
        var window = this.getSelectedWindow();
        window.events = events;

        this.setState({
            windows: this.state.windows
        })
    }

    render() {
        return (
            <div className="grow height width">
                <Header proxies={this.state.proxies.proxies}
                        selectedWindow={this.state.selectedWindow}
                        updateProxyHandler={this.updateProxyHandler.bind(this)}
                        setSelectedWindow={this.setSelectedWindow.bind(this)}
                />
                <div className="breaker"></div>
                <div className="main">
                    <Subnav filter={this.getSelectedWindow().filter}
                            toggleStateHandler={this.toggleStateHandler.bind(this)}
                            toggleRedirectHandler={this.toggleRedirectHandler.bind(this)}
                            tape={this.getSelectedWindow().tape}
                            updateFilterHandler={this.updateFilterHandler.bind(this)}
                    />
                    <div className="container">
                        <div className="content ">
                            <Dashboard tape={this.getSelectedWindow().tape}
                                       events={this.getSelectedWindow().events}
                                       message={this.getSelectedWindow().message}
                                       search={this.getSelectedWindow().search}

                                       setMessageHandler={this.setMessageHandler.bind(this)}
                                       setSearchHandler={this.setSearchHandler.bind(this)}
                                       setEventsHandler={this.setEventsHandler.bind(this)}

                                       updateMessageHandler={this.updateMessageHandler.bind(this)}
                                       updateTapeHandler={this.updateTapeHandler.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


