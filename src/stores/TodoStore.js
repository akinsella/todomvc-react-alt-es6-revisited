import alt from 'components/Dispatcher';
import { datasource } from 'alt/utils/decorators';
import TodoActions from '../actions/TodoActions';

import uuid from 'uuid';

import extend from 'object-assign';

export class TodoStore {

  constructor() {

    this.state = {
      todos: [],
      nowShowing: [],
      editing: []
    };

    this.bindActions(TodoActions);
  }

  onAddTodo(title) {
    this.setState({
      todos: this.state.todos.concat({
        id: uuid.v4(),
        title: title,
        completed: false
      })
    });
  }

  onToggleAll(checked) {
    var updatedTodos = this.state.todos.map(todo => extend(todo, {completed: checked}));

    this.setState({todos: updatedTodos});
  }

;

  onToggle(todoToToggle) {
    var updatedTodos = this.state.todos.map(todo =>
            todo !== todoToToggle ?
                todo : extend({}, todo, {completed: !todo.completed})
    );

    this.setState({todos: updatedTodos});
  }

  onDestroy(todoToDestroy) {
    var updatedTodos = this.state.todos.filter(todo => todo !== todoToDestroy);

    this.setState({todos: updatedTodos});
  }

  onSave(command) {
    var updatedTodos = this.state.todos.map(todo =>
            todo !== command.todoToSave ?
                todo : extend({}, command.todoToSave, {title: command.text})
    );

    this.setState({todos: updatedTodos});
  }

  onClearCompleted() {
    var updatedTodos = this.state.todos.filter(todo => !todo.completed);

    this.setState({todos: updatedTodos});
  }

  onEdit(id) {
    this.setState({editing: id});
  }

  onShow(nowShowing) {
    this.setState({nowShowing: nowShowing});
  }

}

export default alt.createStore(TodoStore, 'TodoStore');
