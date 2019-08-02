$(document).ready(function() {
  $("#newTasklistButton").on("click", addTasklist);
  $(".tasklist_list").on("click", renderTask);
  $(".tasklistUpdateButton").on("click", renderUpdateTasklist);
});

function inputForTask(tasklistId) {
  return (
    "<div class = 'row card-body'>" +
    "<div class = 'col-sm-12'>" +
    "<input type= 'textfield' class='form-control' id=newTask><br></div>" +
    "<div class = 'col-sm-2 pull-right'><button class='createNewTaskButton btn btn-danger' data-tasklistid = " +
    tasklistId +
    "'>Save</button></div>" +
    "<div class = 'col-sm-3 align-self-end'><div class = 'cancelNewTaskButton'>Cancel</div></div></div>"
  );
}

var taskNamePartial = [];
var taskChecked = [];

function restoreTask() {
  tasklistId = $(this).data("tasklistid");
  taskId = $(this).data("taskid");
  $("#card" + taskId).empty();
  $("#card" + taskId).append(restoreTaskView(tasklistId, taskId));
  if (taskChecked[taskId] == true) {
    $("#checkbox" + taskId).attr("checked", "checked");
  }
  $(".taskname").on("click", renderUpdate);
  $(".taskUpdate").on("click", renderUpdate);
  $(":checkbox").on("click", updateTaskStatus);
}

function restoreTaskView(tasklistId, taskId) {
  return (
    "<div class = 'col-sm-1 align-self-center'>" +
    "<input id='checkbox" +
    taskId +
    "' type = 'checkbox' data-tasklistid = " +
    tasklistId +
    " data-taskid = " +
    taskId +
    ">" +
    "</div>" +
    "<div class = 'col-sm-8 align-self-center'>" +
    "<div class = 'taskname' id ='task" +
    taskId +
    "' data-tasklistid = " +
    tasklistId +
    " data-taskid = " +
    taskId +
    ">" +
    taskNamePartial[taskId] +
    "</div>" +
    "</div>" +
    "<div class = 'col-sm-1 align-self-center'>" +
    "<span class = 'fa fa-edit taskUpdate' id = 'taskUpdate' data-tasklistid = " +
    tasklistId +
    " data-taskid = " +
    taskId +
    ">" +
    "</div>" +
    "<div class = 'col-sm-1 align-self-center'>" +
    "<span class = 'far fa-trash-alt taskDelete' data-tasklistid = " +
    tasklistId +
    " data-taskid = " +
    taskId +
    " id = 'taskDelete'>" +
    "</div>"
  );
}

function inputForTasklist() {
  return (
    "<div class='row'>" +
    "<div class='row'>" +
    "<div class = 'col-sm-12'>" +
    "<input type='textfield' class = 'form-control' id='tasklistnew'><br>" +
    "</div></div>" +
    "<div class ='row'>" +
    "<div class = 'col-sm-4'>" +
    "<span id='createTasklistButton' class = 'btn btn-danger'>" +
    "Create" +
    "</span>" +
    "</div>" +
    "<div class = 'col-sm-3 align-self-end pull-right'>" +
    "<span id='cancelCreateTasklist' class= 'col-sm-6'>Cancel</span></div></div>"
  );
}

function addTasklist() {
  $("#newtasklist")
    .html(inputForTasklist())
    .append("<br>");
  $("#createTasklistButton").on("click", createTasklist);
  $("#cancelCreateTasklist").on("click", restoreCreateTasklist);
}

function addTask() {
  if ($("#newTask").length == 0) {
    var input = inputForTask($(this).data("tasklistid"));
    $("#newtasks").show();
    $("#newtasks").addClass("card");
    $("#newtasks").append(input);
    $(".createNewTaskButton").on("click", createTask);
    $(".cancelNewTaskButton").on("click", restoreCreateTask);
  }
}

