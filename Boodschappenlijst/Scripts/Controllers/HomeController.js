applicatie.controller('HomeController', [
    '$scope',
    '$window',
    '$routeParams',
    '$http',
    'access',
    function ($scope, $window, $routeParams, $http, access) {
    // init uri
    var groupUri = "/api/group";
    var memberUri = "/api/member";

    // init class
    $scope.message_show = 'hidden';
    $scope.create_message_show = 'hidden';

    // init logged in user
    $scope.username = access.GetUser();

    /*
     * define table headers
     */
    $scope.tableheaders = [
        { title: "Groep", icon: "glyphicon glyphicon-link" },
        { title: "Eigen Balans", icon: "glyphicon glyphicon-piggy-bank" },
        { title: "Hoogste Balans", icon: "glyphicon glyphicon-hand-up" },
        { title: "Laagste Balans", icon: "glyphicon glyphicon-hand-down" },
        { title: "Action", icon: "glyphicon glyphicon-pencil" }
    ];

    /*
     * get groups
     * @param array groupss
     */
    $http.get(groupUri + '/ByMember/' + $scope.username).success(function (groups) {
        $scope.groups = groups;
        console.log(groups);
    }).error(function () { console.log("Error loading groups"); });

    /*
     * create group
     * @param string name
     * @param string description
     */
    $scope.createGroup = function (name, description, username) {
        var group = { name: name, description: description, group_members : [] };

        var onSuccess = function (data) {
            var group = { id: data.id, name: name, description: description, group_members: [] };

            $scope.create_message_type = 'success';
            $scope.create_return_message = 'Group Successfully created!';
            $scope.create_message_show = 'show';
            $scope.message_show = 'hidden';
            
            // add logged in user as member
            member = $scope.addMember(username, data);
            group.group_members.push(member);
            
            // push group to list
            $scope.groups.push(group);
        }

        var onError = function () {
            $scope.create_message_type = 'danger';
            $scope.create_return_message = 'Failed to create group!';
            $scope.create_message_show = 'show';
            $scope.message_show = 'hidden';
        }

        // post data to database
        $http.post(groupUri, group).success(onSuccess).error(onError);
    };

    /*
     * add logged in user as groupmember
     * @param string username
     * @param obj data
     */
    $scope.addMember = function (username, data) {
        var groupid = data.id;
        var member = { username: username, group_id: groupid, balance: 0 };
        $http.post(memberUri, member);

        return member;
    }

    /*
     * delete group
     * @param obj group
     */
    $scope.deleteGroup = function (group) {
        var onSuccess = function () {
            $scope.message_type = 'success';
            $scope.return_message = 'Group Successfully deleted';
            $scope.message_show = 'show';
            $scope.create_message_show = 'hidden';

            var index = arrayObjectIndexOf($scope.groups, group.id, "id");
            $scope.groups.splice(index, 1);
        }

        var onError = function () {
            $scope.message_type = 'danger';
            $scope.return_message = 'Failed to delete group';
            $scope.message_show = 'show';
            $scope.create_message_show = 'hidden';
        }

        // delete data from database
        $http.delete(groupUri + "/" + group.id, { id: group.id }).success(onSuccess).error(onError);
    };

    function arrayObjectIndexOf(myArray, searchTerm, property) {
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchTerm) return i;
        }

        return -1;
    }
}]);