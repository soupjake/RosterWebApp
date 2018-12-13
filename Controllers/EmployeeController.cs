using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using RosterWebApp.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using Newtonsoft.Json;

namespace RosterWebApp.Controllers
{
    [Route("api/[controller]")]
    public class EmployeeController : Controller
    {
        [HttpGet]
        [Route("GetEmployees")]
        public List<Employee> GetEmployees([FromQuery]string date)
        {
            string query = "SELECT * FROM EmployeeTable;";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    List<Employee> employees = conn.Query<Employee>(query).ToList();
                    if(employees.Count < 1)
                    {
                        employees.Add(new Employee
                        {
                            Id = 1001,
                            Name = "Manager 1",
                            Role = "Manager",
                            ContractHours = 37.5,
                            WorkPattern = "Mon,Tue,Wed,Thu,Fri"
                        });
                        employees.Add(new Employee
                        {
                            Id = 1002,
                            Name = "Manager 2",
                            Role = "Manager",
                            ContractHours = 30.0,
                            WorkPattern = "Fri,Sat,Sun,Mon"
                        });
                        employees.Add(new Employee
                        {
                            Id = 1003,
                            Name = "Supervisor 1",
                            Role = "Supervisor",
                            ContractHours = 37.5,
                            WorkPattern = "Mon,Tue,Wed,Thu,Fri"
                        });
                        employees.Add(new Employee
                        {
                            Id = 1004,
                            Name = "Supervisor 2",
                            Role = "Supervisor",
                            ContractHours = 37.5,
                            WorkPattern = "Mon,Tue,Wed,Thu,Fri"
                        });
                        employees.Add(new Employee
                        {
                            Id = 1005,
                            Name = "Supervisor 3",
                            Role = "Supervisor",
                            ContractHours = 30.0,
                            WorkPattern = "Fri,Sat,Sun,Mon"
                        });
                        employees.Add(new Employee
                        {
                            Id = 1006,
                            Name = "Supervisor 4",
                            Role = "Supervisor",
                            ContractHours = 30.0,
                            WorkPattern = "Fri,Sat,Sun,Mon"
                        });
                        employees.Add(new Employee
                        {
                            Id = 1007,
                            Name = "Agent 1",
                            Role = "Agent",
                            ContractHours = 37.5,
                            WorkPattern = "Mon,Tue,Wed,Thu,Fri"
                        });
                        employees.Add(new Employee
                        {
                            Id = 1008,
                            Name = "Agent 2",
                            Role = "Agent",
                            ContractHours = 37.5,
                            WorkPattern = "Mon,Tue,Wed,Thu,Fri"
                        });
                        employees.Add(new Employee
                        {
                            Id = 1009,
                            Name = "Agent 3",
                            Role = "Agent",
                            ContractHours = 37.5,
                            WorkPattern = "Mon,Tue,Wed,Thu,Fri"
                        });
                        employees.Add(new Employee
                        {
                            Id = 1010,
                            Name = "Agent 4",
                            Role = "Agent",
                            ContractHours = 37.5,
                            WorkPattern = "Mon,Tue,Wed,Thu,Fri"
                        });
                        employees.Add(new Employee
                        {
                            Id = 1011,
                            Name = "Agent 5",
                            Role = "Agent",
                            ContractHours = 30.0,
                            WorkPattern = "Fri,Sat,Sun,Mon"
                        });
                        employees.Add(new Employee
                        {
                            Id = 1012,
                            Name = "Agent 6",
                            Role = "Agent",
                            ContractHours = 30.0,
                            WorkPattern = "Fri,Sat,Sun,Mon"
                        });
                        employees.Add(new Employee
                        {
                            Id = 1013,
                            Name = "Agent 7",
                            Role = "Agent",
                            ContractHours = 30.0,
                            WorkPattern = "Fri,Sat,Sun,Mon"
                        });
                        employees.Add(new Employee
                        {
                            Id = 1014,
                            Name = "Agent 8",
                            Role = "Agent",
                            ContractHours = 30.0,
                            WorkPattern = "Fri,Sat,Sun,Mon"
                        });
                        string queryInitialise = "INSERT INTO EmployeeTable (Id, Name, Role, ContractHours, WorkPattern) " +
                            "VALUES (@Id, @Name, @Role, @ContractHours, @WorkPattern);";
                        conn.Execute(queryInitialise, employees);
                    }
                    GetStatuses(employees, AbsenceController.GetAbsencesStatic(date));
                    return employees;
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                    return new List<Employee>();
                }
            }
        }

        [HttpGet]
        [Route("GetTeamEmployees")]
        public List<Employee> GetTeamEmployees()
        {
            string query = "SELECT * FROM EmployeeTable;";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    List<Employee> employees = conn.Query<Employee>(query).ToList();
                    return employees;
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                    return new List<Employee>();
                }
            }
        }

        [HttpPost]
        [Route("Create")]
        public int Create()
        {
            Employee employee = new Employee();
            using (StreamReader sr = new StreamReader(Request.Body))
            {
                employee = JsonConvert.DeserializeObject<Employee>(sr.ReadToEnd());
            }
            if (employee != null)
            {
                string query = "INSERT INTO EmployeeTable (Id, Name, Role, ContractHours, WorkPattern)" +
                    "VALUES (@Id, @Name, @Role, @ContractHours, @WorkPattern);";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        return conn.Execute(query, employee);
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine(ex);
                        return -1;
                    }
                }
            }
            else
            {
                return -1;
            }
        }

        [HttpGet]
        [Route("GetById")]
        public Employee GetById([FromQuery]int id)
        {
            Employee temp = GetByIdStatic(id);
            if(temp == null)
            {
                temp = new Employee();
            }
            return temp;
        }

        public static Employee GetByIdStatic(int id)
        {
            string query = "SELECT * FROM EmployeeTable WHERE Id=@Id;";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    return conn.QueryFirstOrDefault<Employee>(query, new { id });
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                    return null;
                }
            }
        }

        [HttpPut]
        [Route("Update")]
        public int Update()
        {
            Employee employee = new Employee();
            using (StreamReader sr = new StreamReader(Request.Body))
            {
                employee = JsonConvert.DeserializeObject<Employee>(sr.ReadToEnd());
            }
            if (employee != null)
            {
                string query = "UPDATE EmployeeTable SET Role=@Role, ContractHours=@ContractHours, WorkPattern=@WorkPattern WHERE Id=@Id;";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        return conn.Execute(query, employee);
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine(ex);
                        return -1;
                    }
                }
            }
            else
            {
                return -1;
            }
        }

        [HttpDelete]
        [Route("Delete")]
        public int Delete([FromQuery]int id)
        {
            if (id > 0)
            {
                string query = "DELETE FROM EmployeeTable WHERE Id=@Id;";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        return conn.Execute(query, new { id });
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine(ex);
                        return -1;
                    }
                }
            }
            else
            {
                return -1;
            }
        }

        [HttpGet]
        [Route("GetAvailable")]
        public List<Employee> GetAvailable([FromQuery]string date, [FromQuery]string day)
        {
            List<Employee> available = new List<Employee>();
            foreach (Employee e in GetEmployees(date))
            {
                if (e.WorkPattern.Contains(day.Substring(0, 3)))
                {
                    if (e.Status == "Okay")
                    {
                        available.Add(e);
                    }
                }
            }
            return available;
        }

        [HttpGet()]
        [Route("GetEmployeeSessions")]
        public List<Session> GetEmployeeSessions([FromQuery]int employeeid, [FromQuery]string startdate, [FromQuery]string enddate)
        {
            List<Session> sessions = new List<Session>();
            string query = "SELECT SessionId FROM SessionEmployeeTable WHERE SessionDate BETWEEN @StartDate AND @EndDate AND EmployeeId=@EmployeeId;";
            string querySession = "SELECT * FROM SessionTable WHERE Id=@SessionId";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    List<int> sessionids = conn.Query<int>(query, new { startdate, enddate, employeeid }).ToList();
                    foreach(int sessionid in sessionids)
                    {
                        sessions.Add(conn.QueryFirstOrDefault<Session>(querySession, new { sessionid }));
                    }
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                }
            }
            return sessions;
        }

        public static void GetStatuses(List<Employee> employees, List<Absence> absences)
        {
            for (int i = 0; i < employees.Count; i++)
            {
                string status = "Okay";
                for (int j = 0; j < absences.Count; j++)
                {
                    if (absences[j].EmployeeId == employees[i].Id)
                    {
                        status = absences[j].Type;
                        break;
                    }
                }
                employees[i].Status = status;
            }
        }       
    }
}
