
# TodoMVC - React, Alt, ES6 revisited


## Step 8 - Add TodoItem Component

Now, we need to add a new component corresponding to a todo item, we will call it `TodoItem.jsx`

``` 
yo react-webpack-alt:component TodoItem
```

We need to rename generated file TodoItemComponent to TodoItem, and also class name inside file.


#####Render function
Now we need to replace content of render function, but first lets install a needed dependency:

```
npm i -S classnames
```

import it inot TodoItem.jsx:

``` 
import classNames from 'classnames';
``` 

and then, edit render function:
``` 
render() {
    return (
        <li className={classNames({
			completed: this.props.todo.completed,
			editing: this.props.editing
         })}>
            <div className="view">
                <input
                    className="toggle"
                    type="checkbox"
                    checked={this.props.todo.completed}
                    onChange={this.props.onToggle}
                    />
                <label onDoubleClick={this.handleEdit}>
                    {this.props.todo.title}
                </label>
                <button className="destroy" onClick={this.props.onDestroy} />
            </div>
            <input
                ref="editField"
                className="edit"
                value={this.state.editText}
                onBlur={this.handleSubmit}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                />
        </li>
    );
}
```

##### Initial state

``` 
constructor(props, context) {
    super(props, context);

    this.state = {editText: this.props.todo.title};
}
```

##### Handler functions

```
handleSubmit(event) {
    var val = this.state.editText.trim();
    if (val) {
        this.props.onSave(val);
        this.setState({editText: val});
    } else {
        this.props.onDestroy();
    }
}

handleEdit() {
    this.props.onEdit();
    this.setState({editText: this.props.todo.title});
}

handleKeyDown(event) {
    var ESCAPE_KEY = 27;
    var ENTER_KEY = 13;

    if (event.which === ESCAPE_KEY) {
        this.setState({editText: this.props.todo.title});
        this.props.onCancel(event);
    } else if (event.which === ENTER_KEY) {
        this.handleSubmit(event);
    }
}

handleChange(event) {
    this.setState({editText: event.target.value});
}
```

#######Handlers binding

Handlers need to be binded to this:

``` 
this.handleSubmit = this.handleSubmit.bind(this);
this.handleEdit = this.handleEdit.bind(this);
this.handleKeyDown = this.handleKeyDown.bind(this);
this.handleChange = this.handleChange.bind(this);
``` 

##### Component Update

Add `react-dom`import:

``` 
import ReactDOM from 'react-dom';
``` 

Then add component update function:

``` 
/**
 * Safely manipulate the DOM after updating the state when invoking
 * `this.props.onEdit()` in the `handleEdit` method above.
 * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
 * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
 */
componentDidUpdate(prevProps) {
    if (!prevProps.editing && this.props.editing) {
        var node = React.findDOMNode(this.refs.editField);
        node.focus();
        node.setSelectionRange(node.value.length, node.value.length);
    }
}
``` 


##### Optimize

``` 
/**
  * This is a completely optional performance enhancement that you can
  * implement on any React component. If you were to delete this method
  * the app would still work correctly (and still be very performant!), we
  * just use it as an example of how little code it takes to get an order
  * of magnitude performance improvement.
  */
 shouldComponentUpdate(nextProps, nextState) {
     return (
         nextProps.todo !== this.props.todo ||
         nextProps.editing !== this.props.editing ||
         nextState.editText !== this.state.editText
     );
 }
``` 

#### Reuse TodoItem in TodoApp

In `render` function of TodoApp,  you can now add code to map each entry of todo list into `TodoItem`s :

``` 
  render() {
    var todoItems = null;

    if (this.props.todos) {
      todoItems = this.props.todos.map(function (todo) {
        return (
            <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={this.toggle.bind(this, todo)}
                onDestroy={this.destroy.bind(this, todo)}
                onEdit={this.edit.bind(this, todo)}
                editing={this.state.editing === todo.id}
                onSave={this.save.bind(this, todo)}
                onCancel={this.cancel}
                />
        );
      }, this);
    }

    return (
      <div className="index">
        {todoItems}
      </div>
    );
  }
``` 

#### Add Keyboard events handler

We also need to handle keyboard events with this code snippet on `Enter`key hit:

``` 
handleNewTodoKeyDown(event) {
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
``` 

