/**
 * Created by HK on 6/9/2016.
 */
import React from 'react';
import {render} from 'react-dom';

import {TapeBox} from './components/TapeBox';
import {MessageBox} from './components/MessageBox';
import {EventBox} from './components/EventsBox';

import {Request} from '../../../models/Request';
import {Response} from '../../../models/Response';

export class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            resetMessageHandler : function () {}
        }
    }

    componentDidMount() {
        Split(['#analysisContainer', '#eventsContainer'], {
            sizes: [55, 45],
            minSize: 200,
            gutterElem: document.getElementById("contentSplitter"),
            direction: 'vertical',

        });

        Split(['#headerContainer', '#contentContainer'], {
            sizes: [32, 68],
            minSize: 74,
            gutterElem: document.getElementById("messageSplitterClickBox"),
            gutterSize: 1,
            gutterClickBox: document.getElementById("messageSplitterClickBox")

        });

        Split(['#tapeContainer', '#messageContainer'], {
            sizes: [25, 75],
            minSize: 200,
            gutterElem: document.getElementById("analysisSplitter"),
        });
    }

    setResetMessageHandler(handle) {
        this.setState({
            resetMessageHandler : handle
        })
    }

    resetMessageHandler() {
        this.state.resetMessageHandler();
    }

    render() {

       //tape={this.getSelectedWindow().tape}
       //events={this.getSelectedWindow().events}
       //message={this.getSelectedWindow().message}
       //search={this.getSelectedWindow().search}
       //
       //setMessageHandler={this.setMessageHandler.bind(this)}
       //setSearchHandler={this.setSearchHandler.bind(this)}
       //setEventsHandler={this.setEventsHandler.bind(this)}
       //
       //updateMessageHandler={this.updateMessageHandler.bind(this)}
       //updateTapeHandler={this.updateTapeHandler.bind(this)}


        return (
            <div className="grow width height">
                <div id="analysisContainer" style={{height: "calc(50% - 5px)"}}>
                    <TapeBox tape={this.props.tape}
                             message={this.props.message}
                             search={this.props.search}
                             updateTapeHandler={this.props.updateTapeHandler}

                             setSearchHandler={this.props.setSearchHandler}
                             setMessageHandler={this.props.setMessageHandler}

                             resetMessageHandler={this.resetMessageHandler.bind(this)}
                    />
                    <div id="analysisSplitter" className="splitter horizontal">
                        <div className="splitter horizontal grabber"></div>
                    </div>

                    <MessageBox
                        message={this.props.message}
                        updateMessageHandler={this.props.updateMessageHandler}
                        setResetMessageHandler={this.setResetMessageHandler.bind(this)}
                    />
                </div>

                <div id="contentSplitter">
                    <div className="splitter vertical">
                        <div className="splitter vertical grabber"></div>
                    </div>
                </div>

                <EventBox events={this.props.events}
                          message={this.props.message}

                          setMessageHandler={this.props.setMessageHandler}
                          setEventsHandler={this.props.setEventsHandler}

                          resetMessageHandler={this.resetMessageHandler.bind(this)}
                />
            </div>
        )
    }
}