function renderTask() {
  tasklistId = $(this).data("tasklistid");
  index = $(this).data("index");
  $.ajax({
    url: "/tasklists/" + tasklistId + "/render_tasks",
    success: function(result) {
      $("#tasks").html(result);
      $("#addTaskButton").on("click", addTask);
      $(".taskname").on("click", renderUpdate);
      $(".taskUpdate").on("click", renderUpdate);
      $(".taskDelete").on("click", deleteTask);
      $(":checkbox").on("click", updateTaskStatus);
    }
  });
  setSelectedTasklist(index);
}
function updateTaskView(tasklistId, taskId) {
  var text = $("#task" + taskId).text();
  return (
    "<div class = 'col-sm-12' >" +
    "<input class = 'form-control' type='textfield' id='inputTask" +
    taskId +
    "' value='" +
    text +
    "'><br></div>" +
    "<div class= 'col-sm-2'> " +
    "<button class='btn btn-danger updateTaskSaveButton' data-tasklistid = " +
    tasklistId +
    " data-taskid = " +
    taskId +
    "> Save </button></div>" +
    "<div class = 'col-sm-2 align-self-end'>" +
    "<a class = 'updateTaskCancelButton' data-tasklistid = " +
    tasklistId +
    " data-taskid = " +
    taskId +
    ">Cancel</a></div>"
  );
}
function renderUpdate() {
  tasklistId = $(this).data("tasklistid");
  taskId = $(this).data("taskid");
  if (
    $("#task" + taskId).prop("tagName") == "DIV" &&
    $("#task" + taskId).find($("#inputTask" + taskId)).length == 0
  ) {
    var text = $("#task" + taskId).text();
    taskNamePartial[taskId] = text;
    taskChecked[taskId] = $("#checkbox" + taskId).prop("checked");
    $("#card" + taskId).html(updateTaskView(tasklistId, taskId));
    $(".updateTaskSaveButton").on("click", updateTask);
    $(".updateTaskCancelButton").on("click", restoreTask);
    $(":checkbox").on("click", updateTaskStatus);
  }
}
function createTasklist() {
  Rails.ajax({
    type: "post",
    url: "/tasklists",
    data: "name=" + $("#tasklistnew").val(),
    success: function(data) {
      $("#tasklists")
        .append($(data).find("DIV")[0])
        .append("<br>");
      $("#newtasklist").empty();
      $("#tasklistnew").val("");
      $("#tasklists")
        .find(".tasklist_list")
        .click();
      $(".tasklist_list").on("click", renderTask);
      $(".tasklistUpdateButton").on("click", renderUpdateTasklist);
    }
  });
}

function updateTasklist() {
  tasklistId = $(this).data("tasklistid");
  Rails.ajax({
    type: "put",
    url: "/tasklists/" + tasklistId + "/",
    data: "name=" + $("#updateTasklistInput" + tasklistId).val(),
    success: function(data) {
      $("#tasklist_list" + tasklistId).empty();
      $("#tasklist_list" + tasklistId)
        .append($(data).find("DIV")[1])
        .append($(data).find("DIV")[1])
        .append($(data).find("DIV")[1]);
      $(".tasklistUpdateButton").on("click", renderUpdateTasklist);
    }
  });
}
function createTask() {
  tasklistId = $(this).data("tasklistid");
  Rails.ajax({
    type: "post",
    url: "tasklists/" + tasklistId + "/tasks/",
    data: "name=" + $("#newTask").val(),
    success: function(data) {
      $(".tab-content")
        .append($(data).find("DIV")[0])
        .append("<br>");
      restoreCreateTask();
      $(".taskDelete").on("click", deleteTask);
      $(":checkbox").on("click", updateTaskStatus);
    }
  });
}

function updateTask() {
  tasklistId = $(this).data("tasklistid");
  taskId = $(this).data("taskid");
  Rails.ajax({
    type: "put",
    url: "tasklists/" + tasklistId + "/tasks/" + taskId,
    data: "name=" + $("#inputTask" + taskId).val(),
    success: function(data) {
      $("#card" + taskId).empty();
      $("#card" + taskId)
        .append($(data).find("DIV")[3])
        .append($(data).find("DIV")[3])
        .append($(data).find("DIV")[3])
        .append($(data).find("DIV")[3])
        .append("<br>");
      $(".taskname").on("click", renderUpdate);
      $(".taskUpdate").on("click", renderUpdate);
    }
  });
}

