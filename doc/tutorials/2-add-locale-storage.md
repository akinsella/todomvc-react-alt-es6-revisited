Use of localStorage to store & fetch data between two sessions

Get Todo Items:

``` 
JSON.parse(localStorage.getItem('todomvc.todos')) || [],
``` 

Set Todo Items:

``` 
localStorage.setItem('todomvc.nowShowing', JSON.stringify(this.state.nowShowing));
``` 
