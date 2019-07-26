function inputForTask(tasklistId) {
  return "<br><input type='textfield' id=task0>"
    + "<button class='btn btn-danger' onClick='createTask(" + tasklistId + ")' >"
    + "Add Task</button><br>";
}

function inputForTasklist(){
return "<input type='textfield' id='tasklistnew'> <br><br><button class = 'btn btn-primary' onClick=createTasklist()>Create Tasklist</button><br><br>"
}

function addTasklist(){
  $('#newtasklist').html(inputForTasklist());
}

function addTask(tasklistId) {
  if ($("#task0").length == 0) {
    var input = inputForTask(tasklistId)
    $("#tasks").html($("#tasks").html() + input);
  }
}

function renderTask(tasklistId) {
  $.ajax({
    url: "/tasklists/" + tasklistId + "/render_tasks",
    success: function(result) {
      $("#tasks").html(result);
    }
  });
}

function renderUpdate(tasklistId, taskId) {
  if (
    $("#task" + taskId).prop("tagName") == "SPAN" &&
    $("#task" + taskId).find($("#inputTask" + taskId)).length == 0
  ) {
    var text = $("#task" + taskId).text();
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
        ")>Update</button"
    );
  }
}
function createTasklist(){
  Rails.ajax({
    type: "post",
    url: "/tasklists",
    data: "name=" + $("#tasklistnew").val(),
    success: function(data) {
      console.log(data);
      console.log($("#task" + inputCounter).val());
    }
  });
}
function createTask(tasklistId) {
  Rails.ajax({
    type: "post",
    url: "tasklists/" + tasklistId + "/tasks/",
    data: "name=" + $("#task" + inputCounter).val(),
    success: function(data) {
      console.log(data);
      console.log($("#task" + inputCounter).val());
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
      console.log($("#task" + inputCounter).val());
    }
  });
}

function deleteTask(tasklistId,taskId){
  Rails.ajax({
    type: "delete",
    url: "tasklists/" + tasklistId + "/tasks/" + taskId,
    success: function(data) {
      console.log(data);
    }
  });
}
