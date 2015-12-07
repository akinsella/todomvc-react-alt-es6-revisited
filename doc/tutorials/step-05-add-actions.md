
# TodoMVC - React, Alt, ES6 revisited


## Step 5 - Add Actions 

####Scafold
``` 
yo react-webpack-alt:action Todo
```

####Create actions
Add some actions in constructor of TodoActions:

```
  this.generateActions(
    'toggleAll',
    'toggle',
    'destroy',
    'save',
    'clearCompleted',
    'edit',
    'show'
  );
}
```


