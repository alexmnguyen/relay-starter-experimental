import Relay from 'react-relay';

export default class CreateWidgetMutation extends Relay.Mutation {
  static fragments = {
    //we are adding just one widget
    widget: () => Relay.QL`
      fragment on Widget {
        name
      }
    `
  };
  getMutation() {
    return Relay.QL`mutation{createWidget}`;
  }

  //The variables that are required by our mutation
  getVariables() {
    return {
      name: this.props.widgetInput.name
    };
  }
  // getCollisionKey() {
  //   return `check_${this.props.game.id}`;
  // }
  getFatQuery() {
    return Relay.QL`
      fragment on CreateWidgetPayload {
        widget,
        newWidgetEdge,
      }
    `;
  }
  getConfigs() {
    console.log(this.props);
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'Widget',
      edgeName: 'newWidgetEdge',
      rangeBehaviors: {
        // When the ships connection is not under the influence
        // of any call, append the ship to the end of the connection
        '': 'append',
        // Prepend the ship, wherever the connection is sorted by age
        //'orderby(newest)': 'prepend',
      },
    }];
  }

  // getOptimisticResponse() {
  //   return {
  //     game: {
  //       turnsRemaining: this.props.game.turnsRemaining - 1,
  //     },
  //     hidingSpot: {
  //       id: this.props.hidingSpot.id,
  //       hasBeenChecked: true,
  //     },
  //   };
  // }
}
