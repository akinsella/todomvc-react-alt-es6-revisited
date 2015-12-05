import alt from 'components/Dispatcher';

class TodoActions {

    constructor() {

        this.generateActions(
            'toggleAll',
            'toggle',
            'addTodo',
            'destroy',
            'save',
            'clearCompleted',
            'edit',
            'show'
        );
    }

}

export default alt.createActions(TodoActions);
