import React, {Component} from 'react';

import TodoActions from '../actions/TodoActions';

import classNames from 'classnames';

import pluralize from 'pluralize';

import { Link } from 'react-router';

class TodoFooter extends Component {

    render() {
        var activeTodoWord = pluralize('item', this.props.count);
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

        var nowShowing = this.props.nowShowing;

        return (
            <footer className="footer">
                        <span className="todo-count">
                            <strong>{this.props.count}</strong> {activeTodoWord} left
                        </span>
                <ul className="filters">
                    <li>
                        <Link to="/" className={classNames({selected: nowShowing === 'ALL' })}>
                            All
                        </Link>
                    </li>
                    {' '}
                    <li>
                        <Link to="/active" className={classNames({selected: nowShowing === 'ACTIVE' })}>
                            Active
                        </Link>
                    </li>
                    {' '}
                    <li>
                        <Link to="/completed" className={classNames({selected: nowShowing === 'COMPLETED'})}>
                            Completed
                        </Link>
                    </li>
                </ul>
                {clearButton}
            </footer>
        );
    }

}

export default TodoFooter;