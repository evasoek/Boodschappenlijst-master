using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Boodschappenlijst.Models
{
    public partial class participants
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(320)]
        public string username { get; set; }

        [Key]
        [Column(Order = 1)]
        public int group_id { get; set; }

        [Key]
        [Column(Order = 2)]
        public int purchase_id { get; set; }

        public virtual group_members group_members { get; set; }

        [ForeignKey("purchase_id")]
        public virtual purchase purchase { get; set; }
    }
}
