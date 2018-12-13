namespace RosterWebApp.Models
{
    public class Absence
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string Type { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public double Hours { get; set; }
    }
}
