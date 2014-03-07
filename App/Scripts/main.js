var todos = new Array();

$(function () {

    var color = navigator.onLine ? 'green' : 'red';
    $("body").css('background-color', color);

    window.addEventListener('online', function () {
        console.log("Start syncing data...");
        $("body").css('background-color', 'green');
    });
    window.addEventListener('offline', function () {
        $("body").css('background-color', 'red');
    });

          
    navigator.geolocation.getCurrentPosition(function (e) {
        $.ajax({ url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng='
               + e.coords.latitude + ',' + e.coords.longitude + '&sensor=false',
            cache: true,
            success: function (data) {
                $("#footer").append("<br/>You are located nearby '" + data.results[0].formatted_address + "'");
            }
        });
    }, function () {
        $("#footer").append("<br/>No location information available.");
    });

    $("#todolist").on('dragover', function (e) {
        $(this).addClass("thickBorder");
        window.event.preventDefault();
        return false;
    });
    $("#todolist").on('dragleave', function (e) {
        $(this).removeClass("thickBorder");
        window.event.preventDefault();
        return false;
    });
    $("#todolist").on('dragend', function (e) {
        $(this).removeClass("thickBorder");
        window.event.preventDefault();
        return false;
    });
    $("#todolist").on('drop', function (e) {
        $(this).removeClass("thickBorder");
        insertTodos(window.event.dataTransfer.files[0]);
        window.event.preventDefault();
        window.event.stopPropagation();
        return false;
    });

    $("input").change(function (event) {
        validateForm(this);
    });

    if (navigator.onLine) {
        console.log("Retrieving items from the server...");
        // $.ajax({url:'/Todo/GetTodos', dataType:'JSON', cache:false, success:function(data){
        //     for(var i = 0; i < data.length; i++)
        //         addTodo(data[i].title, data[i].description, false);
        // }});
    } else {
        console.log("Retrieving items from the client...");
        if (window.localStorage["todos"]) {
            todos = JSON.parse(window.localStorage["todos"]);
            addTodosFromArray(todos, false);
        }
    }

    $("#tul").keyup(function (e) {
        $("#tul").trigger('indexchange', ["keycode", e.keyCode]);
    });
    $("#tul").on("indexchange", function (event, param1, param2) {
        var index = $("#tul li.selected").index();
        var max = $("#tul li").size() - 1;
        param2 == 40 ? index++ : param2 == 38 ? index-- : index;
        if (index < 0) { index = 0; }
        if (index > max) { index = max; }
        $("#tul li").removeClass("selected");
        $($("#tul li")[index]).addClass("selected").trigger("click");

    });

    // set the badge counter to the number of LI items
    $("#badge").text($("#tul li").size());
    // set click function of the panel to hide the panel
    $("#btnAlert").click(function () { $("#aPanel").hide() });
    $("#btnDialog").click(function () {
        $("#t").val("");
        $("#d").val("");
        resetForm();
    });
    // add a new todo item to the unordered list
    $("#bS").click(function () {
        if (validateForm()) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        addTodo($("#t").val(), $("#d").val(), true);
    });
});

function exists(title, arrayofobjects) {
    for (obj in arrayofobjects)
        if (arrayofobjects[obj].title == title) {
            return true;
        }
    return false;
}

function insertTodos(todosfile) {
    var reader = new FileReader();
    reader.onload = function (data) {
        var imported = JSON.parse(data.target.result);
        for (imp in imported) {
            if (!exists(imported[imp].title, todos))
                todos.push(imported[imp]);
        }
        window.localStorage["todos"] = JSON.stringify(todos);
        addTodosFromArray(todos, true);
    }
    reader.readAsText(todosfile);
}
function addTodosFromArray(todoarray, save) {
    $("#tul").html("");
    for (var i = 0; i < todoarray.length; i++)
        addTodo(todoarray[i].title, todoarray[i].description, false);
}

function deleteTodo(element, title) {
    $(element).parent().fadeOut("slow", function () {
        // remove the parent LI after the LI has fully faded out
        $(element).parent().remove();
        // $("#dt").text("-nothing selected-");
        $("#dd").text("-nothing selected-");
        // reset the badge counter to the current LI count
        $("#badge").text($("#tul li").size());
    });
    // set the information panel text to Item Deleted and show the panel for 2 seconds
    $("#aPanel span").text("Item Deleted!").parent().show().delay(2000).fadeOut();

    //$.ajax({ url: '/todo/deleteTodo', cache: false, dataType: 'JSON', data: {
    //    'title': title 
    //}});
    var newtodos = new Array();
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].title == title) continue;
        newtodos.push(todos[i]);
    }
    todos = newtodos;
    window.localStorage["todos"] = JSON.stringify(todos);
}

function resetForm() {
    $(".error").hide();
    $("input").removeClass("inputerror");
}

function validateForm(element) {

    var error = false;

    if (element != undefined) {
        if (!element.checkValidity()) {
            $(".error", $(element).parent()).fadeIn();
            $(element).addClass("inputerror");
            error = true;
        } else {
            $(".error", $(element).parent()).fadeOut();
            $(element).removeClass("inputerror");
        }
    } else {
        resetForm();
        $("input").each(function (index, element) {
            if (!element.checkValidity()) {
                $(".error", $(element).parent()).fadeIn();
                $(element).addClass("inputerror");
                error = true;
            }
        });
    }
    return error;
}


function addTodo(title, description, save) {
    $("<li>").append(
    // append a <span> to the LI containing the title of the title input
           $("<span>").addClass("t").text(title)
       ).append(
    // append a <span> to the LI containing the description of the description input
           $("<span>").addClass("h").text(description)
       ).append(
    // append a <span> for the done icon and handle the done click 
       $("<span>").addClass("d glyphicon glyphicon-ok").click(function () {
           deleteTodo(this, title);
       }
       )).click(function (e) {
           //$("#dt").text($(".t", this).text());
           $("#tul li").removeClass("selected");
           $(this).addClass("selected");
           $("#dd").text($(".h", this).text());
       }
       ).appendTo("#tul");
    // set the information panel text to Item Added and show the panel for 2 seconds
    $("#aPanel span").text("Item Added!").parent().show().delay(2000).fadeOut();
    // reset the badge counter to the current LI count
    $("#badge").text($("#tul li").size());

    if (save) {
        if (navigator.onLine) {
            console.log("storing item on the server..."); 
            //   $.ajax({ url: '/todo/AddTodo', cache: false, dataType: 'JSON', data: {
            //      'title': title, 'description': description
            //  }, success: function (data) {
            //      alert(data);
            //  } 
            //  });
        } else {
            console.log("storing item on the client..."); 
            todos.push({ "title": title, "description": description });
            window.localStorage["todos"] = JSON.stringify(todos);
            //   $.ajax({ url: '/todo/AddTodo', cache: false, dataType: 'JSON', data: {
            //      'title': title, 'description': description
            //  }, success: function (data) {
            //      alert(data);
            //  } 
            //  });
        }
    }


}
   
