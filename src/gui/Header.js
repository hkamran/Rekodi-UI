/**
 * Created by HK on 6/9/2016.
 */
import React from 'react';
import {render} from 'react-dom';
import {Proxy} from '../models/Proxy';
import {Payload} from '../controllers/models/Payload';

export class Header extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showProxyWindow: false
        };
    }

    showProxyWindow() {
        this.setState({
            showProxyWindow: true
        });
    }

    hideProxyWindow() {
        this.setState({
            showProxyWindow: false
        });
    }

    createProxy() {
        var name = this.refs.proxyNameInput.value;
        var port = this.refs.portInput.value;
        var proxy = new Proxy(-1, port, name, Proxy.types.START);
        this.props.updateProxyHandler(Payload.actions.INSERT, proxy);
        this.hideProxyWindow();
    }

    closeProxy(proxy) {
        var proxy = proxy.clone();
        proxy.state = Proxy.types.STOP;
        this.props.updateProxyHandler(Payload.actions.DELETE, proxy);
    }

    render() {
        return (
            <div className="header" style={{height: "90px", position: "relative", background: "#353535 "}}>

                {(function() {
                    if (!this.state.showProxyWindow) {
                        return;
                    }

                    return (
                        <div className="settings" style={{top: "335%"}}>
                            <div></div>
                            <div style={{marginBottom: "15px"}}>
                                <label>Proxy Name:
                                    <input ref="proxyNameInput" type="text" />
                                </label>
                                <label>Proxy Port:
                                    <input ref="portInput" type="text" />
                                </label>
                            </div>
                            <a className="button" onClick={this.hideProxyWindow.bind(this)}>Close</a>
                            <a className="button" onClick={this.createProxy.bind(this)} style={{marginRight: "10px"}}>Save</a>
                        </div>
                    )
                }.bind(this))()}

                <div style={{position: "absolute", bottom: "0px", width: "100%", borderTop: "1px solid #353535"}}>
                    <div className="tab wrapper">
                        <div className="tab top selected" style={{borderBottom: "1px solid #858585", height: "23px", borderRight: "1px solid #858585"}}>
                            <div className="tab top container items">
                                <div className="tab top container item left" onClick={this.showProxyWindow.bind(this)} style={{textAlign:"center"}} >
                                    <img style={{marginTop: "5px"}} src="./assets/images/plus.png" />
                                </div>
                                <div className="tab top container item right" style={{textAlign:"center"}}>
                                    <img style={{marginTop: "5px"}} src="./assets/images/list.png" />
                                </div>
                            </div>
                        </div>
                        <div className="tab bottom unselected"></div>
                    </div>
                    {
                        Object.keys(this.props.proxies).sort().map(function(id, i) {
                            var proxy = this.props.proxies[id];

                            var styleFirst = {};
                                styleFirst["borderLeft"] = "0px solid #858585";

                            if (this.props.selectedWindow == proxy.id) {
                                return (
                                    <div key={i}  className="tab wrapper">
                                        <div className="tab top border selected" style={styleFirst}>
                                            <div className="tab top container selected text">
                                                <span style={{fontSize: "9pt"}}>{proxy.name}</span>
                                                {
                                                    (function() {
                                                        if (Object.keys(this.props.proxies).length > 1) {
                                                            return (
                                                                <i className="fa fa-times"
                                                                   onClick={this.closeProxy.bind(this, proxy)}
                                                                   style={{marginLeft: "8px", color: "#8d8d8d"}}/>
                                                            )
                                                        }
                                                    }.bind(this))()
                                                }

                                            </div>
                                        </div>
                                        <div className="tab bottom selected"></div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={i} className="tab wrapper">
                                        <div className="tab top border unselected">
                                            <div className="tab top unselected">
                                                <div className="tab top container unselected text" onClick={this.props.setSelectedWindow.bind(this, id)} >
                                                    <span style={{fontSize: "9pt"}}>{proxy.name}</span>
                                                    {
                                                        (function() {
                                                            if (Object.keys(this.props.proxies).length > 1) {
                                                                return (
                                                                    <i className="fa fa-times"
                                                                       onClick={this.closeProxy.bind(this, proxy)}
                                                                       style={{marginLeft: "8px", color: "#8d8d8d"}}/>
                                                                )
                                                            }
                                                        }.bind(this))()
                                                    }

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
