/**
 * Created by hkamran on 7/12/2016.
 */
export class EventRow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          className : "example-enter"
        };
    }

    componentDidMount() {
        if (!this.props.event.viewed) {
            this.props.event.viewed = true;
            this.setState({
                className: "example-enter example-enter-active"
            });
            console.log(this.props.event.viewed);
        } else {
            this.setState({
                className: ""
            })
        }
    }

    componentWillUnmount() {
        this.props.event.viewed = true;
    }

    render () {
        var event = this.props.event;
        var request = event.request;
        var response = event.response;

        var isMessage = event.request.equals(this.props.message);

        return (
            <tr className={this.state.className} style={{height: "1%"}}>
                <td>{event.startTime}</td>
                <td>Incoming Request: <span
                    className="http method">{request.method}</span>
                    <span className="http uri">{request.uri}</span>
                </td>
                <td>
                    <span
                        onClick={isMessage ? this.props.resetMessageHandler : this.props.setMessageHandler.bind(this, request)}
                        className="http label button">
                        {request.id}
                    </span>
                </td>
                <td>
                    {(function () {
                        if (response != null) {
                            var isMessage = response.equals(this.props.message);
                            return (
                                <span
                                    onClick={isMessage ? this.props.resetMessageHandler : this.props.setMessageHandler.bind(this, response)}
                                    className="http label button">
                                    {response.hashCode}
                                </span>
                            )
                        } else {
                            return (
                                <span className="http label button">...</span>
                            )
                        }
                    }.bind(this))()}
                </td>
                <td>{event.duration}ms</td>
            </tr>
        );
    }
}