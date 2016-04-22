/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Model types
class User {}
class Widget {}

// Mock data: create 2 users, with id 1 and id 2
var user = new User();
user.id = '1';
user.name = 'One User';
var user2 = new User();
user2.id = '2';
user2.name = 'Two User';

var widgets = ['What\'s-it', 'Who\'s-it', 'How\'s-it'].map((name, i) => {
  var widget = new Widget();
  widget.name = name;
  widget.id = `${i}`;

  console.log(widget.id);

  //this is to link viewer ids with widgets
  //widget.viewerId = '1';
  return widget;
});

//assign the first user these widgets.
user.widgets = widgets;

//create a mock database with user ids as the key
var userDb = {
  '1': user,
  '2': user2
};

//create a widget given a widget name and user id
function createWidget(name, userId){
  //get length of widgets
  var nextIndex = widgets.length;
  var widget = new Widget();
  widget.name = name;
  widget.id = `${i}`;

  userDb[userId].widgets.push(widget);

  return widget;
}

function getWidgetsByUserId(userId){
  return userDb[userId].widgets;
}

module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: (id) => {
    return userDb[id]
  },
  //getViewer: () => viewer,
  getWidget: (id) => widgets.find(w => w.id === id),
  getWidgets: () => widgets,
  getWidgetsByUserId: (id) => {
    return getWidgetsByUserId(id)
  },
  User,
  Widget,
};
