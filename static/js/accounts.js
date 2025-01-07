// 原有的函數保持不變
function get_group(email) {
  var dataJSON = {};
  dataJSON.email = email;
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/accounts/get_group",
    type: "POST",
    async: false,
    crossDomain: true,
    data: dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       // Set LocalStorage
       setLocalStorage("group", obj.group);
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });

  return getLocalStorage("group");
}

function logout() {
  var dataJSON = {};
  dataJSON.token = getLocalStorage("jwt");
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/accounts/verify_jwt",
    type: "POST",
    async: false,
    crossDomain: true,
    data: dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       // Clear local storage
       localStorage.clear();
       window.location.replace("/index.html");
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
}

// 新增密碼重設相關函數
function validatePassword(password, confirmPassword) {
    const errors = {
        password: '',
        confirmPassword: ''
    };

    if (password.length < 8) {
        errors.password = '密碼長度至少需要8個字元';
    }

    if (password !== confirmPassword) {
        errors.confirmPassword = '密碼不相符';
    }

    return errors;
}

function resetPassword(email, password) {
    var form = new FormData();
    form.append("email", email);
    form.append("password", password);

    $.ajax({
        url: "https://beta-tplanet-backend.4impact.cc/accounts/reset_password",
        method: "POST",
        timeout: 0,
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: form,
        success: function(response) {
            alert('密碼更新成功！');
            // 可以選擇重新導向或重新載入頁面
            window.location.reload();
        },
        error: function(xhr, status, error) {
            alert('密碼更新失敗，請稍後再試。');
            console.error(error);
        }
    });
}

// 當 DOM 載入完成後初始化密碼重設功能
document.addEventListener('DOMContentLoaded', function() {
    const newPasswordInput = document.getElementById('new_password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const submitButton = document.getElementById('submit-password');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');

    // 密碼輸入檢查
    function checkPasswords() {
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        const errors = validatePassword(password, confirmPassword);

        passwordError.textContent = errors.password;
        confirmPasswordError.textContent = errors.confirmPassword;

        return !errors.password && !errors.confirmPassword;
    }

    // 添加輸入事件監聽
    newPasswordInput.addEventListener('input', checkPasswords);
    confirmPasswordInput.addEventListener('input', checkPasswords);

    // 提交按鈕點擊事件
    submitButton.addEventListener('click', function() {
        if (checkPasswords()) {
            const email = document.getElementById('account_email').value;
            resetPassword(email, newPasswordInput.value);
        }
    });
});