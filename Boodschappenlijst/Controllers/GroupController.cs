using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using System.Xml.Schema;
using Boodschappenlijst.Models;

namespace Boodschappenlijst.Controllers
{
    [Authorize]
    public class GroupController : ApiController
    {
        private DatabaseContext db = new DatabaseContext();
        //
        // GET: api/Group
        [Authorize]
        public IQueryable<groups> Getgroups()
        {
            return db.groups;
        }

        [Authorize]
        [Route("api/Group/ByMember/{member_id}")]
        public IQueryable<groups> GetgroupWhereMember(string member_id)
        {
            return from g in db.groups
                        from m in g.group_members
                        where m.username == member_id
                        select g;
        }

        // GET: api/Group/5
        [Authorize]
        [ResponseType(typeof(groups))]
        public IHttpActionResult Getgroups(int id)
        {
            groups groups = db.groups.Find(id);
            if (groups == null)
            {
                return NotFound();
            }

            return Ok(groups);
        }

        // PUT: api/Group/5
        [Authorize]
        [ResponseType(typeof(void))]
        public IHttpActionResult Putgroups(int id, groups groups)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != groups.id)
            {
                return BadRequest();
            }

            db.Entry(groups).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!groupsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Group
        [Authorize]
        [ResponseType(typeof(groups))]
        public IHttpActionResult Postgroups(groups groups)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.groups.Add(groups);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = groups.id }, groups);
        }

        // DELETE: api/Group/5
        [Authorize]
        [ResponseType(typeof(groups))]
        public IHttpActionResult Deletegroups(int id)
        {
            groups groups = db.groups.Find(id);
            if (groups == null)
            {
                return NotFound();
            }

            db.groups.Remove(groups);
            db.SaveChanges();

            return Ok(groups);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool groupsExists(int id)
        {
            return db.groups.Count(e => e.id == id) > 0;
        }
    }
}