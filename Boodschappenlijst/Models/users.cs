using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Boodschappenlijst.Models
{
    [Table("AspNetUsers")]
    public partial class users
    {
        [Key]
        [StringLength(320)]
        public string username { get; set; }

        public virtual ICollection<group_members> group_members { get; set; }
    }
}
