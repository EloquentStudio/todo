function inputForTask(tasklistId) {
  return (
    "<div class = 'row card-body'>"+
    "<div class = 'col-sm-12'>"+
    "<input type= 'textfield' class='form-control' id=newTask><br></div>" +
    "<div class = 'col-sm-2 pull-right'><button class='btn btn-danger' onClick='createTask(" +
    tasklistId +
    ")'>Save</button></div>"+
    "<div class = 'col-sm-3 align-self-end' ><div onclick = 'restoreCreateTask()'>Cancel</div></div></div>"
  );
}

var taskNamePartial = [];
var taskChecked =[];
function restoreTask(tasklistId,taskId) {
  console.log("i am calling");
  $("#card" + taskId).empty();
  $("#card" + taskId).append(restoreTaskView(tasklistId,taskId));
}

function restoreTaskView(tasklistId,taskId){
  return "<div class = 'col-sm-1 align-self-center'>"+
  "<input id='checkbox'"+taskId+" type = 'checkbox' checked= '"+taskChecked[taskId]+"' onclick = 'updateTaskStatus("+tasklistId+","+taskId+")'>"+
  "</div>"+
  "<div class = 'col-sm-8 align-self-center'>"+
  "<div id ='task"+taskId+"' onclick = 'renderUpdate("+tasklistId+","+taskId+")'>"+taskNamePartial[taskId]+"</div>"+
  "</div>"+
  "<div class = 'col-sm-1 align-self-center'>"+
  "<span class = 'fa fa-edit' id = 'taskUpdate' onclick = 'renderUpdate("+tasklistId+","+taskId+")'>"+
  "</div>"+
  "<div class = 'col-sm-1 align-self-center'>"+
  "<span class = 'fa fa-tash' id = 'taskDelete' onclick = 'deleteTask("+tasklistId+","+taskId+")'>"+
  "</div>"
}

function inputForTasklist() {
  return "<div class='row'>"+
  "<div class='row'>"+
  "<div class = 'col-sm-12'>"+
  "<input type='textfield' class = 'form-control' id='tasklistnew'><br>"+
  "</div></div>"+
  "<div class ='row'>"+
  "<div class = 'col-sm-4'>"+
  "<span class = 'btn btn-danger' onClick=createTasklist()>"+
  "Create"+
  "</span>"+
  "</div>"+
  "<div class = 'col-sm-3 align-self-end pull-right'>"+
  "<span class= 'col-sm-6' onclick='restoreCreateTasklist()'>Cancel</span></div></div>";
}

function addTasklist() {
  $("#newtasklist").html(inputForTasklist()).append("<br>");
}

function addTask(tasklistId) {
  if ($("#newTask").length == 0) {
    var input = inputForTask(tasklistId);
    $('#newtasks').show();
    $("#newtasks").addClass("card");
    $("#newtasks").append(input);
  }
}

function renderTask(tasklistId, tasklistCount) {
  $.ajax({
    url: "/tasklists/" + tasklistId + "/render_tasks",
    success: function(result) {
      $("#tasks").html(result);
    }
  });
  setSelectedTasklist(tasklistCount);
}

function renderUpdate(tasklistId, taskId) {
  if (
    $("#task" + taskId).prop("tagName") == "DIV" &&
    $("#task" + taskId).find($("#inputTask" + taskId)).length == 0
  ) {
    var text = $("#task" + taskId).text();
    taskNamePartial[taskId] = text;
    taskChecked[taskId] = $('#checkbox'+taskId).prop("checked");
    $("#card" + taskId).html(
      "<div class = 'col-sm-12' >"+
      "<input class = 'form-control' type='textfield' id='inputTask" +
        taskId +
        "' value='" +
        text +
        "'><br></div>"+
        "<div class= 'col-sm-2'> " +
        "<button class='btn btn-danger' onClick=updateTask(" +
        tasklistId +
        "," +
        taskId +
        ")>Save</button></div>" +
        "<div class = 'col-sm-2 align-self-end'>"+
        "<a onclick=restoreTask(" +
        tasklistId +","+ taskId+
        ")>Cancel</a></div>"
    );
  }
}
function createTasklist() {
  Rails.ajax({
    type: "post",
    url: "/tasklists",
    data: "name=" + $("#tasklistnew").val(),
    success: function(data) {
      $("#tasklists").append($(data).find('DIV')[0]).append("<br>");
      $('#newtasklist').empty();
      $('#tasklistnew').val("");
      $('#tasklists').find('.tasklist_list').click();
    }
  });
}

