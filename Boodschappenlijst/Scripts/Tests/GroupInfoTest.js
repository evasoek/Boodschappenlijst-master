describe("GroupInfoController:", function () {
    beforeEach(module("application"));
    /* Configuration */
    var accountController, scope, window, location, httpBackend;

    beforeEach(inject(function (_$controller_, _$rootScope_, _$location_, _$httpBackend_) {
        scope = _$rootScope_;
        rootScope = _$rootScope_;
        httpBackend = _$httpBackend_;
        location = _$location_,
		accountController = _$controller_("GroupInfoController", {
		    $scope: scope,
		    $location: location
		});
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });
    /* End Configuration */
    it("check calculate balance", function () {
        rootScope.group = {};
        rootScope.group.group_members = [];
        httpBackend.when('GET', '/api/Group/undefined').respond({});
        httpBackend.when('GET', 'api/purchase').respond([]);
        httpBackend.when('GET', 'api/User').respond("test");
        httpBackend.flush();
        scope.currentPurchase = {};
        scope.currentPurchase.group_id = 2;
        scope.currentPurchase.id = 2;
        scope.currentPurchase.price = 20;
        scope.currentPurchase.currentGroupMember = {};
        scope.currentPurchase.currentGroupMember.username = "christiaan";
        scope.currentPurchase.currentGroupMember.balance = 10;
        scope.currentPurchase.participants = [{
            username: "eva", group_id: 2, purchase_id: 2, group_members: {
                balance: 30
            }
        }, {
            username: "klaas", purchase_id: 2, group_id: 2, group_members: {
                balance: 50
            }
        }];
        scope.calculateBalances();
        expect(scope.currentPurchase.currentGroupMember.futureBalance).toBe(30);
        scope.currentPurchase.participants.forEach(function (participant) {
            if (!participant.ignore) {
                var expectedBalance = participant.group_members.balance - (scope.currentPurchase.price / scope.currentPurchase.participants.length);
                expect(participant.balance).toBe(expectedBalance);
            }
        })
    });



});