/*
 * Copyright 2013 Krake Pte Ltd.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * Author:
 * Gary Teh <garyjob@krake.io> 
 */

/*
 * 'idle' => no column object attached
 * 'ready_for_selection' => a column object is in stage area for edit
 * 'ready_for_selection' => a column is added and ready for edit
 * 'first_column_selected' => xpath1 is selected
 * 'second_column_selected' => xpath2 is selected
 * 'ready_for_pagination_selection' => before pagination is defined
 */
var SessionManager = function() {

  // TODO : To deprecate
  // used for setting next_pager
  // this.previousColumn = null;  
  
  this.currentState = 'idle';  
  this.currentColumn = null;

  this.states = {
    'idle': {
	    'before': undefined,
	    'after': 'selection_addition',
	    'post_transition_event': undefined 
	  },
	  
	  // TODO : To define new state that allows for unlimited adding of elements to a column
    'selection_addition': {
      'before': 'idle',
      'after': 'idle',
      'post_transition_event': undefined 
    },
    
    'pre_next_pager_selection' : {
      'before': 'idle',
      'after': 'idle',
      'post_transition_event': undefined 
    }
  };//eo states
};

// @Description : sets up the initial state for this session
SessionManager.prototype.setInitialState = function(state) {
  var self = this;
  self.currentState = state;
};

// @Description : sets the event handler that will be triggered when session is transisted into state
SessionManager.prototype.setEventForState = function(state, eventHandler) {
  var self = this;
  self.states[state]['post_transition_event'] = eventHandler;
  //console.log('eventHandler for "' + state + '" set');
};

// @Description : rotates the state to the next one inline
SessionManager.prototype.goToNextState = function(state) {
  var self = this;

  // When a target state is not indicated
  if(!state) {
    var previousState = self.states[self.currentState];
    self.currentState = previousState['after'];

    if(previousState['post_transition_event'] != undefined) {
      (previousState['post_transition_event'])();
    }
    
  // When a target state is indicated
  } else {
    self.currentState = state;
  }//eo if-else

  return self;
};
