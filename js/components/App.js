import React from 'react';
import Relay from 'react-relay';
import CreateWidgetMutation from '../mutations/CreateWidgetMutation'

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
    headers: {
      Authorization: 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIn0.yCYyy6yYgTIrbfrQ1n_VrwmlusBHPnU1Q1yzZDSLql0'
    }
  })
);

class App extends React.Component {

  handleAddWidget = (e) => {
    e.preventDefault();
    console.log(this.state.widgetNameInput)
    Relay.Store.commitUpdate(
      new CreateWidgetMutation({
        name: this.state.widgetNameInput
      })
    );
  }

  constructor(props) {
    super(props);
    this.state = {widgetNameInput:''};
  }

  handleWidgetNameInputChange = (e) => {
    this.setState({widgetNameInput: e.target.value});
  }

  render() {

    console.log(this.props);

    return (
      <div>
        <h1>Widget list</h1>
        <ul>
          {this.props.viewer.widgets.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.name} (ID: {edge.node.id})</li>
          )}
        </ul>
        <h1>Add a widget</h1>
        <form onSubmit={this.handleAddWidget}>
          Widget Name:<br/>
        <input type="text" name="widgetNameInput" value={this.state.widgetNameInput} onChange={this.handleWidgetNameInputChange}/><br/>
          <input type="submit" value="Add"/>
        </form>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        widgets(first: 10) {
          edges {
            node {
              id,
              name,
            },
          },
        },
      }
    `,
  },
});
