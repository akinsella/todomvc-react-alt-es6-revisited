import React, {Component} from 'react';

import AltContainer from 'alt/AltContainer';

import TodoActions from '../actions/TodoActions';
import TodoStore from '../stores/TodoStore';
import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter'

require('normalize.css');
require('styles/TodoApp.scss');

require('todomvc-common/base.css');
require('todomvc-app-css/index.css');

class TodoApp extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleNewTodoKeyDown = this.handleNewTodoKeyDown.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = { newTodo: '' };
    }

    componentDidMount() {
        this.unlistenHistory = this.props.history.listen( (err, state) => {

            var filter = state.location.pathname.slice(1).toUpperCase() || 'ALL';
            TodoActions.show(filter);
        });
    }

    componentWillUnmount() {
        history.unlisten(this.unlistenHistory);
    }

    toggleAll(event) {
        var checked = event.target.checked;
        TodoActions.toggleAll(checked);
    }

    toggle(todoToToggle) {
        TodoActions.toggle(todoToToggle);
    }

    destroy(todo) {
        TodoActions.destroy(todo);
    }

    edit(todo) {
        TodoActions.edit(todo.id);
    }

    save(todoToSave, text) {
        TodoActions.save({
            todoToSave: todoToSave,
            text: text
        });

        TodoActions.edit(null);
    }

    cancel() {
        TodoActions.edit(null);
    }

    clearCompleted() {
        TodoActions.clearCompleted();
    }

    handleChange(event) {
        this.setState({newTodo: event.target.value});
    }

    handleNewTodoKeyDown(event) {

        var ENTER_KEY = 13;

        if (event.keyCode !== ENTER_KEY) {
            return;
        }

        event.preventDefault();

        var val = this.state.newTodo.trim();

        if (val) {
            this.setState({newTodo: ''});

            TodoActions.addTodo(val);
        }
    }

    render() {

        var main, todoItems, footer, header;

        if (this.props.todos) {

            var shownTodos = this.props.todos.filter((todo) => {
                switch (this.props.nowShowing) {
                    case 'ACTIVE':
                        return !todo.completed;
                    case 'COMPLETED':
                        return todo.completed;
                    default:
                        return true;
                }
            }, this);

            todoItems = shownTodos.map((todo) => {
                return (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={this.toggle.bind(this, todo)}
                        onDestroy={this.destroy.bind(this, todo)}
                        onEdit={this.edit.bind(this, todo)}
                        editing={this.props.editing === todo.id}
                        onSave={this.save.bind(this, todo)}
                        onCancel={this.cancel}
                        />
                );
            }, this);


            var activeTodoCount = this.props.todos.reduce((accum, todo) => {
                return todo.completed ? accum : accum + 1;
            }, 0);

            main = (
                <section className="main">
                    <input
                        className="toggle-all"
                        type="checkbox"
                        onChange={this.toggleAll}
                        checked={activeTodoCount === 0}
                        />
                    <ul className="todo-list">
                        {todoItems}
                    </ul>
                </section>
            );

            var completedCount = this.props.todos.length - activeTodoCount;

            if (activeTodoCount || completedCount) {
                footer =
                    <TodoFooter
                        count={activeTodoCount}
                        completedCount={completedCount}
                        nowShowing={this.props.nowShowing}
                        onClearCompleted={this.clearCompleted}
                        />;
            }
        }

        header = (
            <header className="header">
                <h1>todos</h1>
                <input
                    ref="newField"
                    className="new-todo"
                    placeholder="What needs to be done?"
                    value={this.state.newTodo}
                    onKeyDown={this.handleNewTodoKeyDown}
                    onChange={this.handleChange}
                    autoFocus={true}
                    />
            </header>
        );


        return (
            <div className="index">
                {header}
                {main}
                {footer}
            </div>
        );
    }

}

TodoApp.defaultProps = {};

class TodoAppContainer extends React.Component {

    render() {
        return (
            <AltContainer store={TodoStore}>
                <TodoApp {...this.props} />
            </AltContainer>
        );
    }
}


export default TodoAppContainer;
