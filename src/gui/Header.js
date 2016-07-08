/**
 * Created by HK on 6/9/2016.
 */
import React from 'react';
import {render} from 'react-dom';

export class Header extends React.Component {
    render() {
        return (
            <div className="header" style={{height: "90px", position: "relative", background: "#353535 "}}>
                <div style={{position: "absolute", bottom: "0px", width: "100%", borderTop: "1px solid #353535"}}>


                    <div style={{width: "60px", height: "1px", float: "left"}}></div>
                    {
                        Object.keys(this.props.proxies).sort().map(function(id, i) {
                            var proxy = this.props.proxies[id];
                            if (proxy.id === this.props.proxy.id) {
                                return (
                                    <div key={i}  className="tab wrapper">
                                        <div className="tab top border selected">
                                            <div className="tab top container selected text">
                                                <span style={{fontSize: "9pt"}}>ddd</span>
                                                <i className="fa fa-times" style={{marginLeft: "8px", color: "#8d8d8d"}}/>
                                            </div>
                                        </div>
                                        <div className="tab bottom selected"></div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={i} className="tab wrapper">
                                        <div  className="tab top border unselected">
                                            <div className="tab top container unselected">
                                                <div className="tab text" style={{width: "60px", height: "100%",  paddingTop: "2px", borderRight: "1px solid #999999", fontSize: "12pt", fontWeight: "600"}}>
                                                    {proxy.name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab bottom unselected"></div>
                                    </div>
                                )
                            }

                        }.bind(this))
                    }


                    <div className="tab bg">
                        <div className="top border" >
                            <div className="top container">

                            </div>
                        </div>
                        <div className="bottom" ></div>
                    </div>

                </div>
            </div>
        )
    }
}
