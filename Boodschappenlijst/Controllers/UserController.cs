using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using Boodschappenlijst.Models;
using Microsoft.AspNet.Identity;

namespace Boodschappenlijst.Controllers
{
    [RoutePrefix("api/User")]
    public class UserController : ApiController
    {
        private DatabaseContext db = new DatabaseContext();
        private AuthRepository _repo = new AuthRepository();

        // Get api/User/
        [Authorize]
        public IQueryable<users> Get()
        {
            return db.users;
        }

        // POST api/User/Register
        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(AuthRepository.PostModel userModel)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            IdentityResult result = await _repo.RegisterUser(userModel);
            IHttpActionResult errorResult = GetErrorResult(result);

            if (errorResult != null) return errorResult;
            return Ok();
        }

        // POST api/User/Delete
        [Authorize]
        [Route("Delete")]
        public async Task<IHttpActionResult> PostDelete(AuthRepository.PostModel userModel)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            IdentityResult result = await _repo.DeleteUser(userModel);
            IHttpActionResult errorResult = GetErrorResult(result);

            if (errorResult != null) return errorResult;
            return Ok();
        }

        // POST api/User/Update
        [Authorize]
        [Route("Update")]
        public async Task<IHttpActionResult> PostUpdatePassword(AuthRepository.PostModel userModel)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            IdentityResult result = await _repo.ChangePassword(userModel);
            IHttpActionResult errorResult = GetErrorResult(result);

            if (errorResult != null) return errorResult;
            return Ok();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) _repo.Dispose();
            base.Dispose(disposing);
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null) return InternalServerError();
            if (result.Succeeded) return null;
            if (result.Errors != null) foreach (string error in result.Errors) ModelState.AddModelError("", error);
            if (ModelState.IsValid) return BadRequest();
            return BadRequest(ModelState);
        }
    }
}