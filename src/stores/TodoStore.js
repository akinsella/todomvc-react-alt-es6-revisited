import alt from 'components/Dispatcher';
import { datasource } from 'alt/utils/decorators';
import TodoActions from '../actions/TodoActions';

import uuid from 'uuid';

import Firebase from 'firebase';

export class TodoStore {

  constructor() {

    this.state = {
      todos: []
    };

    this.bindActions(TodoActions);

    this.firebase = new Firebase(`https://glaring-heat-6154.firebaseio.com/`);

    var user = this.firebase.getAuth()

    if (user) {
      this.listenDbChanges();
    } else {
      this.firebase.authWithOAuthPopup("google", (error, authData) => {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);

          this.listenDbChanges();
        }
      }, {remember: "sessionOnly", scope: "email"});

    }
  }

  listenDbChanges() {
    this.todosRef = this.firebase.child('todos');

    this.todoRef = (todo) => this.todosRef.child(todo.key);

    this.todosRef.on('value', snapshot => {
      const todos = snapshot.val();

      console.log(`[Firebase][onValue] ${JSON.stringify(todos, undefined, 2)}`);

      const todoArray = Object.keys(todos || {}).map(key => {
        const todo = todos[key];
        todo.key = key;

        return todo;
      });


      this.setState({todos: todoArray});
    });
  }

  onAddTodo(title) {
    this.todosRef.push().set({
      id: uuid.v4(),
      title: title,
      completed: false
    });
  }

  onToggleAll(checked) {
    this.state.todos.forEach(todo => {
      this.todosRef.child(todo.key).update({completed: checked});
    });
  }

  onToggle(todo) {
    this.todoRef(todo).update({completed: !todo.completed});
  }

  onDestroy(todo) {
    this.todoRef(todo).remove();
  }

  onSave(command) {
    this.todoRef(command.todoToSave).update({
      title: command.text
    });
  }

  onClearCompleted() {
    this.state.todos.forEach(todo => {
      if (todo.completed) {
        this.todoRef(todo).remove();
      }
    });
  }

  onEdit(id) {
    this.setState({editing: id});
  }

  onShow(nowShowing) {
    this.setState({nowShowing: nowShowing});
  }

}

export default alt.createStore(TodoStore, 'TodoStore');
