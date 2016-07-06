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


                    <div style={{width: "60px", height: "1px", float: "left"}}>
                    </div>

                    <div className="tab wrapper">
                        <div className="tab top border selected" >
                            <div className="tab top container selected text" >
                                <span style={{fontSize: "9pt"}}>Default Service</span>
                                <i className="fa fa-times" style={{marginLeft: "8px", color: "#8d8d8d"}}></i>
                            </div>
                        </div>
                        <div className="tab bottom selected"></div>
                    </div>

                    <div className="tab wrapper">
                        <div  className="tab top border unselected">
                            <div className="tab top container unselected">
                                <div className="tab text" style={{width: "60px", height: "100%",  paddingTop: "2px", borderRight: "1px solid #999999", fontSize: "12pt", fontWeight: "600"}}>

                                </div>
                            </div>
                        </div>
                        <div className="tab bottom unselected"></div>
                    </div>

                    <div className="tab wrapper">
                        <div  className="tab top border unselected">
                            <div className="tab top container unselected">
                                <div className="tab text" style={{width: "60px", height: "100%",  paddingTop: "2px", borderRight: "1px solid #999999", fontSize: "12pt", fontWeight: "600"}}>

                                </div>
                            </div>
                        </div>
                        <div className="tab bottom unselected"></div>
                    </div>

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
