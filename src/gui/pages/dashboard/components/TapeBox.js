/**
 * Created by HK on 6/9/2016.
 */
import React from 'react';
import {render} from 'react-dom';

import {Tape} from '../../../../models/Tape';
import {Event, State} from '../../../../models/Event';
import {Request} from '../../../../models/Request';
import {Response} from '../../../../models/Response';
import {Payload} from '../../../../controllers/models/Payload';

export class TapeBox extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //this.animateTree();
    }

    animateTree() {
        $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');


        var expand = $('.tree li.parent_li > div > i');
        expand.unbind('click');
        expand.on('click', function (e) {
            var span = $(this).parent();
            var children = span.parent('li.parent_li').find(' > ul > li');
            if (children.is(":visible")) {
                children.hide('fast');

                span.attr('title', 'Expand this branch').find(' > i').addClass('fa-caret-down').removeClass('fa-caret-up');
            } else {
                children.show('fast');
                span.attr('title', 'Collapse this branch').find(' > i').addClass('fa-caret-up').removeClass('fa-caret-down');
            }
            e.stopPropagation();
        });
    }

    componentDidUpdate() {
        //this.animateTree();
    }

    handleSearchFilter() {
        this.props.setSearchHandler(
            this.refs.filterTextInput.value
        );
    }

    clearTape() {
        var tape = new Tape();
        var action = Payload.actions.UPDATE;
        this.props.updateTapeHandler(action, tape);
        this.props.setMessageHandler(null);
    }

    toggleDropDown(id) {
        var collapse = this.props.tree[id];
        if (typeof collapse === 'undefined') {
            this.props.setTreeHandler(id, false);
            return;
        }
        this.props.setTreeHandler(id, !collapse);
    }

    render() {
        return (
            <div id="tapeContainer" className="box" >
                <div className="header">
                    <div className="item left border">Tape</div>
                    <div className="item right border" data-title="New Tape" onClick={this.clearTape.bind(this)}><i className="fa fa-file-o" aria-hidden="true"></i></div>
                </div>
                <div className="body">
                    <div className="column grow width">
                        <div className="search container">
                            <div className="search border">
                                <div className="search icon wrapper">
                                    <i aria-hidden="true" className="fa fa-search fa-lg" />
                                </div>
                                <div className="search input wrapper">
                                    <input style={{width: "calc(100% - 44px)", border: "0px", paddingTop: "1px"}} ref="filterTextInput" onChange={this.handleSearchFilter.bind(this)}
                                           type="text" maxlength="250"
                                           autocomplete="off" placeholder="Search" name="q" id="search_terms"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="content" style={{paddingTop: "15px", top: "52px", overflowX: "hidden"}}>
                            <div className="tree" >

                                {
                                    this.props.tape.getRequests().sort(function (a, b) {
                                            if (a == null || a.id == null) {
                                                return -1;
                                            }
                                            if (a.id > b.id) {
                                                return 1;
                                            }
                                            if (a.id < b.id) {
                                                return 1;
                                            }
                                            return 0;
                                        }).map(function(id, i) {

                                        var search = this.props.search;
                                        if (search.length > 0 && (id.indexOf(search) === -1)) {
                                            return;
                                        }

                                        var request = this.props.tape.getRequest(id);
                                        var responses = this.props.tape.getResponses(id);

                                        var isMessage = request.equals(this.props.message);


                                        var collapse = this.props.tree[id];
                                        if (typeof collapse === 'undefined') {
                                            collapse = true;
                                        }


                                        var childStyle = collapse ? "none" : "block";
                                        var caretClass = collapse ? "fa fa-caret-down" : "fa fa-caret-up";

                                        return (
                                            <ul key={i} className="incoming">
                                                <li>
                                                    <div className={isMessage ? "http label highlight": ""} style={{whiteSpace: "nowrap", padding: "0px"}}>
                                                        <i onClick={this.toggleDropDown.bind(this, request.id)} className={caretClass} aria-hidden="true" style={{padding: "6px", cursor: "pointer"}} />
                                                        <span onClick={isMessage ? this.props.resetMessageHandler : this.props.setMessageHandler.bind(this, request)} style={{cursor: "pointer"}}>Request: {request.id}</span>
                                                    </div>
                                                    <ul style={{"display": childStyle}}>
                                                        {
                                                            responses.map(function(response, i) {
                                                                var isMessage = response.equals(this.props.message);

                                                                return (
                                                                    <li key={i}>
                                                                        <div className={isMessage ? "http label highlight": ""} style={{whiteSpace: "nowrap", padding: "0px"}}>
                                                                            <span onClick={isMessage ? this.props.resetMessageHandler : this.props.setMessageHandler.bind(this, response)}
                                                                                  style={{marginLeft: "6px", cursor: "pointer"}}>Response: {response.id}</span>
                                                                        </div>
                                                                    </li>
                                                                )
                                                            }.bind(this))
                                                        }
                                                    </ul>
                                                </li>
                                            </ul>
                                        )
                                    }, this)

                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}