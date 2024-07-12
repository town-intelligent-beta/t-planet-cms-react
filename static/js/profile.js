import { accountDelete } from './account_manager.js'

$(function () {
  $("#account-Delete-prepare").on("click", function(e) {
    if (document.getElementById("chkboxForAccDel").checked == false) {
      document.getElementById("delAccountModal").innerHTML = "請確實閱讀並勾選帳號刪除聲明。謝謝！";
      $("#account-Delete-success").hide();
      $("#account-Delete-failed").show();
      $("#exampleModal").modal("show");
      return;
    }

    document.getElementById("delAccountModal").innerHTML = "您的帳號已刪除";
    $("#exampleModal").modal("show");
    $("#account-Delete-success").show();
    $("#account-Delete-failed").hide();
  })
})

$(function () {
  $("#account-Delete-failed").on("click", function(e) {
    $("#exampleModal").modal("hide");
    return;
  })
})

$(function () {
    $("#account-Delete-success").on("click", function(e) {
      var result = accountDelete();
      localStorage.clear();
      window.location.replace("/index.html");
    })
  })
