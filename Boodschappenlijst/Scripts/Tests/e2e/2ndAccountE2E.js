describe('Account View', function () {

    it("deleting user with bad password", function () {
        browser.get('http://localhost:49382/#/login');
        element(by.model('user_name')).sendKeys('Kacper');
        element(by.model('user_password')).sendKeys('123456');
        element(by.buttonText("Sign in!")).click();

        browser.waitForAngular();

        browser.get('http://localhost:49382/#/account');
        element(by.model('user_password')).sendKeys('BadPassword');

        browser.waitForAngular();

        element(by.buttonText("Verwijder Account")).click();
        var el = element(by.css('.responseMsg'));

        el.isPresent().then(function (present) {
            if (present) expect(element(by.css('.responseMsg')).getText()).toEqual("An error has occurred.");
            else expect(present).toEqual(true);
        }, function (err) {
        });
    });
});