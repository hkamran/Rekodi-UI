
import React from 'react';
import {render} from 'react-dom';
import {Subnav} from './components/Subnav';
import {Header} from './components/Header';
import {Dashboard} from './pages/dashboard/Dashboard';

class App extends React.Component {


    render() {
        return (
            <div className="grow height width">
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

render(<App />, document.getElementById("app"))