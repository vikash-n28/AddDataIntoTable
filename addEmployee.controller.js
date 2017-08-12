angular.module('myApp').controller('addEmployeeController', function (addEmployeeService,$scope, $mdDialog, $timeout, $http) {
  $scope.employeeDetailsArray = [{}];
  $scope.colorObject = addEmployeeService.colorObject;
  $scope.status = {};
  $scope.block = addEmployeeService.block;
  $scope.addEmpoyeeDisable = true;
  $scope.saveEmployeeDisable = true;
  $scope.employeeObject = {
    "status": true,
    "message": "Sccessfully retrived the config data",
    "data": {
      "employeeTypeData": [
        "FELLOWSHIP",
        "CONTRACT",
        "TERMINATED",
        "EX_EMPLOYEE"
      ],
      "cityData": [
        {
          "_id": "5912c887396758fb50175394",
          "city": "Mumbai"
        },
        {
          "_id": "5912c887396758fb50175394",
          "city": "Pune"
        },
        {
          "_id": "5912c887396758fb50175394",
          "city": "Delhi"
        }
      ],
      "attendanceOptionData": [
        "Company Holiday",
        "Leave",
        "Working",
        "Over Time"
      ],
      "companyData": [
        {
          "_id": "592d230d7fcf3c7427d4daaf",
          "name": "Bridgelabz solutions LLP"
        }
      ],
      "programData": [
        {
          "_id": "5912c887396758fb50175394",
          "title": "BRIDGELABZ"
        },
        {
          "_id": "5912c887396758fb50175394",
          "title": "BRIDGEIT"
        },
        {
          "_id": "5912c887396758fb50175394",
          "title": "BRIDGE_CORE"
        }
      ],
      "techStackData": [
        "Android",
        "iOS",
        "Angular",
        "Java",
        "MEAN"
      ],
      "disciplineData": [
        "Computer",
        "Electronics",
        "IT",
        "Other"
      ],
      "universityData": [
        "Mumbai University"
      ],
      "collegeData": [
        "AC patil college of engineering"
      ],
      "qualificationData": [
        "BE",
        "ME"
      ]
    }
  };
  $scope.referredObject = {
    "status": true,
    "message": "Sccessfully retrived the employess",
    "data": {
      "employeeData": [
        {
          "_id": "591ed960f4f4f8e811651bd7",
          "employeeType": "EX-EMPLOYEE",
          "fullName": "Vikash Prasad"
        }
      ]
    }
  }
  //  console.log($scope.employeeObject)
  /**check for field formate validation*/
  $scope.validation = function (event, type) {
    $scope.saveEmployeeDisable = true;
    $scope.addEmpoyeeDisable = true;
    addEmployeeService.fieldValidation(event, type);
    if(!addEmployeeService.addDisabled && event.$index == addEmployeeService.addEmployeeArray.length-1)
      $scope.addEmpoyeeDisable = false
  };

  /**remove wrong class if already applied*/
  $scope.removeValidate = function (event, type) {
     addEmployeeService.removeValidate(event, type);
  }

  /**store of employee details in array & use to create new field*/
  $scope.addEmployeeData = function () {
    $scope.employeeDetailsArray.push({});
    $scope.addEmpoyeeDisable = true;
    if(addEmployeeService.addEmployeeArray.length)
      $scope.saveEmployeeDisable = false;
  };

  /**create fresh data,response data from server*/
  $scope.storeEmployee = function(){
    $scope.employeeDetailsArray = [];
    addEmployeeService.saveEmployee(function(error,employeeList){
      if(employeeList && employeeList.length)
      angular.forEach(employeeList,function(value){
         $scope.employeeDetailsArray.push(value)
      })
    });
  }


});
