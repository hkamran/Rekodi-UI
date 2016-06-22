/**
 * Created by HK on 6/9/2016.
 */
import React from 'react';
import {render} from 'react-dom';

export class Header extends React.Component {
    render() {
        return (
            <div className="header" style={{height: "90px", position: "relative", background: "#353535 "}}>
                <div style={{position: "absolute", bottom: "0px", width: "100%", borderTop: "1px solid #858585"}}>

                    <div style={{float: "left", width: "60px", zIndex: 10, position: "relative"}}>
                        <div style={{height: "23px", borderBottom: "1px solid #858585",}} >
                            <div style={{height: "100%", borderTop: "0px solid #fefefe", boxSizing: "border-box"}}>
                                <div style={{height: "100%",  borderRight: "1px solid #b0b0b0"}}>

                                </div>

                            </div>
                        </div>

                        <div style={{background: "#d9d9d9", borderBottom: "1px solid #7d7d7d",  borderTop: "1px solid #f5f5f5", height: "4px", width: "100%"}}>

                        </div>
                    </div>

                    <div style={{float: "left", width: "95px", zIndex: 10, position: "relative"}}>
                        <div style={{height: "24px", borderLeft: "1px solid #858585", borderRight: "1px solid #858585"}} >
                            <div style={{height: "100%", background: "#dddddd", borderTop: "2px solid #efefef", boxSizing: "border-box"}}>

                            </div>
                        </div>

                        <div style={{background: "#d9d9d9", borderBottom: "1px solid #7d7d7d", height: "5px", width: "100%"}}>

                        </div>
                    </div>

                    <div style={{float: "left", width: "95px", zIndex: 10, position: "relative"}}>
                        <div style={{height: "23px", borderBottom: "1px solid #858585",}} >
                            <div style={{height: "100%", borderTop: "0px solid #fefefe", borderRight: "1px solid #c8c8c8", boxSizing: "border-box"}}>
                                <div style={{height: "100%",  borderRight: "1px solid #999999", }}>

                                </div>

                            </div>
                        </div>

                        <div style={{background: "#d9d9d9", borderBottom: "1px solid #7d7d7d",  borderTop: "1px solid #f5f5f5", height: "4px", width: "100%"}}>

                        </div>
                    </div>

                    <div style={{position: "absolute", bottom: "0px", right: "0px", left: "0px"}}>
                        <div style={{borderBottom: "1px solid #858585", height: "23px", width: "100%"}} >
                            <div style={{height: "100%", background: "#b5b5b5", borderTop: "2px solid #c9c9c9", borderBottom: "1px solid #afafaf", boxSizing: "border-box"}}>

                            </div>
                        </div>

                        <div style={{background: "#d9d9d9", borderBottom: "1px solid #7d7d7d", borderTop: "1px solid #f5f5f5", height: "4px", width: "100%"}}>

                        </div>
                    </div>

                </div>


            </div>
        )
    }
}
