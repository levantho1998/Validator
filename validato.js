function Validator(options) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }
  var selectorRules = {};
  // hàm thực hiện validate
  function validate(inputElement, rule) {
    var errorElement = getParent(inputElement, options.formGroup).querySelector(
      options.errorSelector
    );
    var errorMessage;
    // var errorMessage = rule.test(inputElement.value);

    // lấy ra các rule của selector
    var rules = selectorRules[rule.selector];
    // lặp qua từng rule và kiểm tra
    for (var i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break;
    }
    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }

    return !errorMessage;
  }

  // lấy element của form cần validate
  var formElement = document.querySelector(options.form);

  if (formElement) {
    formElement.onsubmit = function (e) {
      e.preventDefault();

      var isFormValid = true;

      // laặp qua từng rule và validat
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);

        if (!isValid) {
          isFormValid = false;
        }
        if (isFormValid) {
          // if (typeof options.onSubmit === "function") {
          //   var enableInputs = formElement.querySelectorAll("[name]");
          //   var formValues = Array.from(enableInputs).reduce((values, input) => {
          //     return (values[input.name] = input) && values;
          //   }, {});
          //   options.onSubmit();
          // }
          return options.onSubmit();
        }
      });
    };

    // lặp qua mỗi rule  và láng nghe sự kiện
    options.rules.forEach(function (rule) {
      // Lưu lại các rules cho mỗi input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
      var inputElement = formElement.querySelector(rule.selector);
      // console.log(rule.selector);
      if (inputElement) {
        // xử lý blur ra ngoài
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };
        // xư lý người dùng nhập vào
        inputElement.oninput = function () {
          var errorElement = inputElement.parentElement.querySelector(
            options.errorSelector
          );
          errorElement.innerText = "";
          inputElement.parentElement.classList.remove("invalid");
        };
      }
    });
  }
}

Validator.isRequired = function (selector, message) {
  return {
    selector,

    test: function (value) {
      return value.trim() ? undefined : message || "vui lòng nhập trường này";
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector,
    test: function (value) {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : message || " Vui lòng nhập email";
    },
  };
};

Validator.minLength = function (selector, min, message) {
  return {
    selector,
    test: function (value) {
      return value.length >= 6
        ? undefined
        : `vui lòng nhập tối thiểu ${min} ký tự`;
    },
  };
};

Validator.isConfirm = function (selector, getConfirmValue, message) {
  return {
    selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || "giá trị nhập vào không chính xác";
    },
  };
};