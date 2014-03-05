$(function(){
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
    }); 
   // add a new todo item to the unordered list
   $("#bS").click(function() {
       $("<li>").append(
           // append a <span> to the LI containing the title of the title input
           $("<span>").addClass("t").text($("#t").val())
       ).append(
           // append a <span> to the LI containing the description of the description input
           $("<span>").addClass("h").text($("#d").val())
       ).append(
           // append a <span> for the done icon and handle the done click 
           $("<span>").addClass("d glyphicon glyphicon-ok").click(function(){
               $(this).parent().fadeOut("slow", function() {
                   // remove the parent LI after the LI has fully faded out
                   $(this).remove();
                  // $("#dt").text("-nothing selected-");
                   $("#dd").text("-nothing selected-");
                   // reset the badge counter to the current LI count
                   $("#badge").text($("#tul li").size());
               });
               // set the information panel text to Item Deleted and show the panel for 2 seconds
               $("#aPanel span").text("Item Deleted!").parent().show().delay(2000).fadeOut();
           }
       )).click(function(e){
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
   });
});
   
