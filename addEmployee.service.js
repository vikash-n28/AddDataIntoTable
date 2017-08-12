angular.module('myApp').service('addEmployeeService', function($timeout, $http, $q, $mdDialog) {

  var newEmpObject = new Object();
  var addEmployeeArray = []
  var employeeDetailsArray = [];
  var serverResponseData = [];
  var self = this;
  this.status = {};
  this.block = {};
  this.employeeDetailsArray = [{}];
  this.addEmployeeArray = [];
  this.colorObject = new Object();
  this.addDisabled = true;

  this.restService = function(paramObject, method) {
    return $q(function(resolve, reject) {
      if (method == 'GET') {
        $http({
          method: "GET",
          url: "http://192.168.0.2:1337/api/checkEmail?",
          params: paramObject,
          headers: {
            'x-access-token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5NzFhMDYwNzUwMTQwMzUxZGZlY2E5YyIsImVtcGxveWVlT2JqZWN0SWQiOm51bGwsImVtcGxveWVlSUQiOiIyMTA3MjAxNzAwMyIsInJvbGUiOiJBRE1JTklTVFJBVE9SIiwiaWF0IjoxNTAyMzQ0NDE3LCJleHAiOjE1MDI0MzA4MTd9.psFdNGAPSiwOm-lM6_K8cg3oVjPBoD2ygeBefIO-uRI"
          }
        }).then(function mySuccess(response) {
          if (response) {
            resolve(response.data);
          } else {
            reject('Response not Found!' + response.data);
          }
          return response.data;
        }, function myError(response) {

          console.log('errorMsg', response);
        });
      }
      if (method == 'POST') {
        $http({
          method: "POST",
          url: "http://192.168.0.2:1337/api/sendInviteLink/",
          // data: paramObject,
          data: JSON.stringify(paramObject),
          headers: {
            'x-access-token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5NzFhMDYwNzUwMTQwMzUxZGZlY2E5YyIsImVtcGxveWVlT2JqZWN0SWQiOm51bGwsImVtcGxveWVlSUQiOiIyMTA3MjAxNzAwMyIsInJvbGUiOiJBRE1JTklTVFJBVE9SIiwiaWF0IjoxNTAyMzQ0NDE3LCJleHAiOjE1MDI0MzA4MTd9.psFdNGAPSiwOm-lM6_K8cg3oVjPBoD2ygeBefIO-uRI"
          }
        }).then(function mySuccess(response) {
          if (response) {
            resolve(response.data);
          } else {
            reject('Response not Found!' + response.data);
          }
        }, function myError(response) {
          console.log('errorMsg', response);
        });
      }
    });
  };

  /**validate required field as per requirement*/
  this.fieldValidation = function(data, type) {
    var id = type + '' + data.$index;
    //email address validation
    if (data.employee && data.employee.emailAddress && type == 'emailAddress') {
      var mailformat = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      if (mailformat.test(data.employee.emailAddress)) {
        var paramObject = new Object();
        paramObject.emailAddress = data.employee.emailAddress;
        loadingDialogBox();
        var serviceResponse = this.restService(paramObject, 'GET');
        serviceResponse.then(function(objectResponse) {
          $mdDialog.cancel();
          if (!objectResponse.available) {
            self.colorObject[id] = 'wrong';
            alertDialogBox(objectResponse.message);
          }
        }, function(reason) {
          alert('Failed: ' + reason);
        });
      } else {
        this.colorObject[id] = 'wrong';
      }
    }

    //salary entered validation
    if (data.employee && data.employee.salary && type == 'salary') {
      // var number = /\d{1,3}(?:,?\d{3})?/;
      var number = /^\d+$/;
      if (!number.test(data.employee.salary)) {
        this.colorObject[id] = 'wrong';
      }
    }

    /**remove object if reattempt of row*/
    if (this.addEmployeeArray.length) {
      for (var i = 0; i < self.addEmployeeArray.length; i++) {
        if (self.addEmployeeArray[i].id == data.$index)
          self.addEmployeeArray.splice(i, 1);
      }
    }

    /**store of employee details in array*/
    if (data.employee) {
      if (data.employee.emailAddress && !this.colorObject[id])
        newEmpObject.emailAddress = data.employee.emailAddress
      if (data.employee.startDate) {
        var date = new Date(data.employee.startDate);
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        newEmpObject.startDate = year + '/' + (monthIndex + 1) + '/' + day;
      }
      if (data.employee.hiringCity)
        newEmpObject.hiringCity = data.employee.hiringCity
      if (data.employee.employeeType)
        newEmpObject.employeeType = data.employee.employeeType;
      if (data.employee.referredBy)
        newEmpObject.referredBy = data.employee.referredBy;
      if (data.employee.salary)
        newEmpObject.salary = data.employee.salary;
      if (newEmpObject.emailAddress && newEmpObject.startDate && newEmpObject.hiringCity && newEmpObject.employeeType &&
        newEmpObject.referredBy && newEmpObject.salary && angular.equals(this.colorObject, {})) {
        newEmpObject.id = data.$index;
        this.addEmployeeArray.push(newEmpObject);
        newEmpObject = new Object();
        this.addDisabled = false;
      } else {
        this.addDisabled = true;
      }
    }
  };

  /**remove wrong class after reattempt of same field*/
  this.removeValidate = function(event, type) {
    var id = type + '' + event.$index;
    if (this.colorObject[id])
      delete self.colorObject[id];
  }

  /**store empoyee data Object using post rest api call*/
  this.saveEmployee = function(callback) {
    if (this.addEmployeeArray.length) {
      employeeDetailsArray = []
      var empObject = new Object();
      empObject.employeeList = self.addEmployeeArray
      var serviceResponse = self.restService(empObject, 'POST');
      loadingDialogBox();
      serviceResponse.then(function(objectResponse) {
          //server response
          if (objectResponse.data) {
            $mdDialog.cancel();
            if (objectResponse.data.failureEmployeeRegister.length)
              alertDialogBox(objectResponse.data.failureEmployeeRegister[0].message);
             else
              alertDialogBox(objectResponse.data.successEmployeeRegister[0].message);
            this.addEmployeeArray = [];
            var responseData = addResponseEmployee(objectResponse.data);
            if (responseData.addEmployeeArray.length > 0)
              this.addEmployeeArray = responseData.addEmployeeArray;
            if (responseData.serverResponseData.length > 0) {
              angular.forEach(responseData.serverResponseData, function(value) {
                employeeDetailsArray.push(value);
              });
            }
          } else {
            $mdDialog.cancel();
            alertDialogBox(objectResponse.message);
          }
          if (employeeDetailsArray.length) {
            this.employeeDetailsArray = employeeDetailsArray
            return callback(null,employeeDetailsArray)
          }
        })
      }
    };

    /**create loading dialog box*/
    function loadingDialogBox() {
      $mdDialog.show({
        template: '<md-dialog id="plz_wait" style="box-shadow:none">' +
          '<md-dialog-content layout="row" layout-margin layout-padding layout-align="center center" aria-label="wait">' +
          '<md-progress-circular md-mode="indeterminate" md-diameter="50"></md-progress-circular>' +
          'Waiting for response...' +
          '</md-dialog-content>' +
          '</md-dialog>',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        fullscreen: false,
        escapeToClose: false
      });
    };

    /**create the alert dialog box*/
    function alertDialogBox(message) {
      $mdDialog.show(
        $mdDialog.alert()
        .clickOutsideToClose(false)
        .title('Message')
        .textContent(message)
        .ariaLabel('Alert Dialog Demo')
        .ok('OK')
      );
    }

    /**response data from server*/
    function addResponseEmployee(responseData) {
      addEmployeeArray = []
      serverResponseData = [];
      //failureEmployeeRegister
      if (responseData.failureEmployeeRegister.length > 0) {
        angular.forEach(responseData.failureEmployeeRegister, function(value) {
          addEmployeeArray.push(value.data);
          value.data.status = 'wrong'
          serverResponseData.push(value.data);
        });
      }

      //successEmployeeRegister
      if (responseData.successEmployeeRegister.length > 0) {
        angular.forEach(responseData.successEmployeeRegister, function(value) {
          value.data.block = 'disbale';
          value.data.status = 'correct'
          serverResponseData.push(value.data);
        });
      }
      return {
        addEmployeeArray: addEmployeeArray,
        serverResponseData: serverResponseData
      }
    }

});
