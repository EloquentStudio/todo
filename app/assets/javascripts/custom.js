$(document).ready(function() {
  const selectedTasklist = localStorage.getItem("selectedTasklistCount");
  $("#newTasklistButton").on("click", addTasklist);
  $(".tasklist_list").on("click", renderTask);
  $("#tasklists").on("click", ".tasklist_list" ,renderTask);
  $("#tasklists").on("click", ".tasklistUpdateButton", renderUpdateTasklist);
  $(".tasklistname").on("click", ".tasklistUpdateButton", renderUpdateTasklist);
  $("#tasks").on("click", ".taskname", renderUpdate);
  $("#tasks").on("click", ".taskUpdate", renderUpdate);
  $(":checkbox").on("click", updateTaskStatus);
  $("#newtasklist").on("click", "#createTasklistButton", createTasklist);
  $("#newtasklist").on("click", "#cancelCreateTasklist", restoreCreateTasklist);
  $("#tasks").on("click", ".createNewTaskButton", createTask);
  $("#tasks").on("click", ".cancelNewTaskButton", restoreCreateTask);
  $("#tasks").on("click", "#addTaskButton", addTask);
  $("#tasks").on("click", ".taskDelete", deleteTask);
  $("#tasks").on("click", ".updateTaskSaveButton", updateTask);
  $("#tasks").on("click", ".updateTaskCancelButton", restoreTask);
  $("#tasklists").on("click", ".saveUpdateTasklistButton" ,updateTasklist);
  $("#tasklists").on("click", ".cancelUpdateTasklistButton" ,restoreUpdateTasklist);
  if (selectedTasklist === null) {
  } else {
    $(document)
      .find("#tasklist" + selectedTasklist)
      .click();
    setSelectedTasklist(selectedTasklist);
  }
});

function inputForTask() {
  return (
    "<li class = 'list-group-item'>" +
    "<div class = 'row'>" +
    "<div class = 'col-sm-12'>" +
    "<input type= 'textfield' class='form-control' id=newTask><br></div>" +
    "<div class = 'col-sm-2 pull-right'><button class='createNewTaskButton btn btn-danger' data-tasklistid = {{tasklistId}}>Save</button></div>" +
    "<div class = 'col-sm-3 align-self-end'><div class = 'cancelNewTaskButton'>Cancel</div></div></div></li>"
  );
}

function restoreTask() {
  const tasklistId = $(this).data("tasklistid");
  const taskId = $(this).data("taskid");
  const title = $("#card" + taskId).data("title");
  $("#card" + taskId).empty();
  $("#card" + taskId).append(Mustache.render(taskView(),{tasklistId: tasklistId, taskId: taskId,title: title}));
  if ($("#card" + taskId).data("status") == true) {
    $("#checkbox" + taskId).attr("checked", "checked");
  }
}

function taskView() {
  return (
    "<div class = 'col-sm-1 align-self-center'>" +
    "<input id='checkbox{{taskId}}' type = 'checkbox' data-tasklistid = " +
    "{{tasklistId}} data-taskid = {{taskId}}>"+
    "</div>" +
    "<div class = 'col-sm-8 align-self-center'>" +
    "<div class = 'taskname' id ='task{{taskId}}' data-tasklistid = " +
    "{{tasklistId}} data-taskid = {{taskId}}>{{title}}</div>" +
    "</div>" +
    "<div class = 'col-sm-1 align-self-center'>" +
    "<span class = 'fa fa-edit taskUpdate' id = 'taskUpdate' data-tasklistid = " +
    "{{tasklistId}} data-taskid = {{taskId}}>" +
    "</div>" +
    "<div class = 'col-sm-1 align-self-center'>" +
    "<span class = 'far fa-trash-alt taskDelete' data-tasklistid = " +
    "{{tasklistId}} data-taskid = {{taskId}} id = 'taskDelete'>" +
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
    "<div class = 'col-sm-6'>" +
    "<span id='createTasklistButton' class = 'btn btn-danger'>" +
    "Create" +
    "</span>" +
    "</div>" +
    "<div class = 'col-sm-6 align-self-end pull-right'>" +
    "<span id='cancelCreateTasklist' class= 'col-sm-6'>Cancel</span></div></div>"
  );
}

function addTasklist() {
  $("#newtasklist").html(Mustache.render(inputForTasklist()));
}

function addTask() {
  if ($("#newTask").length == 0) {
    const input = Mustache.render(inputForTask(),{tasklistId: $(this).data("tasklistid")});
    $("#newtasks").show();
    $("#newtasks").append(input);
  }
}

function renderTask() {
  const tasklistId = $(this).data("tasklistid");
  const index = $(this).data("index");
  $.ajax({
    url: "/tasklists/" + tasklistId + "/get_tasks",
    success: function(result) {
      $("#tasks").html(result);
    }
  });
  setSelectedTasklist(tasklistId);
}

