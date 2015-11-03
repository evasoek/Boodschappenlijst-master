describe("HomeController:", function() {
    beforeEach(module("application"));

    /* Configuration */
    var homeController, scope, window, location, httpBackend;

    beforeEach(inject(function(_$controller_, _$rootScope_, _$location_, _$httpBackend_) {
        scope = _$rootScope_;
        httpBackend = _$httpBackend_;
        location = _$location_,
            homeController = _$controller_("HomeController", {
                $scope: scope,
                $location: location
            });
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    /* End Configuration */

    /**
     * Test creating group 
     */
    
    // success
    it("indicates success on create group", function () {
        httpBackend.whenGET('/api/group/ByMember/null').respond(200, {});
        httpBackend.flush();

        scope.groups = [];
        httpBackend.expectPOST('/api/group').respond(200, {
            id: 114
        });
        httpBackend.expectPOST('/api/member').respond(200, {
            username: 'Eva',
            group_id: 114,
            balance: 0
        });
        scope.createGroup('Group Name', 'Group Description', 'Eva');
        httpBackend.flush();
        expect(scope.create_return_message).toBe("Group Successfully created!");
    });


    // failure
    it("formats error message on failure creating group", function () {
        httpBackend.whenGET('/api/group/ByMember/null').respond(200, {});
        httpBackend.flush();

        httpBackend.expectPOST('/api/group').respond(400, {});
        scope.createGroup('Group Name', 'Group Description', 'Eva');
        httpBackend.flush();
        expect(scope.create_return_message).toBe("Failed to create group!");
    });

    // success
    it("indicates success on delete group", function () {
        httpBackend.whenGET('/api/group/ByMember/null').respond(200, {});
        httpBackend.flush();

        scope.groups = [];
        httpBackend.expectDELETE('/api/group/114').respond(200, {});
        scope.deleteGroup({ id: 114 });
        httpBackend.flush();
        expect(scope.return_message).toBe("Group Successfully deleted");
    });

    // failure
    it("formats error message on failure deleting group", function () {
        httpBackend.whenGET('/api/group/ByMember/null').respond(200, {});
        httpBackend.flush();

        httpBackend.expectDELETE('/api/group/114').respond(400, {});
        scope.deleteGroup({ id: 114 });
        httpBackend.flush();
        expect(scope.return_message).toBe("Failed to delete group");
    });
});