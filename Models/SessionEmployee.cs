namespace RosterWebApp.Models
{
    public class SessionEmployee
    {
        public int Id { get; set; }
        public int SessionId { get; set; }
        public string SessionDate { get; set; }
        public string SessionSite { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeRole { get; set; }
        public double EmployeeLOD { get; set; }
        public double EmployeeOT { get; set; }
    }
}
