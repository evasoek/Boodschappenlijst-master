﻿using Microsoft.AspNet.Identity.EntityFramework;

namespace Boodschappenlijst.Models
{
    public class AuthContext : IdentityDbContext<IdentityUser>
    {
        public AuthContext() : base("AuthContext")
        {

        }
    }
}