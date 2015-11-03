applicatie.controller('PurchaseListController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    $scope.alerthide = true;
    $scope.alertmessage = "";
    $scope.purchaselist = angular.copy($rootScope.purchaselist);
    $scope.group = angular.copy($rootScope.group);
    if ($scope.group != null) {
        $scope.groupmembers = angular.copy($rootScope.group.group_members);
    } else {
        $scope.group = {};
        $scope.groupmembers = [];
    }
    $scope.participants = [];
    $scope.membersNotInParticipants = getMembersNotInParticipants($scope);

    if ($scope.purchaselist) {
        $scope.purchaselist.status = "aanpassen";
        $scope.participants = angular.copy($rootScope.purchaselist.participants);
        $scope.membersNotInParticipants = getMembersNotInParticipants($scope);
    } else {
        $scope.purchaselist = {};
        $scope.purchaselist.description = "";
        $scope.purchaselist.status = "invoeren";
    }

    $scope.insertPurchase = function () {
        if (!checkDescription($scope)) {
            return;
        }
        if (!checkParticipants($scope)) {
            return;
        }
        if ($scope.purchaselist.status == "aanpassen") {
            updatePurchaselist($scope, $http);
        } else if ($scope.purchaselist.status == "invoeren") {
            addPurchaselist($scope, $http);
        }
    };

    $scope.removeParticipant = function (participant) {
        var index = arrayObjectIndexOf($scope.participants, participant.username, "username");
        $scope.participants.splice(index, 1);
        $scope.membersNotInParticipants.push(participant);
        checkParticipants($scope);
    };

    $scope.addParticipant = function (member) {
        var index = arrayObjectIndexOf($scope.membersNotInParticipants, member.username, "username");
        $scope.membersNotInParticipants.splice(index, 1);
        $scope.participants.push(member);
        checkParticipants($scope)
    };

    $scope.checkDescription = function () {
        checkDescription($scope);
    }
}]);

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function getMembersNotInParticipants($scope) {
    var membersNotInParticipants = [];
    $scope.groupmembers.forEach(function (member) {
        var memberIsParticipant = false;
        $scope.participants.forEach(function (participant) {
            if (member.username === participant.username) {
                memberIsParticipant = true;
            }
        });
        if (memberIsParticipant == false) {
            membersNotInParticipants.push(member);
        }
    });
    return membersNotInParticipants;
}

function updatePurchaselist($scope, $http) {
    $http.put('api/purchase/' + $scope.purchaselist.id, $scope.purchaselist).success(function (data) {
        assignParticipants($scope, $http);
        if ($scope.closeThisDialog) {
            $scope.closeThisDialog('close');
        }
        $scope.create_return_message = "Purchase Successfully updated!";
    });
}

function addPurchaselist($scope, $http) {
    $http.post('api/purchase/', $scope.purchaselist).success(function (data) {
        $scope.purchaselist.id = data.id;
        assignParticipants($scope, $http)
        if ($scope.closeThisDialog) {
            $scope.closeThisDialog('close');
        }
        $scope.create_return_message = "Purchase Successfully created!";
    });
}

function assignParticipants($scope, $http) {
    //add participant to purchase
    $scope.participants.forEach(function (participant) {
        participant.purchase_id = $scope.purchaselist.id;
        $http.post('api/participant', participant).success(function (data) {
        }).error(function (data) {
        });
    });
    //remove participant from purchase
    $scope.membersNotInParticipants.forEach(function (member) {
        $http.delete('api/participant/' + member.username + '/' + $scope.group.id + '/' + $scope.purchaselist.id).success(function (data) {
        }).error(function (data) {
        });
    });
}

function checkParticipants($scope) {
    if ($scope.participants.length == 0) {
        $scope.alertmessage = "Please assign participants.";
        $scope.alerthide = false;
        return false;
    } else {
        $scope.alertmessage = "";
        $scope.alerthide = true;
        return true;
    }
}

function checkDescription($scope) {
    if ($scope.purchaselist.description == "") {
        $scope.alertmessage = "Please fill in a description.";
        $scope.alerthide = false;
        return false;
    } else {
        $scope.alertmessage = "";
        $scope.alerthide = true;
        return true;
    }
}