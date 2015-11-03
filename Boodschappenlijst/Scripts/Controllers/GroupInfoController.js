applicatie.controller('GroupInfoController', ['$scope', '$rootScope', '$routeParams', '$http', '$window', 'ngDialog','$timeout', function ($scope, $rootScope, $routeParams, $http, $window,ngDialog,$timeout) {
    $scope.newItem = {};
    $scope.userPanel = { active: false, extraClass: "" };
    $scope.listPanel = { active: true, extraClass: "active" };
    $scope.selectList = [];
    $rootScope.purchaseLists = [];
    $scope.return_message = "";
    $scope.message_type = "success";
    $scope.currentPurchase = {};
    // init logged in user
    
    $scope.username = $window.sessionStorage.getItem('username');
    var groupId = $routeParams.groupId;    
    getGroup($scope, $rootScope, $http, groupId);
    
    $scope.addItem = function () {
        $rootScope.purchaselist = null;
        $rootScope.group = $rootScope.group;
        // init purchaselist dialog
        var dialog = ngDialog.open({
            template:
                'Views/purchaselist.html',
            controller:
                'PurchaseListController'
        });
        // refresh list on dialog close
        dialog.closePromise.then(function (data) {
            $timeout(function () {
                getGroup($scope,$rootScope, $http, groupId);
            }, 500);
        });
    };
    
    // delete a purchase from the db and list
    $scope.delete = function (purchaseList) {
        purchaseList.participants.forEach(function (participant) {
            $http.delete('api/participant/' + participant.username + '/' + $rootScope.group.id + '/' + purchaseList.id).success(function (data) {
            });       
        })
        $http.delete("api/purchase/" + purchaseList.id).success(function () {
            $scope.return_message = "met succes boodschap verwijdert!";
            $scope.message_type = "success";
            var index = arrayObjectIndexOf($rootScope.purchaseLists, purchaseList.id, "id");
            $rootScope.purchaseLists.splice(index, 1);
        }).error(function () {
            $scope.return_message = "error";
        });
        var index = arrayObjectIndexOf($scope.purchaseList, purchase.id, 'id');
        $scope.purchaseList.splice(index, 1); 

    };
    $scope.bevestig = function () {
        //update price and purchaser in purchase
        $http.put("api/Purchase/" + $scope.currentPurchase.id, $scope.currentPurchase).success(function (data) {
        });
        // save current group member
        $scope.currentPurchase.currentGroupMember.balance = $scope.currentPurchase.currentGroupMember.futureBalance;
        $http.put("api/Member/" + $scope.currentPurchase.currentGroupMember.username + "/" + $rootScope.group.id, $scope.currentPurchase.currentGroupMember).success(function (data) {
        }).error(function (data) {
        });
        // save all balances from the participants of the purchase
        $scope.currentPurchase.participants.forEach(function (participant) {
            if (!participant.ignore) {
                participant.group_members.balance = participant.balance;
                $http.put("api/Member/" + participant.username + "/" + $rootScope.group.id, participant.group_members).success(function (data) {
                }).error(function (data) {
                })
            }
        });
        // $scope.closeThisDialog();
        ngDialog.close();
        $scope.currentPurchase = {};
    }
    // open the billing info dialog
    $scope.bill = function (purchaseList) {

        $scope.currentPurchase = angular.copy(purchaseList);
        $scope.currentPurchase.purchaser = $scope.username;
        $scope.currentPurchase.price = 0;
        $http.get("api/Member/" + $scope.username + "/" + $rootScope.group.id).success(function (groupMember) {
            $scope.currentPurchase.currentGroupMember = groupMember;
            $scope.currentPurchase.currentGroupMember.isParticipant = false;
            calculateBalance($scope);
        });
       var dialog = ngDialog.open({
            template: 'Views/billing.html',
            scope: $scope
        });
       dialog.closePromise.then(function (data) {
           $timeout(function () {
               getGroup($scope,$rootScope, $http, groupId);
           }, 500);
       })
        

    };
    // calculate balances (function below controller)
    $scope.calculateBalances = function () {
        calculateBalance($scope);
    };


    $scope.edit = function(purchaseList) {
        $rootScope.purchaselist = purchaseList;
        $rootScope.group = $rootScope.group;
        // init purchaselist dialog
        var dialog = ngDialog.open({
            template:
                'Views/purchaselist.html',
            controller:
                'PurchaseListController'
        });
        // refresh list on dialog close
        dialog.closePromise.then(function (data) {
            $timeout(function () {
                getGroup($scope,$rootScope, $http, groupId);
            }, 500);
        });
    }
    // swap between user and purchaselist panel
    $scope.showList = function () {
        $scope.userPanel.active = false;
        $scope.userPanel.extraClass = "";
        $scope.listPanel.active = true;
        $scope.listPanel.extraClass = "active";
    }
    $scope.showUsers = function () {
        $scope.userPanel.active = true;
        $scope.userPanel.extraClass = "active";
        $scope.listPanel.active = false;
        $scope.listPanel.extraClass = "";
    }
}]);

