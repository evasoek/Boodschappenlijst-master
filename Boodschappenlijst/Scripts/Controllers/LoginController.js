applicatie.controller("LoginController", [
    "$scope",
    "$http",
    "access",
    function ($scope, $http, access) {
        $scope.sign_form_validation = "sign_form.user_name.$invalid || sign_form.user_password.$invalid";
        $scope.return_message = "";
        $scope.message_type = "";

        $scope.Register = function(username, password) {
            var onSuccess = function() {
                $scope.message_type = "success";
                $scope.return_message = "Successfully registered!";
            }

            var onError = function(data) {
                $scope.message_type = "danger";
                var Message = data.Message;
                var ModelState = data.ModelState[""];

                $scope.return_message = Message + " " + ModelState;
            }

            var postData = {
                username: username,
                password: password
            }

            $http.post("/api/user/register", postData).success(onSuccess).error(onError);
        }

        $scope.Login = function(username, password) {
            var onSuccess = function(user) {
                $scope.message_type = "success";
                $scope.return_message = "Logged in!";

                access.SetKey(user.token_type + " " + user.access_token);
                access.SetUser(username);
                access.Login();
            }

            var onError = function(data) {
                $scope.message_type = "danger";
                $scope.return_message = data.error_description;
            }

            var requestData = {
                method: "POST",
                url: "/token",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: "username=" + username + "&password=" + password + "&grant_type=password"
            }
            $http(requestData).success(onSuccess).error(onError);
        }
    }
]);