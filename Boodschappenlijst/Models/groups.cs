using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Boodschappenlijst.Models
{
    public partial class groups
    {
        [Key]
        public int id { get; set; }

        [Required]
        [StringLength(50)]
        public string name { get; set; }

        [StringLength(255)]
        public string description { get; set; }

        public virtual ICollection<group_members> group_members { get; set; }
    }
}