and this code snippet to handle other key hit:

``` 
handleChange(event) {
    this.setState({newTodo: event.target.value});
}
``` 

#####Constants
and add keyboard key relative constants:

``` 
var ENTER_KEY = 13;
``` 

#####Handlers binding

We need to bind handler functions to this (`TodoApp`), but also initialize state of component, with following code:

```
constructor(props, context) {
	super(props, context);
	
	this.handleNewTodoKeyDown = this.handleNewTodoKeyDown.bind(this);
	this.handleChange = this.handleChange.bind(this);
	this.state = { newTodo: '' };
}
``` 

####Wrap TodoItems into a Main Section

We want to add `TodoItem`s into a section: 

``` 
main = (
    <section className="main">
      <ul className="todo-list">
        {todoItems}
      </ul>
    </section>
);
``` 

####Header

Let add a header to our TodoItem list:

``` 
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
``` 

and update return of `render` function:

``` 
return (
  <div className="index">
    {header}
    {main}
    {footer}
  </div>
);
``` 

####TodoItems footer

We want to add a footer to the `TodoItem`list.

```
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
```

###TodoFooter

``` 
import React, {Component} from 'react';

class TodoFooter extends Component {

    render() {

    }

}

export default TodoFooter;
``` 


#####Add Render Method

```
render() {
    return (
        <footer className="footer">
			{count}
			{filter}
            {clearButton}
        </footer>
    );
}
``` 

######Add count

Add `pluralize`:

First import dependency:

``` 
npm i -S pluralize
``` 

``` 
import { pluralize } from 'pluralize';
``` 

Then,  implement count :

``` 
var activeTodoWord = pluralize('item', this.props.count); 
  
var count = (
        <span className="todo-count">
            <strong>{this.props.count}</strong> {activeTodoWord} left
        </span>
);
```

#######Add filter

Add `classNames` import:

``` 
import classNames from 'classnames';
import { Link } from 'react-router';
``` 

```
var nowShowing = this.props.nowShowing;
var filters = (
        <ul className="filters">
            <li>
                <Link to="/" className={classNames({selected: nowShowing === app.ALL_TODOS})}>All</Link>
            </li>
            <li>
                <Link to="/active" className={classNames({selected: nowShowing === app.ACTIVE_TODOS})}>Active</Link>
            </li>
            <li>
                <Link to="/completed" className={classNames({selected: nowShowing === app.COMPLETED_TODOS})}>Completed</Link>
            </li>
        </ul>
);
``` 

######Add clear button

``` 
var clearButton = null;
if (this.props.completedCount > 0) {
    clearButton = (
        <button
            className="clear-completed"
            onClick={this.props.onClearCompleted}>
            Clear completed
        </button>
    );
}
``` 


####Update of index.html

To correctly style our app, we need to replace following code: 

``` 
<div id="app">APPLICATION CONTENT</div>
```  

By :

``` 
<body>
  <section id="app" class="todoapp"></section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <p>Created by <a href="http://github.com/wishpishh">Hannes Johansson</a> based on React example by <a href="http://github.com/petehunt/">petehunt</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
  <script>__REACT_DEVTOOLS_GLOBAL_HOOK__ = parent.__REACT_DEVTOOLS_GLOBAL_HOOK__</script>
  <script type="text/javascript" src="assets/app.js"></script>
</body>
```

####Add todo items filtering

We need to change `TodoApp.jsx` to use a filtered list instead of full list: 
``` 
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
        ...
    }, this);
``` 


###Routing

####TodoFooter

We need to configure an history listener and `nowShowing` will be up to date with correct value:

``` 
componentDidMount() {
    this.unlistenHistory = this.props.history.listen( (err, state) => {

        var filter = state.location.pathname.slice(1).toUpperCase() || 'ALL';
        TodoActions.show(filter);
    });
}

componentWillUnmount() {
    history.unlisten(this.unlistenHistory);
}
``` 

### Source

####Scafold
``` 
yo react-webpack-alt:source Todo 
```

We need to create a `Source` and connect it to `TodoStore` to handle data fetch.

``` 
import TodoSource from '../sources/TodoSource';
import { datasource } from 'alt/utils/decorators';

@datasource(TodoSource)

``` 


