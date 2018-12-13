using System.Collections.Generic;

namespace RosterWebApp.Models
{
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<TeamMember> Members { get; set; }
    }
}
