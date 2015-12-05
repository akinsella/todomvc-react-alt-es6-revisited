import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router';

import TodoApp from './TodoApp';

import createBrowserHistory from 'history/lib/createBrowserHistory';
const history = createBrowserHistory();

let routes = (
    <Router history={history}>
        <Route path='/' component={ TodoApp } />
        <Route path='active' component={ TodoApp } />
        <Route path='completed' component={ TodoApp } />
    </Router>
);

ReactDOM.render(routes, document.getElementsByClassName('todoapp')[0]);
