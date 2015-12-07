
# TodoMVC - React, Alt, ES6 revisited


## Step 13 - Add TodoApp footer

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

###Add TodoFooter.jsx file

``` 
import React, {Component} from 'react';

class TodoFooter extends Component {

    render() {

    }

}

export default TodoFooter;
``` 


####Add Render Method

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

#####Add count

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

#####Add filter

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

#####Add clear button

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
