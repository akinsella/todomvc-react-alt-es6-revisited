import alt from 'components/Dispatcher';
import { datasource } from 'alt/utils/decorators';
import TodoActions from '../actions/TodoActions';

import uuid from 'uuid';

import extend from 'object-assign';

export class TodoStore {

  constructor() {

    this.state = {
      todos: JSON.parse(localStorage.getItem('todomvc.todos')) || [],
      nowShowing: JSON.parse(localStorage.getItem('todomvc.nowShowing')) || [],
      editing: JSON.parse(localStorage.getItem('todomvc.editing')) || []
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

    localStorage.setItem('todomvc.todos', JSON.stringify(this.state.todos));
  }

  onToggleAll(checked) {
    var updatedTodos = this.state.todos.map(todo => extend(todo, {completed: checked}));

    this.setState({todos: updatedTodos});

    localStorage.setItem('todomvc.todos', JSON.stringify(this.state.todos));
  }

;

  onToggle(todoToToggle) {
    var updatedTodos = this.state.todos.map(todo =>
            todo !== todoToToggle ?
                todo : extend({}, todo, {completed: !todo.completed})
    );

    this.setState({todos: updatedTodos});

    localStorage.setItem('todomvc.todos', JSON.stringify(this.state.todos));
  }

  onDestroy(todoToDestroy) {
    var updatedTodos = this.state.todos.filter(todo => todo !== todoToDestroy);

    this.setState({todos: updatedTodos});

    localStorage.setItem('todomvc.todos', JSON.stringify(this.state.todos));
  }

  onSave(command) {
    var updatedTodos = this.state.todos.map(todo =>
            todo !== command.todoToSave ?
                todo : extend({}, command.todoToSave, {title: command.text})
    );

    this.setState({todos: updatedTodos});

    localStorage.setItem('todomvc.todos', JSON.stringify(this.state.todos));
  }

  onClearCompleted() {
    var updatedTodos = this.state.todos.filter(todo => !todo.completed);

    this.setState({todos: updatedTodos});

    localStorage.setItem('todomvc.todos', JSON.stringify(this.state.todos));
  }

  onEdit(id) {
    this.setState({editing: id});

    localStorage.setItem('todomvc.editing', JSON.stringify(this.state.editing));
  }

  onShow(nowShowing) {
    this.setState({nowShowing: nowShowing});

    localStorage.setItem('todomvc.nowShowing', JSON.stringify(this.state.nowShowing));
  }

}

export default alt.createStore(TodoStore, 'TodoStore');
