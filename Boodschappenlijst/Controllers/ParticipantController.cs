    using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using Boodschappenlijst.Models;

namespace Boodschappenlijst.Controllers
{
    public class ParticipantController : ApiController
    {
        private DatabaseContext db = new DatabaseContext();

        // GET: api/Participant
        [Authorize]
        public IQueryable<participants> Getparticipants()
        {
            return db.participants;
        }

        // GET: api/Participant/5
        [Authorize]
        [ResponseType(typeof(participants))]
        public IHttpActionResult Getparticipants(string id)
        {
            participants participants = db.participants.Find(id);
            if (participants == null)
            {
                return NotFound();
            }

            return Ok(participants);
        }

        // PUT: api/Participant/5
        [Authorize]
        [ResponseType(typeof(void))]
        public IHttpActionResult Putparticipants(string id, participants participants)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != participants.username)
            {
                return BadRequest();
            }

            db.Entry(participants).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!participantsExists(id))
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

        // POST: api/Participant
        [Authorize]
        [ResponseType(typeof(participants))]
        public IHttpActionResult Postparticipants(participants participants)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.participants.Add(participants);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException e)
            {
                if (participantsExists(participants.username))
                {
                    return Conflict();
                }
                else
                {
                    throw e;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = participants.username }, participants);
        }

        // DELETE: api/Participant/5
        [Authorize]
        [Route("api/Participant/{username}/{groupid}/{purchaseid}")]
        [ResponseType(typeof(participants))]
        public IHttpActionResult Deleteparticipants(string username, int groupid, int purchaseid)
        {
            participants participants = db.participants.Find(username, groupid, purchaseid);
            if (participants == null)
            {
                return NotFound();
            }

            db.participants.Remove(participants);
            db.SaveChanges();

            return Ok(participants);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool participantsExists(string id)
        {
            return db.participants.Count(e => e.username == id) > 0;
        }
    }
}