
import React from 'react';
import {render} from 'react-dom';
import {Subnav} from './components/Subnav';
import {Header} from './components/Header';
import {Dashboard} from './pages/dashboard/Dashboard';

export class Test {
    constructor(val) {
        this.tests = [val];
        this._render();
    }

    addTest(val) {
        this.tests.push(val);
        this._render();
    }

    _render() {
        console.log("LOOK " + this.tests);
        render(<App test={this.tests} />, document.getElementById("app"));
    }
}



export class App extends React.Component {
    render() {
        console.log("TEST" + this.props.test);
        return (
            <div className="grow height width">
                {this.props.test}asd
                <Header />
                <div className="breaker"></div>
                <div className="main">
                    <Subnav />
                    <div className="container">
                        <div className="content ">
                            <Dashboard />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

let test = new Test(2);
setTimeout(function() {
    test.addTest(11);
}, 3000);


