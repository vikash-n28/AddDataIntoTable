angular.module('myApp').controller('addEmployeeController', function (addEmployeeService,$scope, $mdDialog, $timeout, $http) {
  $scope.employeeDetailsArray = [{}];
  $scope.colorObject = addEmployeeService.colorObject;
  $scope.status = {};
  $scope.block = addEmployeeService.block;
  $scope.addEmpoyeeDisable = true;
  $scope.saveEmployeeDisable = true;

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
