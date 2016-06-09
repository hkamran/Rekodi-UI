
import React from 'react';
import {render} from 'react-dom';


class App extends React.Component {
    render() {
        return (
            <div>
                <div class="header">

                </div>
                <div class="breaker"></div>
                <div class="main">
                        lol
                </div>
            </div>
        )
    }
}

render(<App />, document.getElementById("app"))