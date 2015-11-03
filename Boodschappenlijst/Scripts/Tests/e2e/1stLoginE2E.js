describe('Login View', function() {
  it("should check for password length < 6", function () {
      browser.get('http://localhost:49382/#/login');
      element(by.model('user_name')).sendKeys('SampleUser');
      element(by.model('user_password')).sendKeys('12345');

      var message = element(by.css('[ng-show="sign_form.user_password.$error.minlength"]'));
      expect(message.getText()).toEqual("Password must be longer.");
  });

  it("should return message on incorrect credentials", function () {
      browser.get('http://localhost:49382/#/login');
      element(by.model('user_name')).sendKeys('BadCredentials');
      element(by.model('user_password')).sendKeys('BadCredentials');
      element(by.buttonText("Sign in!")).click();

      var el = element(by.css('.responseMsg'));

      el.isPresent().then(function(present) {
          if (present) expect(element(by.css('.responseMsg')).getText()).toEqual("The user name or password is incorrect.");
          else expect(present).toEqual(true);
      }, function (err) {
      });
  });
});