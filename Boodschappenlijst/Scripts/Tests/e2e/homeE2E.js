describe('Home View', function () {

    it("adding a group", function () {
        browser.get('http://localhost:49382/#/home');
        element(by.model('group_name')).sendKeys('Test group 1');
        element(by.model('group_desc')).sendKeys('testing groups E2E');
        element(by.css('.group-submit')).click();

        var el = element(by.css('.create-alert'));

        el.isPresent().then(function (present) {
            if (present) expect(element(by.css('.create-alert')).getText()).toEqual("Group Successfully created!");
            else expect(element(by.css('.create-alert')).getText()).toEqual("Failed to create group!");
        }, function (err) {
        });
    });

    it("deleting a group", function () {
        browser.get('http://localhost:49382/#/home');
        element(by.css('.delete-btn')).click();

        var el = element(by.css('.delete-alert'));

        el.isPresent().then(function (present) {
            if (present) expect(element(by.css('.delete-alert')).getText()).toEqual("Group Successfully deleted");
            else expect(element(by.css('.delete-alert')).getText()).toEqual("Failed to delete group");
        }, function (err) {
        });
    });
});