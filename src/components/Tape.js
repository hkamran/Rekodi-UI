/**
 * Created by HK on 6/9/2016.
 */
import React from 'react';
import {render} from 'react-dom';


export class Tape extends React.Component {
    render() {
        return (
            <div id="tapeContainer" className="box" >
                <div className="header">
                    <div className="item left border">Tape</div>
                    <div className="item right border"><i className="fa fa-file-o" aria-hidden="true"></i></div>
                </div>
                <div className="body">
                    <div  className="column grow width">

                        <div className="search container">
                            <div className="search border">
                                <div className="search icon wrapper">
                                    <i aria-hidden="true" className="fa fa-search fa-lg"></i>
                                </div>
                                <div className="search input wrapper">
                                    <input style={{width: "calc(100% - 44px)", border: "0px"}} type="text" maxlength="250" autocomplete="off" placeholder="Search" name="q" id="search_terms" />
                                </div>
                            </div>
                        </div>

                        <div className="content" style={{"padding-top": "10px", top: "52px"}}>
                            <div className="tree" >
                                <ul className="incoming">
                                    <li>
                                        <span><i className="icon-minus-sign "></i>Request: 4512</span>

                                        <ul>
                                            <li className="message">
                                                <span><i className="icon-leaf"></i>Response: 0</span>
                                            </li>
                                            <li className="message">
                                                <span><i className="icon-leaf"></i>Response: 1</span>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                                <ul className="incoming">
                                    <li>
                                        <span><i className="icon-minus-sign "></i>Request: 4512</span>

                                        <ul>
                                            <li className="message">
                                                <span><i className="icon-leaf"></i>Response: 0</span>
                                            </li>
                                            <li className="message">
                                                <span><i className="icon-leaf"></i>Response: 1</span>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}