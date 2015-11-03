using System.Data.Entity;

namespace Boodschappenlijst.Models
{
    public class DatabaseContext : DbContext
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx
    
        public DatabaseContext() : base("name=DatabaseContext")
        {

        }

        public DbSet<users> users { get; set; }

        public DbSet<groups> groups { get; set; }

        public DbSet<group_members> group_members { get; set; }

        public DbSet<purchase> purchases { get; set; }

        public DbSet<participants> participants { get; set; }
    
    }
}
