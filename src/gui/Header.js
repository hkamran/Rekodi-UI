/**
 * Created by HK on 6/9/2016.
 */
import React from 'react';
import {render} from 'react-dom';

export class Header extends React.Component {
    render() {
        return (
            <div className="header" style={{height: "90px", position: "relative", background: "#353535 url('./assets/images/header_bg.png') repeat-x scroll center bottom"}}>

                <img src="./assets/images/header_tab.png" style={{marginLeft: "60px", position: "absolute", bottom: "0px"}}/>
            </div>
        )
    }
}
