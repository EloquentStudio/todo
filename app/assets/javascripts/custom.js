function inputForTask(tasklistId) {
  return (
    "<input type='textfield' id=newTask><br>" +
    "<br><button class='btn btn-danger' onClick='createTask(" +
    tasklistId +
    ")' >" +
    "Add Task</button><br><br>"
  );
}

var taskNamePartial = [];
function restoreTask(taskId) {
  $("#task" + taskId).html(taskNamePartial[taskId]);
  console.log($("#task" + taskId).html() + taskId);
}

function inputForTasklist() {
  $('#newtasklist').show();
  return "<input type='textfield' id='tasklistnew'> <br><br><button class = 'btn btn-primary' onClick=createTasklist()>Create Tasklist</button><br><br>";
}

function addTasklist() {
  $("#newtasklist").html(inputForTasklist());
}

function addTask(tasklistId) {
  if ($("#newTask").length == 0) {
    var input = inputForTask(tasklistId);
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
    $("#task" + taskId).html(
      "<input type='textfield' id='inputTask" +
        taskId +
        "' value='" +
        text +
        "'> " +
        "<button class='btn btn-primary' onClick=updateTask(" +
        tasklistId +
        "," +
        taskId +
        ")>Update</button>" +
        "<button class='fa fa-times-circle btn' onclick=restoreTask(" +
        taskId +
        ")/>"
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
      $('#newtasklist').hide();
      $('#tasklistnew').val("");
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
      console.log($("#newTask").val());
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
      $('#newTasks').hide();
      $('#newTask').text("");
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
    }
  });
}

function deleteTask(tasklistId, taskId) {
  Rails.ajax({
    type: "delete",
    url: "tasklists/" + tasklistId + "/tasks/" + taskId,
    success: function(data) {
      console.log(data);
    }
  });
}

function setSelectedTasklist(selectedTasklist) {
  localStorage.setItem("selectedTasklistCount", selectedTasklist);
}

function defaultSelectedTasklist() {
  $(document).ready(function() {
    console.log(localStorage.getItem("selectedTasklistCount"));
    if (typeof (Storage) !== 'undefine') {
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

function inputForUpdateTasklist(tasklistId) {
  return (
    "<div class='col-sm-8 float-left'>" +
    "<input type='textfield' class='col-sm-12' id='updateTasklistInput" +
    tasklistId +
    "' value='"+$('#tasklist'+tasklistId).text() + "'>"+
    "</div>" +
    "<div class='col-sm-1 float-right'>" +
    "<Button class='btn fa fa-edit' onclick=updateTasklist(" +
    tasklistId +
    ")/>" +
    "</div>" +
    "<div class='col-sm-1 float-right'>" +
    "<Button class='btn far fa-times-circle' onclick=restoreTasklist(" +
    tasklistId +
    ")/>" +
    "</div>"
  );
}

function restoreTasklist(tasklistId) {
  $("#tasklist" + tasklistId).html(tasklistNamePartial[tasklistId]);
}

var tasklistNamePartial = [];

function renderUpdateTasklist(tasklistId) {
  tasklistNamePartial[tasklistId] = $("#tasklist" + tasklistId).text();
  $("#tasklist_list" + tasklistId).html(inputForUpdateTasklist(tasklistId));
}