function deleteTask(tasklistId, taskId) {
  tasklistId = $(this).data("tasklistid");
  taskId = $(this).data("taskid");
  Rails.ajax({
    type: "delete",
    url: "tasklists/" + tasklistId + "/tasks/" + taskId,
    success: function(data) {
      $("#tasklist" + tasklistId).click();
    }
  });
}

function setSelectedTasklist(selectedTasklist) {
  localStorage.setItem("selectedTasklistCount", selectedTasklist);
}

function defaultSelectedTasklist() {
  $(document).ready(function() {
    if (localStorage.getItem("selectedTasklistCount") === null) {
      $(document)
        .find(".tasklist_list")[0]
        .click();
    } else {
      $(document)
        .find(".tasklist_list")
        [localStorage.getItem("selectedTasklistCount")].click();
    }
  });
}

defaultSelectedTasklist();

function inputForUpdateTasklist(tasklistId, index) {
  return (
    "<div class='row'>" +
    "<div class='col-sm-12'>" +
    "<input type='textfield' class='form-control' id='updateTasklistInput" +
    tasklistId +
    "' value='" +
    $("#tasklist" + tasklistId).text() +
    "'><br></div></div><div class='row align-middle'>" +
    "<div class='col-sm-4'>" +
    "<span class ='btn btn-danger saveUpdateTasklistButton' data-tasklistid = " +
    tasklistId +
    "> Save" +
    "</span></div>" +
    "<div class='col-sm-3 align-self-end'>" +
    "<span class = 'col-sm-6 cancelUpdateTasklistButton' data-tasklistid = " +
    tasklistId +
    " data-index = " +
    index +
    ">Cancel</span>" +
    "</div></div>"
  );
}

function restoreUpdateTasklistView(tasklistId, index) {
  return (
    "<div class = 'col-sm-8'>" +
    "<div class = 'tasklist_list' id='tasklist" +
    tasklistId +
    "' data-tasklistid = " +
    tasklistId +
    " data-index = " +
    index +
    ">" +
    tasklistNamePartial[tasklistId] +
    "</div>" +
    "</div>" +
    "<div class = 'col-sm-1'>" +
    "<div class= 'fa fa-edit pull-right tasklistUpdateButton' id ='update' data-tasklistid = " +
    tasklistId +
    " data-index = " +
    index +
    ")'></div> " +
    "</div>" +
    "<div class = 'col-sm-1'>" +
    "<div class= 'fa fa-trash-alt pull-right' id ='delete' data-method = 'delete' href='/tasklists/'" +
    tasklistId +
    ")></div> " +
    "</div>"
  );
}

function restoreUpdateTasklist() {
  tasklistId = $(this).data("tasklistid");
  index = $(this).data("index");
  $("#tasklist_list" + tasklistId).html(
    restoreUpdateTasklistView(tasklistId, index)
  );
  $(".tasklistUpdateButton").on("click", renderUpdateTasklist);
}

var tasklistNamePartial = [];
var tasklistIndex = [];

function renderUpdateTasklist() {
  tasklistId = $(this).data("tasklistid");
  index = $(this).data("index");
  tasklistNamePartial[tasklistId] = $("#tasklist" + tasklistId).text();
  tasklistIndex = index;
  $("#tasklist_list" + tasklistId).html(
    inputForUpdateTasklist(tasklistId, index)
  );
  $(".saveUpdateTasklistButton").bind("click", updateTasklist);
  $(".cancelUpdateTasklistButton").bind("click", restoreUpdateTasklist);
}

function updateTaskStatus() {
  tasklistId = $(this).data("tasklistid");
  taskId = $(this).data("taskid");
  Rails.ajax({
    url: "/tasklists/" + tasklistId + "/tasks/" + taskId + "/toggle_status",
    type: "patch",
    success: function(data) {}
  });
}

function restoreCreateTasklist() {
  $("#newtasklist").empty();
}

function restoreCreateTask() {
  $("#newtasks").empty();
  $("#newtasks").removeClass("card");
  $(".taskname").on("click", renderUpdate);
  $(".taskUpdate").on("click", renderUpdate);
}
