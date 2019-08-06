$(document).ready(function() {
  const storage = localStorage.getItem("selectedTasklistCount");
  $("#newTasklistButton").on("click", addTasklist);
  $(".tasklist_list").on("click", renderTask);
  $(".tasklistname").on("click",".tasklistUpdateButton", renderUpdateTasklist);
  $("#tasks").on("click", ".taskname" , renderUpdate);
  $("#tasks").on("click", ".taskUpdate" , renderUpdate);
  $(":checkbox").on("click", updateTaskStatus);
  $("#newtasklist").on("click","#createTasklistButton", createTasklist);
  $("#newtasklist").on("click","#cancelCreateTasklist", restoreCreateTasklist);
  $("#tasks").on("click", ".createNewTaskButton" ,createTask);
  $("#tasks").on("click", ".cancelNewTaskButton" ,restoreCreateTask);
  $("#tasks").on("click","#addTaskButton", addTask);
  $("#tasks").on("click", ".taskDelete" ,deleteTask);
  $("#tasks").on("click", ".updateTaskSaveButton" ,updateTask);
  $("#tasks").on("click", ".updateTaskCancelButton" ,restoreTask);
  if (storage === null) {
  } else {
    $(document)
      .find("#tasklist"+storage).click();
      setSelectedTasklist(storage);
  }
});

function inputForTask(tasklistId) {
  return (
    "<li class = 'list-group-item'>"+
    "<div class = 'row'>" +
    "<div class = 'col-sm-12'>" +
    "<input type= 'textfield' class='form-control' id=newTask><br></div>" +
    "<div class = 'col-sm-2 pull-right'><button class='createNewTaskButton btn btn-danger' data-tasklistid = " +
    tasklistId +
    ">Save</button></div>" +
    "<div class = 'col-sm-3 align-self-end'><div class = 'cancelNewTaskButton'>Cancel</div></div></div></li>"
  );
}

function restoreTask() {
  const tasklistId = $(this).data("tasklistid");
  const taskId = $(this).data("taskid");
  $("#card" + taskId).empty();
  $("#card" + taskId).append(restoreTaskView(tasklistId, taskId));
  if ($('#card'+taskId).data("status") == true) {
    $("#checkbox" + taskId).attr("checked", "checked");
  }
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
    $('#card'+taskId).data("title") +
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
  $("#newtasklist")
    .html(inputForTasklist())
    .append("<br>");
}

function addTask() {
  if ($("#newTask").length == 0) {
    const input = inputForTask($(this).data("tasklistid"));
    $("#newtasks").show();
    $("#newtasks").append(input);
  }
}

function renderTask() {
  const tasklistId = $(this).data("tasklistid");
  const index = $(this).data("index");
  $.ajax({
    url: "/tasklists/" + tasklistId + "/render_tasks",
    success: function(result) {
      $("#tasks").html(result);
    }
  });
  setSelectedTasklist(tasklistId);
}

function updateTaskView(tasklistId, taskId) {
  const text = $("#task" + taskId).text();
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
  const tasklistId = $(this).data("tasklistid");
  const taskId = $(this).data("taskid");
  if (
    $("#task" + taskId).prop("tagName") == "DIV" &&
    $("#task" + taskId).find($("#inputTask" + taskId)).length == 0
  ) {
    const text = $("#task" + taskId).text();
    $('#card'+taskId).attr("data-title",text);
    $('#card'+taskId).attr("data-status", $("#checkbox" + taskId).prop("checked"));
    $("#card" + taskId).html(updateTaskView(tasklistId, taskId));
  }
}

function createTasklist() {
  Rails.ajax({
    type: "post",
    url: "/tasklists",
    data: "name=" + $("#tasklistnew").val(),
    success: function(data) {
      $("#tasklists")
        .append($(data).find("li")[0]);
      $("#newtasklist").empty();
      $("#tasklistnew").val("");
      $("#tasklists")
        .find(".tasklist_list")
        .click();
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
      $("#tasklist_list" + tasklistId).empty();
      $("#tasklist_list" + tasklistId)
        .append($(data).find("DIV")[1])
        .append($(data).find("DIV")[1])
        .append($(data).find("DIV")[1]);
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
      $(".tab-content .list-group")
        .append($(data).find("li")[0]);
      restoreCreateTask();
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
      $("#card" + taskId).empty();
      $("#card" + taskId)
        .append($(data).find("DIV")[3])
        .append($(data).find("DIV")[3])
        .append($(data).find("DIV")[3])
        .append($(data).find("DIV")[3]);
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
  $('#tasklist_list'+currentTasklist).parent().removeClass('active');
  localStorage.setItem("selectedTasklistCount", selectedTasklist);
  currentTasklist = localStorage.getItem("selectedTasklistCount");
  $('#tasklist_list'+currentTasklist).parent().addClass('active');
}


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
    "<div class = 'col-sm-6'>" +
    "<div class = 'tasklist_list' id='tasklist" +
    tasklistId +
    "' data-tasklistid = " +
    tasklistId +
    " data-index = " +
    index +
    ">" +
    $('#tasklist_list'+tasklistId).data("name") +
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
  const tasklistId = $(this).data("tasklistid");
  const index = $(this).data("index");
  $("#tasklist_list" + tasklistId).html(
    restoreUpdateTasklistView(tasklistId, index)
  );
  $('#tasklist_list'+tasklistId).removeAttr("data-index");
  $('#tasklist_list'+tasklistId).removeAttr("data-name");
}


function renderUpdateTasklist() {
  const tasklistId = $(this).data("tasklistid");
  const index = $(this).data("index");
  $("#tasklist_list"+tasklistId).attr("data-name",$("#tasklist" + tasklistId).text());
  $("#tasklist_list"+tasklistId).attr("data-index",index);
  tasklistIndex = index;
  $("#tasklist_list" + tasklistId).html(
    inputForUpdateTasklist(tasklistId, index)
  );
  $(".saveUpdateTasklistButton").bind("click", updateTasklist);
  $(".cancelUpdateTasklistButton").bind("click", restoreUpdateTasklist);
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
