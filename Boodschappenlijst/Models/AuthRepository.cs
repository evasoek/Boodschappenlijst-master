using System;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Boodschappenlijst.Models
{
    public class AuthRepository : IDisposable
    {
        private AuthContext _ctx = new AuthContext();

        private UserManager<IdentityUser> _userManager;

        public class PostModel
        {
            public string username { get; set; }
            public string password { get; set; }
            public string newpassword { get; set; }
        }

        public AuthRepository()
        {
            _userManager = new UserManager<IdentityUser>(new UserStore<IdentityUser>(_ctx));
        }

        public async Task<IdentityResult> RegisterUser(PostModel userModel)
        {
            IdentityUser user = new IdentityUser
            {
                UserName = userModel.username
            };

            var result = await _userManager.CreateAsync(user, userModel.password);

            return result;
        }

        public async Task<IdentityResult> DeleteUser(PostModel userModel)
        {
            var user = await _userManager.FindAsync(userModel.username, userModel.password);
            var result = await _userManager.DeleteAsync(user);

            return result;
        }

        public async Task<IdentityResult> ChangePassword(PostModel userModel)
        {
            var user = await _userManager.FindAsync(userModel.username, userModel.password);
            var result = await _userManager.ChangePasswordAsync(user.Id, userModel.password, userModel.newpassword);

            return result;
        }

        public async Task<IdentityUser> FindUser(string userName, string password)
        {
            IdentityUser user = await _userManager.FindAsync(userName, password);
            return user;
        }

        public void Dispose()
        {
            _ctx.Dispose();
            _userManager.Dispose();

        }
    }
}