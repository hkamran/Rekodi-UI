
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

        var windows = {0: Window.create(0)};

        this.state = {
            windows: windows,
            window: windows[0],
        };
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
        console.log("Switching window to " + id);
        if (id in this.state.windows) {
            this.state.window = this.state.windows[id];
            this.setWindow(this.state.window);
        } else {
            console.error("Unable to find window id: " + id);
        }
    }

    handleProxiesUpdate(obj) {
        var proxies = obj.message;
        if (proxies instanceof Proxies) {
            proxies.keySet().map(function(id) {
                var window = Window.create(id);
                window.proxy = proxies.get(id);
                this.state.windows[id] = window;
            }.bind(this));

            this.setState({
                windows : this.state.windows,
                window: this.state.windows[this.state.window.id]
            })
        }
    }

    handleProxyUpdate(payload) {
        var proxy = payload.message;
        if (proxy instanceof Proxy) {
            var proxy = obj;
            var window = this.state.windows[proxy.id];
            window.proxy = proxy;

            this.setState({
                windows : this.state.windows
            })
        }
    }

    handleProxyInsert(payload) {
        var proxy = payload.message;
        if (proxy instanceof Proxy) {
            var window = Window.create(proxy.id);
            window.proxy = proxy;
            this.state.windows[proxy.id] = window;

            this.setState({
                windows : this.state.windows
            })
        }
    }

    handleProxyDelete(payload) {
        var proxy = payload.message;
        if (proxy instanceof Proxy) {

            delete this.state.windows[proxy.id];

            var keys = Object.keys(this.state.windows);
            var lastKey = keys[keys.length - 1];

            this.setState({
                windows : this.state.windows
            })
            this.setSelectedWindow(lastKey);
        }
    }

    handleTapeUpdate(payload) {
        var tape = payload.message;
        if (tape instanceof Tape) {
            var window = this.state.windows[payload.id];
            window.tape = tape;
            this.state.windows[payload.id] = window;

            if (this.state.window.id == payload.id) {
                this.setWindow(window);
            } else {
                this.setWindows(this.state.windows);
            }
        }
    }

    handleFilterUpdate(payload) {
        var filter = payload.message;
        if (filter instanceof Filter) {
            var window = this.state.windows[payload.id];
            window.filter = filter;
            this.state.windows[payload.id] = window;

            if (this.state.window.id == payload.id) {
                this.setWindow(window);
            } else {
                this.setWindows(this.state.windows);
            }
        }
    }

    handleRequestUpdate(payload) {
        var request = payload.message;
        if (request instanceof Request) {
            var window = this.state.window;
            var original = window.message;
            if (original.id == request.pastID && payload.id == window.id) {
                window.message = request;
                this.setWindow(window);
            }
        }
    }

    handleResponseUpdate(payload) {
        var response = payload.message;
        if (response instanceof Response) {
            var window = this.state.window;
            var original = window.message;
            if (original.parent == response.parent
                && original.id == response.id
                && payload.id == window.id) {
                window.message = response;
                this.setWindow(window);
            }
        }
    }

    handleEventUpdate(payload) {
        var event = payload.message;
        if (event instanceof Event) {

            var request = event.request;
            var response = event.response;

            var window = this.state.windows[payload.id];
            console.log("HEY");
            console.log(window);
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

            this.state.windows[payload.id] = window;
            window.events[event.id] = event;

            if (this.state.window.id == payload.id) {
                this.setWindow(window);
            } else {
                this.setWindows(this.state.windows);
            }

        }
    }

    updateTapeHandler(action, tape) {
        var id = this.state.window.id;
        var payload = new Payload(id, action, Payload.types.TAPE, tape.getJSON());
        this.socket.send(payload);
    }

    updateMessageHandler(action, message) {
        var id = this.state.window.id;
        if (message instanceof Request) {
            var payload = new Payload(id, action, Payload.types.REQUEST, message);
            this.socket.send(payload);
        } else if (message instanceof Response) {
            var payload = new Payload(id, action, Payload.types.RESPONSE, message);
            this.socket.send(payload)
        }
    }

    updateProxyHandler(action, proxy) {
        var payload = new Payload(proxy.id, action, Payload.types.PROXY, proxy);
        this.socket.send(payload);
    }

    updateFilterHandler(action, filter) {
        var id = this.state.window.id;
        var payload = new Payload(id, action, Payload.types.FILTER, filter);
        this.socket.send(payload);
    }

    toggleStateHandler() {
        var window = this.state.window;
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
        var window = this.state.window;
        var filter = window.filter.clone();

        if (filter.redirect) {
            filter.redirect = false;
        } else{
            filter.redirect = true;
        }

        this.updateFilterHandler(Payload.actions.UPDATE, filter);
    }

    setMessageHandler(msg) {
        var window = this.state.window;
        window.message = msg;

        this.setWindow(window);
    }

    setSearchHandler(search) {
        var window = this.state.window;
        window.search = search;

        this.setWindow(window);
    }

    setEventsHandler(events) {
        var window = this.state.window;
        window.events = events;

        this.setWindow(window);
    }

    setWindow(window) {
        this.state.windows[window.id] = window;
        this.setState({
            windows: this.state.windows,
            window: window
        })
    }

    setWindows(windows) {
        this.setState({
            windows: windows
        })
    }

    getProxies() {
        var proxies = {};
        Object.keys(this.state.windows).map(function(id) {
            var window = this.state.windows[id];
            proxies[id] = window.proxy;
        }.bind(this));
        return proxies;
    }

    render() {
        return (
            <div className="grow height width">
                <Header proxies={this.getProxies()}
                        selectedWindow={this.state.window.id}
                        updateProxyHandler={this.updateProxyHandler.bind(this)}
                        handleProxyInsert={this.handleProxyInsert.bind(this)}
                        setSelectedWindow={this.setSelectedWindow.bind(this)}
                />
                <div className="breaker"></div>
                <div className="main">
                    <Subnav filter={this.state.window.filter}
                            toggleStateHandler={this.toggleStateHandler.bind(this)}
                            toggleRedirectHandler={this.toggleRedirectHandler.bind(this)}
                            tape={this.state.window.tape}
                            updateFilterHandler={this.updateFilterHandler.bind(this)}
                            updateProxyHandler={this.updateProxyHandler.bind(this)}
                            updateTapeHandler={this.updateTapeHandler.bind(this)}
                            proxy={this.state.window.proxy}
                    />
                    <div className="container">
                        <div className="content ">
                            <Dashboard tape={this.state.window.tape}
                                       events={this.state.window.events}
                                       message={this.state.window.message}
                                       search={this.state.window.search}

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


