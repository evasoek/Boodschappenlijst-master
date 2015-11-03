applicatie.controller('AccountController', [
        '$scope',
        '$http',
        'access',
        function ($scope, $http, access) {
            $scope.user_name = access.GetUser();
            $scope.return_message = '';
            $scope.message_type = '';
            var url = "/api/user";

            $scope.delete_account_validation = "account_form.user_password.$invalid";
            $scope.change_account_validation = "account_form.new_password.$invalid || account_form.user_name.$invalid || account_form.user_password.$invalid";
            $scope.change_validation = "account_form.new_password.$dirty && account_form.new_password.$invalid";

            //Deletes user
            $scope.DeleteAccount = function (userPassword) {
                var onSuccess = function () {
                    access.Logout();
                }

                var onError = function (data) {
                    $scope.message_type = "danger";
                    $scope.return_message = data.Message;
                }

                var postData = {
                    username: $scope.user_name,
                    password: userPassword
                }

                $http.post(url + "/delete", postData).success(onSuccess).error(onError);
            }

            //Changes user password
            $scope.ChangePassword = function (userPassword, newPassword) {
                var onSuccess = function () {
                    $scope.message_type = "success";
                    $scope.return_message = "Password changed!";
                }

                var onError = function (data) {
                    $scope.message_type = "danger";
                    $scope.return_message = data.Message + " " + data.ExceptionMessage;
                }

                var postData = {
                    username: $scope.user_name,
                    password: userPassword,
                    newpassword: newPassword
                }

                $http.post(url + "/update", postData).success(onSuccess).error(onError);
            }
        }]);