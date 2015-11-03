using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using Boodschappenlijst.Models;

namespace Boodschappenlijst.Controllers
{
    public class MemberController : ApiController
    {
        private DatabaseContext db = new DatabaseContext();

        // GET: api/Member
        [Authorize]
        public IQueryable<group_members> Getgroup_members()
        {
            return db.group_members;
        }

        // GET: api/Member/5
        [Authorize]
        [Route("api/Member/{username}/{groupid}")]
        [ResponseType(typeof(group_members))]
        public IHttpActionResult Getgroup_members(string username, int groupid)
        {
            group_members group_members = db.group_members.Find(username, groupid);
            if (group_members == null)
            {
                return NotFound();
            }

            return Ok(group_members);
        }

        // PUT: api/Member/5
        [Authorize]
        [ResponseType(typeof(void))]
        [Route("api/Member/{username}/{groupid}")]
        public IHttpActionResult Putgroup_members(string username,int groupid, group_members group_members)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            /*if (id != group_members.username)
            {
                return BadRequest();
            }*/
            group_members groupMember = db.group_members.Find(username, groupid);
           // db.Entry(group_members).State = EntityState.Modified;
            groupMember.balance = group_members.balance;
            
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                /*if (!group_membersExists(id))
                {
                    return NotFound();
                }*/
                //else
                //{
                    throw;
                //}
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Member
        [Authorize]
        [ResponseType(typeof(group_members))]
        public IHttpActionResult Postgroup_members(group_members group_members)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.group_members.Add(group_members);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (group_membersExists(group_members.username))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = group_members.username }, group_members);
        }

        public class IdsObj
        {
            public int groupid;
            public string username;
        }

        // DELETE: api/Member/5/
        [Authorize]
        [Route("api/Member/{username}/{groupid}")]
        [ResponseType(typeof(group_members))]
        public IHttpActionResult Deletegroup_members(string username,int groupid)
        {

            group_members groupMember = db.group_members.Find(username, groupid);
            if (groupMember == null)
            {
                return NotFound();
            }

            db.group_members.Remove(groupMember);
            db.SaveChanges();

            return Ok(groupMember);

            
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool group_membersExists(string id)
        {
            return db.group_members.Count(e => e.username == id) > 0;
        }
    }
}