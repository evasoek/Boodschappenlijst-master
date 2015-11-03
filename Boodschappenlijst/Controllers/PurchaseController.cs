using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using Boodschappenlijst.Models;

namespace Boodschappenlijst.Controllers
{
    public class PurchaseController : ApiController
    {
        private DatabaseContext db = new DatabaseContext();

        // GET: api/Item
        [Authorize]
        public IQueryable<purchase> Getpurchases()
        {
            return db.purchases;
        }

        // GET: api/Item/5
        [Authorize]
        [ResponseType(typeof(purchase))]
        public IHttpActionResult Getpurchase(int id)
        {
            purchase purchase = db.purchases.Find(id);
            if (purchase == null)
            {
                return NotFound();
            }

            return Ok(purchase);
        }

        // PUT: api/Item/5
        [Authorize]
        [ResponseType(typeof(void))]
        public IHttpActionResult Putpurchase(int id, purchase purchase)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != purchase.id)
            {
                return BadRequest();
            }
            //custom fix for error message in EntityState.Modified;
            foreach (participants p in purchase.participants)
            {
                p.group_members = null;
            }
            db.Entry(purchase).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!purchaseExists(id))
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

        // POST: api/Item
        [Authorize]
        [ResponseType(typeof(purchase))]
        public IHttpActionResult Postpurchase(purchase purchase)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.purchases.Add(purchase);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = purchase.id }, purchase);
        }

        // DELETE: api/Item/5
        [Authorize]
        [ResponseType(typeof(purchase))]
        public IHttpActionResult Deletepurchase(int id)
        {
            purchase purchase = db.purchases.Find(id);
            if (purchase == null)
            {
                return NotFound();
            }

            db.purchases.Remove(purchase);
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException e)
            {
                if (!purchaseExists(id))
                {
                    return NotFound();
                }
                else
                {
                    //throw;
                }
            }
            return Ok(purchase);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool purchaseExists(int id)
        {
            return db.purchases.Count(e => e.id == id) > 0;
        }
    }
}