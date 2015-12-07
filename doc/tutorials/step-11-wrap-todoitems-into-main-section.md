
# TodoMVC - React, Alt, ES6 revisited


## Step 11 - Wrap TodoItems into a Main Section

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


