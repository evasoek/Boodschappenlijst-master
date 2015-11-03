using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Boodschappenlijst.Models
{
    [Table("purchase")]
    public partial class purchase
    {
        [Key]
        public int id { get; set; }

        [Required]
        [StringLength(255)]
        public string description { get; set; }

        [Column(TypeName = "money")]
        public decimal price { get; set; }

        [StringLength(320)]
        public string purchaser { get; set; }
        
        public virtual ICollection<participants> participants { get; set; }
    }
}
