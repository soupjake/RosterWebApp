using System.Collections.Generic;

namespace RosterWebApp.Models
{
    public class TeamSite
    {
        public string Date { get; set; }
        public string Day { get; set; }
        public List<SessionEmployee> Members { get; set; }
    }
}
