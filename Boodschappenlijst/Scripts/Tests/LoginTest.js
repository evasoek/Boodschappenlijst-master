describe("LoginController:", function() {
	beforeEach(module("application"));
	/* Configuration */
	var loginController, scope, window, location, httpBackend;
	
	beforeEach(inject(function(_$controller_, _$rootScope_, _$window_, _$location_, _$httpBackend_) {
		scope = _$rootScope_;
		httpBackend = _$httpBackend_;
		location = _$location_,
		window = _$window_;
		loginController = _$controller_("LoginController", {
			$scope: scope,
			$window: window,
			$location: location
		});
	}));
	
	afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });
	/* End Configuration */
	
	it("logout unsets sessionStorage", function() {	
			httpBackend.expectPOST('/token').respond(200, {
			    token_type: "bower",
			    access_token: "encryptedToken"			
			});
			scope.Login('TestUser', 'goodcredential');
			httpBackend.flush();
			scope.Logout();
			
			var auth = window.sessionStorage.getItem('auth');
			var username = window.sessionStorage.getItem('username');
				
	        expect(auth).toBeNull();
	        expect(username).toBeNull();
	});
	
	it("login fail on bad credentials", function() {	
	    //It is only simulation so even good credential would return 400 error (because respond is set to 400).
	    //Therefore, actual webservices do not need to be up and running.
		httpBackend.expectPOST('/token').respond(400, {});
		scope.Login('badcredential', 'badcredential');
		httpBackend.flush();
		expect(scope.message_type).toBe('danger');
	});
	
	it("login succeed/redirects on good credentials", function() {		
		window.sessionStorage.setItem("loggedIn", false);
        window.sessionStorage.setItem("auth", null);
        window.sessionStorage.setItem("username", null);
			
		httpBackend.expectPOST('/token').respond(200, {
				token_type: "bower",
				access_token: "encryptedToken"			
		});
		scope.Login('goodcredential', 'goodcredential');
		httpBackend.flush();
		
		var auth = window.sessionStorage.getItem('auth');
		var username = window.sessionStorage.getItem('username');
		var messageType = scope.message_type;
		var returnMessage = scope.return_message;
		 
		expect(auth).toBe("bower encryptedToken");				 
		expect(username).toBe("goodcredential");
		expect(messageType).toBe("success");
		expect(returnMessage).toBe("Logged in!");
		expect(location.path()).toBe("/home");
	});
});