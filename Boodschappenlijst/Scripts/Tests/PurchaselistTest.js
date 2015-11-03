describe("PurchaseListController:", function () {
    beforeEach(module("application"));

    /* Configuration */
    var purchaselistController, scope, window, location, httpBackend;

    beforeEach(inject(function (_$controller_, _$rootScope_, _$location_, _$httpBackend_) {
        scope = _$rootScope_;
        httpBackend = _$httpBackend_;
        location = _$location_,
		purchaselistController = _$controller_("PurchaseListController", {
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
     * Test creating purchase 
     */
    //successfully insert purchase
    it("indicates success on create purchase", function () {
        httpBackend.expectPOST('api/purchase/').respond(200, {}); //for insert purchase
        httpBackend.expectPOST('api/participant').respond(200, {}); //for participant christiaan
        httpBackend.expectPOST('api/participant').respond(200, {}); //for participant klaas
        scope.group = {};
        scope.group.id = 14;
        scope.purchaselist = {};
        scope.purchaselist.id = 999;
        scope.purchaselist.description = "2 pakken melk";
        scope.participants = [{ username: "klaas", groupid: 14, purchaseid: 999 }, { username: "christiaan", groupid: 14, purchaseid: 999 }];
        scope.membersNotInParticipants = [];
        scope.purchaselist.status = "invoeren";
        scope.insertPurchase();
        httpBackend.flush();
        expect(scope.create_return_message).toBe("Purchase Successfully created!");
    });
    //error no purchase description
    it("formats error message on failure creating purchase, because no description.", function () {
        scope.purchaselist = {};
        scope.purchaselist.id = 999;
        scope.purchaselist.description = "";
        scope.participants = [{ username: "klaas", groupid: 14, purchaseid: 999 }, { username: "christiaan", groupid: 14, purchaseid: 999 }];
        scope.membersNotInParticipants = [];
        scope.purchaselist.status = "invoeren";
        scope.insertPurchase();
        expect(scope.alertmessage).toBe("Please fill in a description.");
    });
    //error no participants assigned to purchase
    it("formats error message on failure creating purchase, because no participants.", function () {
        scope.purchaselist = {};
        scope.purchaselist.id = 999;
        scope.purchaselist.description = "2 pakken melk";
        scope.participants = [];
        scope.membersNotInParticipants = [];
        scope.purchaselist.status = "invoeren";
        scope.insertPurchase();
        expect(scope.alertmessage).toBe("Please assign participants.");
    });
    //remove participant from purchase
    it("indicates success on remove participant", function () {
        expectedParticipants = [{ username: "christiaan" }];
        expectedMembersNotInParticipants = [{ username: "eva" }, { username: "kacper" }, { username: "klaas" }];

        scope.participants = [{ username: "klaas" }, { username: "christiaan" }];
        scope.membersNotInParticipants = [{ username: "eva" }, { username: "kacper" }];

        scope.removeParticipant(scope.participants[0]);

        expect(angular.equals(scope.membersNotInParticipants, expectedMembersNotInParticipants)).toBe(true);
        expect(angular.equals(scope.participants, expectedParticipants)).toBe(true);
    });
    //add participant to purchase
    it("indicates success on add participant", function () {
        expectedParticipants = [{ username:"klaas" }, { username:"christiaan" }, { username:"eva" }];
        expectedMembersNotInParticipants = [{ username:"kacper" }];

        scope.participants = [{ username:"klaas" }, { username:"christiaan" }];
        scope.membersNotInParticipants = [{ username:"eva" }, { username:"kacper" }];

        scope.addParticipant(scope.membersNotInParticipants[0]);

        expect(angular.equals(scope.membersNotInParticipants, expectedMembersNotInParticipants)).toBe(true);
        expect(angular.equals(scope.participants, expectedParticipants)).toBe(true);
    });
});