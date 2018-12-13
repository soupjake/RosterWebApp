namespace RosterWebApp.Models
{
    public class TeamMember
    {
        public int Id { get; set; }
        public int TeamId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeRole { get; set; }
    }
}
