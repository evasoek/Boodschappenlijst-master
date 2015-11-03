using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Boodschappenlijst.Models
{
    public partial class group_members
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(320)]
        public string username { get; set; }

        [Key]
        [Column(Order = 1)]
        public int group_id { get; set; }

        [ForeignKey("username")]
        public virtual users users { get; set; }

        public virtual ICollection<participants> participants { get; set; }

        [ForeignKey("group_id")]
        public virtual groups groups { get; set; }

        [Column(TypeName = "money")]
        public decimal balance { get; set; }

        
    }
}
