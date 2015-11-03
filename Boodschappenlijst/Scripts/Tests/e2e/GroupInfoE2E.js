
describe('GroupInfo View', function () {
    it("delete purchase", function () {
        browser.get('http://localhost:49382/#/groupinfo/15');
        element(by.id('userbutton')).click();
        element(by.id('delete')).click();
        element(by.id('selectuser')).click();
        element(by.id('adduser')).click();
        element(by.id('purchasebutton')).click();
        element(by.id('deletepurchase')).click();
        expect(element(by.css('.alert-success')).getText()).toEqual("met succes boodschap verwijdert!");
    });
});