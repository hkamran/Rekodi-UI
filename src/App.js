
import React from 'react';
import {render} from 'react-dom';
import {Subnav} from './components/Subnav';
import {Content} from './components/Content';

class App extends React.Component {


    render() {
        var style = {
            height: '60px'
        };

        return (
            <div className="grow height width">
                <div className="header" style={style}>

                </div>
                <div className="breaker"></div>
                <div className="main">
                    <Subnav />
                    <Content />
                </div>
            </div>
        )
    }
}

render(<App />, document.getElementById("app"))