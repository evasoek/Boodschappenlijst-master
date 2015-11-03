describe("AccountController:", function() {
	beforeEach(module("application"));
	/* Configuration */
	var accountController, scope, window, location, httpBackend;
	
	beforeEach(inject(function(_$controller_, _$rootScope_, _$location_, _$httpBackend_) {
		scope = _$rootScope_;
		httpBackend = _$httpBackend_;
		location = _$location_,
		accountController = _$controller_("AccountController", {
			$scope: scope,
			$location: location
		});
	}));
	
	afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });
	/* End Configuration */
	
		
	it("redirects to login on delete account", function() {	
		httpBackend.expectPOST('/api/user/delete').respond(200, {});
		scope.DeleteAccount('somepassword');
		httpBackend.flush();
		expect(location.path()).toBe("/login");
	});

	
	it("indicates success on change password", function() {
		httpBackend.expectPOST('/api/user/update').respond(200, {});
		scope.ChangePassword('somepassword', 'somepassword');
		httpBackend.flush();
		expect(scope.return_message).toBe("Password changed!");
	});
	
	it("formats error message on failure", function() {
		httpBackend.expectPOST('/api/user/update').respond(400, {
			Message: "test",
			ExceptionMessage: "exception",
			ModelState: {"": "ModelState"}
		});
		scope.ChangePassword('somepassword', 'somepassword');
		httpBackend.flush();
		expect(scope.return_message).toBe("test exception");
	});
});