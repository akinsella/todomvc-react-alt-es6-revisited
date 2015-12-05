import alt from 'components/Dispatcher';
import { datasource } from 'alt/utils/decorators';
import TodoActions from '../actions/TodoActions';

import uuid from 'uuid';

import extend from 'object-assign';

export class TodoStore {

  constructor() {

    this.state = {
      todos: this.load('todos', []),
      nowShowing: this.load('nowShowing', []),
      editing: this.load('editing', []),
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
    this.store('todos', this.state.todos);
  }

  onToggleAll(checked) {
    var updatedTodos = this.state.todos.map(todo => extend(todo, {completed: checked}));
    this.setState({todos: updatedTodos});
    this.store('todos', this.state.todos);
  }

;

  onToggle(todoToToggle) {
    var updatedTodos = this.state.todos.map(todo =>
            todo !== todoToToggle ?
                todo : extend({}, todo, {completed: !todo.completed})
    );
    this.setState({todos: updatedTodos});
    this.store('todos', this.state.todos);
  }

  onDestroy(todoToDestroy) {
    var updatedTodos = this.state.todos.filter(todo => todo !== todoToDestroy);
    this.setState({todos: updatedTodos});
    this.store('todos', this.state.todos);
  }

  onSave(command) {
    var updatedTodos = this.state.todos.map(todo =>
            todo !== command.todoToSave ?
                todo : extend({}, command.todoToSave, {title: command.text})
    );
    this.setState({todos: updatedTodos});
    this.store('todos', this.state.todos);
  }

  onClearCompleted() {
    var updatedTodos = this.state.todos.filter(todo => !todo.completed);
    this.setState({todos: updatedTodos});
    this.store('todos', this.state.todos);
  }

  onEdit(id) {
    this.setState({editing: id});
    this.store('editing', this.state.editing);
  }

  onShow(nowShowing) {
    this.setState({nowShowing: nowShowing});
    this.store('nowShowing', this.state.nowShowing);
  }

  store(key, value) {
    localStorage.setItem('todomvc.' + key, JSON.stringify(value));
  }

  load(key, defaultValue) {
    return JSON.parse(localStorage.getItem('todomvc.' + key)) || defaultValue;
  }

}

export default alt.createStore(TodoStore, 'TodoStore');