function updateTaskView() {
  return (
    "<div class = 'col-sm-12' >" +
    "<input class = 'form-control' type='textfield' id='inputTask{{taskId}}' value='" +
    "{{text}}'><br></div>" +
    "<div class= 'col-sm-2'> " +
    "<button class='btn btn-danger updateTaskSaveButton' data-tasklistid = " +
    "{{tasklistId}} data-taskid = {{taskId}}> Save </button></div>" +
    "<div class = 'col-sm-2 align-self-end'>" +
    "<a class = 'updateTaskCancelButton' data-tasklistid = " +
    "{{tasklistId}} data-taskid = {{taskId}}>Cancel</a></div>"
  );
}
function renderUpdate() {
  const tasklistId = $(this).data("tasklistid");
  const taskId = $(this).data("taskid");
  if (
    $("#task" + taskId).prop("tagName") == "DIV" &&
    $("#task" + taskId).find($("#inputTask" + taskId)).length == 0
  ) {
    const text = $("#task" + taskId).text();
    $("#card" + taskId).attr("data-title", text);
    $("#card" + taskId).attr(
      "data-status",
      $("#checkbox" + taskId).prop("checked")
    );
    $("#card" + taskId).html(Mustache.render(updateTaskView(),{tasklistId: tasklistId, taskId: taskId,text: text}));
  }
}

function createTasklist() {
  Rails.ajax({
    type: "post",
    url: "/tasklists",
    data: "name=" + $("#tasklistnew").val(),
    success: function(data) {
    },
    error: function(data) {
    }
  });
}

function updateTasklist() {
  const tasklistId = $(this).data("tasklistid");
  Rails.ajax({
    type: "put",
    url: "/tasklists/" + tasklistId + "/",
    data: "name=" + $("#updateTasklistInput" + tasklistId).val(),
    success: function(data) {
    },
    error: function(data) {
    }
  });
}
function createTask() {
  const tasklistId = $(this).data("tasklistid");
  Rails.ajax({
    type: "post",
    url: "tasklists/" + tasklistId + "/tasks/",
    data: "name=" + $("#newTask").val(),
    success: function(data) {
    },
    error: function(data) {

    }
  });
}

function updateTask() {
  const tasklistId = $(this).data("tasklistid");
  const taskId = $(this).data("taskid");
  Rails.ajax({
    type: "put",
    url: "tasklists/" + tasklistId + "/tasks/" + taskId,
    data: "name=" + $("#inputTask" + taskId).val(),
    success: function(data) {
    },
    error: function(data) {
    }
  });
}

function deleteTask() {
  const tasklistId = $(this).data("tasklistid");
  const taskId = $(this).data("taskid");
  Rails.ajax({
    type: "delete",
    url: "tasklists/" + tasklistId + "/tasks/" + taskId,
    success: function(data) {
      $("#tasklist" + tasklistId).click();
    }
  });
}

function setSelectedTasklist(selectedTasklist) {
  var currentTasklist = localStorage.getItem("selectedTasklistCount");
  $("#tasklist_list" + currentTasklist)
    .parent()
    .removeClass("active");
  localStorage.setItem("selectedTasklistCount", selectedTasklist);
  currentTasklist = localStorage.getItem("selectedTasklistCount");
  $("#tasklist_list" + currentTasklist)
    .parent()
    .addClass("active");
}

function inputForUpdateTasklist() {
  return (
    "<div class='row'>" +
    "<div class='col-sm-12'>" +
    "<input type='textfield' class='form-control' id='updateTasklistInput{{tasklistId}}' value='" +
     "{{title}}'><br></div></div><div class='row align-middle'>" +
    "<div class='col-sm-4'>" +
    "<span class ='btn btn-danger saveUpdateTasklistButton' data-tasklistid = {{tasklistId}}> Save" +
    "</span></div>" +
    "<div class='col-sm-3 align-self-end'>" +
    "<span class = 'col-sm-6 cancelUpdateTasklistButton' data-tasklistid = " +
    "{{tasklistId}} data-index = {{index}} >Cancel</span>" +
    "</div></div>"
  );
}

function renderTasklistEditView() {
  return (
    "<div class = 'col-sm-6'>" +
    "<div class = 'tasklist_list' id='tasklist{{tasklistId}}' data-tasklistid = " +
    "{{tasklistId}}  data-index = {{index}}>{{title}}"+
    "</div>" +
    "</div>" +
    "<div class = 'col-sm-1'>" +
    "<div class= 'fa fa-edit pull-right tasklistUpdateButton' id ='update' data-tasklistid = " +
    "{{tasklistId}} data-index = {{index}})'></div> " +
    "</div>" +
    "<div class = 'col-sm-1'>" +
    "<div class= 'fa fa-trash-alt pull-right' id ='delete' data-method = 'delete' href='/tasklists/'{{tasklistId}}" +
    ")></div> " +
    "</div>"
  );
}

function restoreUpdateTasklist() {
  const tasklistId = $(this).data("tasklistid");
  const index = $(this).data("index");
  const title = $("#tasklist_list" + tasklistId).data("name");
  $("#tasklist_list" + tasklistId).html(
    Mustache.render(renderTasklistEditView(tasklistId, index),
    {tasklistId: tasklistId, index: index, title:title}));
  $("#tasklist_list" + tasklistId).removeAttr("data-index");
  $("#tasklist_list" + tasklistId).removeAttr("data-name");
}

function renderUpdateTasklist() {
  const tasklistId = $(this).data("tasklistid");
  const index = $(this).data("index");
  const title = $("#tasklist" + tasklistId).text();
  tasklistIndex = index;
  $("#tasklist_list" + tasklistId).attr("data-name",$("#tasklist" + tasklistId).text());
  $("#tasklist_list" + tasklistId).attr("data-index", index);
  $("#tasklist_list" + tasklistId).html(
    Mustache.render(inputForUpdateTasklist(),
    {tasklistId: tasklistId, index: index, title: title}));
}

function updateTaskStatus() {
  const tasklistId = $(this).data("tasklistid");
  const taskId = $(this).data("taskid");
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
}