function updateTasklist(tasklistId) {
  Rails.ajax({
    type: "put",
    url: "/tasklists/" + tasklistId + "/",
    data: "name=" + $("#updateTasklistInput" + tasklistId).val(),
    success: function(data) {
      console.log(data);
      $('#tasklist_list'+tasklistId).empty();
      $('#tasklist_list'+tasklistId).append($(data).find("DIV")[1]).append($(data).find("DIV")[1]).append($(data).find("DIV")[1]);
    }
  });
}
function createTask(tasklistId) {
  Rails.ajax({
    type: "post",
    url: "tasklists/" + tasklistId + "/tasks/",
    data: "name=" + $("#newTask").val(),
    success: function(data) {
      $(".tab-content").append($(data).find('DIV')[0]).append("<br>");
      restoreCreateTask();
    }
  });
}

function updateTask(tasklistId, taskId) {
  Rails.ajax({
    type: "put",
    url: "tasklists/" + tasklistId + "/tasks/" + taskId,
    data: "name=" + $("#inputTask" + taskId).val(),
    success: function(data) {
      console.log(data);
      $("#card"+taskId).empty();
      $("#card"+taskId).append($(data).find('DIV')[3]).append($(data).find('DIV')[3])
      .append($(data).find('DIV')[3])
      .append($(data).find('DIV')[3])
      .append("<br>");
    }
  });
}

function deleteTask(tasklistId, taskId) {
  Rails.ajax({
    type: "delete",
    url: "tasklists/" + tasklistId + "/tasks/" + taskId,
    success: function(data) {
      $('#tasklist'+tasklistId).click();
    }
  });
}

function setSelectedTasklist(selectedTasklist) {
  console.log(selectedTasklist);
  localStorage.setItem("selectedTasklistCount", selectedTasklist);
}

function defaultSelectedTasklist() {
  $(document).ready(function() {
    console.log(localStorage.getItem("selectedTasklistCount"));
    if (localStorage.getItem("selectedTasklistCount") === null) {
      $(document)
        .find(".tasklist_list")[0]
        .click();
    } else{
    $(document)
        .find(".tasklist_list")[
        localStorage.getItem("selectedTasklistCount")].click();
  }});
}
defaultSelectedTasklist();

function inputForUpdateTasklist(tasklistId,index) {
  return (
    "<div class='row'>"+
    "<div class='col-sm-12'>" +
    "<input type='textfield' class='form-control' id='updateTasklistInput" +
    tasklistId +
    "' value='"+$('#tasklist'+tasklistId).text() + "'><br></div></div><div class='row align-middle'>"+
    "<div class='col-sm-4'>" +
    "<span class ='btn btn-danger' onclick=updateTasklist(" +
    tasklistId +
    ")>Save" +
    "</span></div>"+
    "<div class='col-sm-3 align-self-end' onclick=restoreUpdateTasklist("+tasklistId+","+index+")>"+
    "<span class = 'col-sm-6'>Cancel</span>"+
    "</div></div>");
}

function restoreUpdateTasklistView(tasklistId,index){
return (
"<div class = 'col-sm-8'>"+
  "<div class = 'tasklist_list' id='tasklist"+tasklistId+"' onclick = 'renderTask("+tasklistId+","+index+")'>"+
  tasklistNamePartial[tasklistId]+
  "</div>"+
  "</div>"+
  "<div class = 'col-sm-1'>"+
  "<div class= 'fa fa-edit pull-right' id ='update' onclick = 'renderUpdateTasklist("+tasklistId+","+index+")'></div> "+
  "</div>"+
  "<div class = 'col-sm-1'>"+
  "<div class= 'fa fa-trash-alt pull-right' id ='delete' data-method = 'delete' href='/tasllists/'"+tasklistId+")></div> "+
  "</div>")
}

function restoreUpdateTasklist(tasklistId,index) {
  $("#tasklist_list" + tasklistId).html(restoreUpdateTasklistView(tasklistId,index));
}

var tasklistNamePartial = [];
var tasklistIndex = [];
function renderUpdateTasklist(tasklistId,index) {
  tasklistNamePartial[tasklistId] = $("#tasklist" + tasklistId).text();
  console.log(tasklistNamePartial[tasklistId])
  tasklistIndex = index;
  $("#tasklist_list" + tasklistId).html(inputForUpdateTasklist(tasklistId,index));
}

function updateTaskStatus(tasklistId,taskId){
Rails.ajax({
  url: "/tasklists/"+tasklistId+"/tasks/"+taskId+"/checkbox_update" ,
  type: 'patch',
  success: function(data){
    console.log(data);
  }
});
}

function restoreCreateTasklist(){
$('#newtasklist').empty();
}

function restoreCreateTask(){
  $('#newtasks').empty();
  $('#newtasks').removeClass("card");

}