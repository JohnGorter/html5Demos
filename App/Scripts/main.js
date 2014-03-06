$(function(){
    $("input").change(function(event){
        validateForm(this);    
    });
    
    $.ajax({url:'/Todo/GetTodos', dataType:'JSON', cache:false, success:function(data){
        for(var i = 0; i < data.length; i++)
            addTodo(data[i].title, data[i].description, false);
    }});
    
    $("#tul").keyup(function(e){
                $("#tul").trigger('indexchange', [ "keycode", e.keyCode]);
    });
    $("#tul").on("indexchange", function(event, param1, param2){
        var index = $("#tul li.selected").index();
        var max = $("#tul li").size()-1;
        param2 == 40 ? index++ : param2 == 38 ? index-- : index;
        if (index < 0) { index = 0;}
        if (index > max) { index = max;}
        $("#tul li").removeClass("selected");
        $($("#tul li")[index]).addClass("selected").trigger("click");
        
        });
    
   // set the badge counter to the number of LI items
   $("#badge").text($("#tul li").size());
   // set click function of the panel to hide the panel
   $("#btnAlert").click(function(){ $("#aPanel").hide()});
   $("#btnDialog").click(function(){
        $("#t").val("");
        $("#d").val("");
        resetForm();
    }); 
   // add a new todo item to the unordered list
   $("#bS").click(function() {
        addTodo($("#t").val(), $("#d").val(), true);
   });
});

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

    $.ajax({ url: '/todo/deleteTodo', cache: false, dataType: 'JSON', data: {
        'title': title 
    }});
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
        $("input").each(function(index, element){
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
    if (validateForm())
    {
        event.preventDefault();
        event.stopPropagation();
        return;
    }
    
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
           $.ajax({ url: '/todo/AddTodo', cache: false, dataType: 'JSON', data: {
               'title': title, 'description': description
           }, success: function (data) {
               alert(data);
           } 
           });
       }
          
    
}
   
