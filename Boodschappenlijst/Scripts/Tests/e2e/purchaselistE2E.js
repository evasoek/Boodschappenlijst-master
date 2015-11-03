describe('PurchaseList View', function () {
    it("insert new purchase", function () {
        browser.get('http://localhost:49382/#/groupinfo/15');
        element(by.buttonText('Voeg toe')).click();

        element(by.model("purchaselist.description")).sendKeys("2 appels\n");
        element(by.model("purchaselist.description")).sendKeys("1 banaan\n");
        element(by.model("purchaselist.description")).sendKeys("5 danoontjes\n");
        element.all(by.css(".clickablerow")).each(function (element, index) {
            element.click();
        });

        element(by.buttonText("christiaan")).click();
        element(by.buttonText("eva")).click();
        element(by.buttonText("klaas")).click();

        var el = element(by.css('.alerttext'));

        el.isPresent().then(function (present) {
            if (present) expect(element(by.css('.alerttext')).getText()).toEqual("Please assign participants.");
            else expect(present).toEqual(true);
        }, function (err) {
        });

        element(by.buttonText("Invoeren")).click();

        element.all(by.css(".clickablerow")).each(function (element, index) {
            element.click();
        });

        element(by.model("purchaselist.description")).clear();

        element(by.buttonText("Invoeren")).click();

        el.isPresent().then(function (present) {
            if (present) expect(element(by.css('.alerttext')).getText()).toEqual("Please fill in a description.");
            else expect(present).toEqual(true);
        }, function (err) {
        });

        element(by.model("purchaselist.description")).sendKeys("2 appels\n");
        element(by.model("purchaselist.description")).sendKeys("1 banaan\n");
        element(by.model("purchaselist.description")).sendKeys("5 chocoladerepen\n");
        element(by.buttonText("Invoeren")).click();

    });
});