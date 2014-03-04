function newTodo() {
    // get the title
    var title = document.getElementById("title");
    var ul = document.getElementById ("todolist_ul");
    // create a new <li>title</li>
    var li = document.createElement("li");
    li.innerText = title.value;
    // add the <li> to the <ul>
    ul.appendChild(li);
    event.preventDefault();
    event.stopPropagation();
}

function setDetails() {
    var li = window.event.target;
    var title = document.getElementById("detail_title");
    //var descr = document.getElementById("detail_descr"); 
    title.innerText = li.innerText;
}