applicatie.controller('UserController', ['$scope','$rootScope' ,'$http','$resource','$timeout', function ($scope, $rootScope,$http,$resource,$timeout) {
   // delete user from group 
    $scope.delete = function (user) {
        var index = arrayObjectIndexOf($rootScope.group.group_members, user.username, "username");
        $http.delete("api/Member/" + user.username + "/" + $rootScope.group.id).success(function (data) {
            
            var spliced = $rootScope.group.group_members.splice(index,1);
            $scope.selectList.push(user);
            $scope.message_type = "success";
            $scope.return_message = "succesfully deleted " + user.username + "!";
            getGroup($scope, $rootScope, $http, $scope.group.id);
        }).error(function (data) {
        });      
    };
    // mark a user as selected
    $scope.select = function (user) {
        user.selected = true;       
    };
    // add a user as a group member
    $scope.addUsers = function () {
        $scope.selectList.forEach(function (entry) {
            if (entry.selected == true) {
                entry.group_id = $rootScope.group.id;
                entry.selected = false;
                entry.participants = null;
                entry.users = null;
                $http.post("api/Member", entry).success(function (data) {
                    $scope.message_type = "success";
                    $scope.return_message = "succesfully added " + entry.username + "!";
                    getGroup($scope,$rootScope, $http,$rootScope.group.id);
                    var index = arrayObjectIndexOf($scope.selectList, entry.username, "username");
                    $scope.selectList.splice(index, 1);          
                }).error(function (data,iets,iets1,error) {
                    
                });               
            }
            else {
                entry.selected = false;
            }
        }); 

    };
}]);
// get index of array by specified attribute
function arrayObjectIndexOf(myArray, searchTerm, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }

    return -1;
}
// get all users and filter them in the selectlist
function getUsers($scope,$rootScope,$http) {
    $http.get("api/User").success(function (users) {
        var allUsers = users;
        $scope.selectList = allUsers;
        if (users != "test") {
            $rootScope.group.group_members.forEach(function (entry) {
                allUsers.forEach(function (user) {
                    if (user.username == entry.username) {
                        var index = arrayObjectIndexOf(allUsers, entry.username, "username");
                        $scope.selectList.splice(index, 1);
                    }

                });
            });
        }
    });
};
// refresh the purchaseList 
function refreshPurchaseLists($scope,$rootScope,$http) {
    $rootScope.purchaseLists = [];
    var allPurchaseLists = [];
    $http.get("api/purchase").success(function (purchaseLists) {
        allPurchaseLists = purchaseLists;
        allPurchaseLists.forEach(function (purchaseList) {
            purchaseList.participants.forEach(function (participant) {
                if (arrayObjectIndexOf($rootScope.purchaseLists, participant.purchase_id, "id") != -1) {
                } else if(participant.group_id == $rootScope.group.id){
                        $rootScope.purchaseLists.push(purchaseList);
                        purchaseList.extraClass = purchaseList.purchaser != null ? "success" : "";
                        purchaseList.hideButtons = purchaseList.purchaser != null ? true : false;
                }
            });
        });
    });
    
    
}
// get the current group and group members within and call refreshPurchaseLists and GetUsers
function getGroup($scope,$rootScope, $http,groupId) {
    
    var url = "/api/Group/" + groupId;
    $http.get(url).success(function (group, status, headers, config) {
        $rootScope.group = group;
        refreshPurchaseLists($scope,$rootScope,$http);
        getUsers($scope,$rootScope, $http);
    }).error(function (error) {
    });
}
// calculate the balance for all participants in a purchase
function calculateBalance($scope) {

    var priceDivider = $scope.currentPurchase.participants.length;
    $scope.currentPurchase.priceUp = $scope.currentPurchase.price / priceDivider;
    $scope.currentPurchase.currentGroupMember.priceUp = $scope.currentPurchase.price;
    
    $scope.currentPurchase.participants.forEach(function (participant) {
        participant.balance = participant.group_members.balance - $scope.currentPurchase.priceUp  ;
        if (participant.username == $scope.currentPurchase.currentGroupMember.username) {
            participant.ignore = true;
            $scope.currentPurchase.currentGroupMember.isParticipant = true;
        }
    });
    $scope.currentPurchase.currentGroupMember.futureBalance = $scope.currentPurchase.currentGroupMember.balance + $scope.currentPurchase.price;
    if ($scope.currentPurchase.currentGroupMember.isParticipant) {
        $scope.currentPurchase.currentGroupMember.priceUp = $scope.currentPurchase.price / priceDivider;
        $scope.currentPurchase.currentGroupMember.futureBalance -= $scope.currentPurchase.currentGroupMember.priceUp;       
    }

}