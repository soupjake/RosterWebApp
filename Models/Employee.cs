namespace RosterWebApp.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
        public double ContractHours { get; set; }
        public double AppointedHours { get; set; }
        public double AbsenceHours { get; set; }
        public double OvertimeHours { get; set; }
        public double NegHours { get; set; }
        public double COHours { get; set; }
        public string WorkPattern { get; set; }
        public string Status { get; set; }
    }
}
