/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  cursorForObjectInConnection,
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  User,
  Widget,
  getUser,
  getWidget,
  getWidgets,
  getWidgetsByUserId,
  createWidget
} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Widget') {
      return getWidget(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Widget)  {
      return widgetType;
    } else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    widgets: {
      type: widgetConnection,
      description: 'A person\'s collection of widgets',
      args: connectionArgs,
      resolve: (user, args, jwt) => {
        //the third parameter is the context, which we passed request.user to, which is the decoded jwt.
        return connectionFromArray(getWidgetsByUserId(jwt.userId), args)
      },
    },
  }),
  interfaces: [nodeInterface],
});

var widgetType = new GraphQLObjectType({
  name: 'Widget',
  description: 'A shiny widget',
  fields: () => ({
    id: globalIdField('Widget'),
    name: {
      type: GraphQLString,
      description: 'The name of the widget',
    },
  }),
  interfaces: [nodeInterface],
});

/**
 * Define your own connection types here
 */
var {
  connectionType: widgetConnection,
  edgeType: WidgetEdge
} = connectionDefinitions({name: 'Widget', nodeType: widgetType});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: userType,
      //get the viewer but with a jwt context
      resolve: (user,args,jwt) => {
        return getUser(jwt.userId)
      }
    },
  }),
});

const CreateWidgetMutation = mutationWithClientMutationId({
  name: 'CreateWidget',
  inputFields: {
    //the widget name
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    newWidgetEdge: {
      type: WidgetEdge,
      resolve: (payload,arg2,info) => {
        const widget = getWidget(payload.id);

        return{
          cursor: cursorForObjectInConnection(
            getWidgetsByViewerId('1'),
          ),
          node: widget,
        };
      },
    },
    widget: {
      type: widgetType,
      resolve: ({widget}) => {
        //output the widget information
        widget
      }
    }
  },
  //This happens before the outputFields are generated. The return goes to the outputFields.
  mutateAndGetPayload: ({name, userId},context,info) => {
    let widget = createWidget(name, info.userId);
    return {widget};
  }
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createWidget: CreateWidgetMutation,
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
// var mutationType = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: () => ({
//     // Add your own mutations here
//   })
// });

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
   mutation: mutationType
});
