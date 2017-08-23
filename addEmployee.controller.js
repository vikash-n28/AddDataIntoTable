angular.module('myApp').controller('addEmployeeController', function (addEmployeeService,$scope, $mdDialog, $timeout, $http) {
  $scope.employeeDetailsArray = [{}];
  $scope.colorObject = addEmployeeService.colorObject;
  $scope.status = {};
  $scope.block = addEmployeeService.block;
  $scope.addEmpoyeeDisable = true;
  $scope.saveEmployeeDisable = true;
  $scope.referDisabled = false;
  $scope.simulateQuery = addEmployeeService.simulateQuery;

    //  console.log($scope.employeeObject)
  /**check for field formate validation*/
  $scope.validation = function (event, type) {
    console.log("calling...",event);
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

  $scope.referredObj = addEmployeeService.referredObject($scope.referredObject);
  $scope.querySearch = searchEmployee;
  $scope.selectedItemChange = selectedItemChange;
  $scope.searchTextChange = searchTextChange;


  function searchEmployee(query){
    return addEmployeeService.searchEmployee(query, $scope.referredObj);
  }

  function selectedItemChange(item){
    // var object = new Object();
    // var employee = new Object();
    // var display = "";
    // console.log('item',item);
    // object.employee.display = item.display;
    //  $scope.validation(object,'referredBy');
  }

  function searchTextChange(text){
    // var object = new Object();
    // var employee = new Object();
    // var display = "";
    // object.employee.display = text;
    // $scope.validation(object,'referredBy');
  }


});
