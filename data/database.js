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

// Mock data: create 2 users
var viewer = new User();
var viewer2 = new User();

viewer.id = '1';
viewer.name = 'Anonymous';
var widgets = ['What\'s-it', 'Who\'s-it', 'How\'s-it'].map((name, i) => {
  var widget = new Widget();
  widget.name = name;
  widget.id = `${i}`;
  widget.viewerId = '1';
  return widget;
});

function getWidgetsByViewerId(id){
  var viewerWidgets = []

  widgets.forEach(function(widget){
    if(widget.viewerId === id){
      viewerWidgets.push(widget);
    }
  });

  return viewerWidgets;
}

module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
  getWidget: (id) => widgets.find(w => w.id === id),
  getWidgets: () => widgets,
  getWidgetsByViewerId: (id) => {
    console.log("Attempting to get widgets by viewer id");
    return getWidgetsByViewerId(id)
  },
  User,
  Widget,
};
