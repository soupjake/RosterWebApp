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
    public class AbsenceController : Controller
    {
        [HttpGet]
        [Route("GetAbsences")]
        public List<Absence> GetAbsences([FromQuery]string date)
        {
            return GetAbsencesStatic(date);
        }

        public static List<Absence> GetAbsencesStatic(string date)
        {
            string query = "SELECT * FROM AbsenceTable WHERE @Date BETWEEN StartDate AND EndDate;";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    return conn.Query<Absence>(query, new { date }).ToList();
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                    return new List<Absence>();
                }
            }
        }

        [HttpGet]
        [Route("GetById")]
        public Absence GetById([FromQuery]int id)
        {
            string query = "SELECT * FROM AbsenceTable WHERE Id=@Id;";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    return conn.QueryFirstOrDefault<Absence>(query, new { id });
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                    return null;
                }
            }
        }

        [HttpPost]
        [Route("Create")]
        public int Create()
        {
            Absence absence = new Absence();
            int rows = 0;
            using (StreamReader sr = new StreamReader(Request.Body))
            {
                absence = JsonConvert.DeserializeObject<Absence>(sr.ReadToEnd());
            }
            if (absence != null)
            {
                string query = "IF NOT EXISTS (SELECT * FROM AbsenceTable WHERE EmployeeId=@EmployeeId AND StartDate=@StartDate) " +
                "INSERT INTO AbsenceTable (EmployeeId, EmployeeName, Type, StartDate, EndDate, Hours)" +
                "VALUES (@EmployeeId, @EmployeeName, @Type, @StartDate, @EndDate, @Hours);";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        rows = conn.Execute(query, absence);
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine(ex);
                        rows = -1;
                    }
                }
            }
            if(rows > 0)
            {
                RosterController.UpdateAbsence(absence.EmployeeId, absence.Hours, RosterController.GetWeek(absence.StartDate));
            }
            return rows;
        }

        [HttpPut]
        [Route("Update")]
        public int Update()
        {
            Absence before;
            Absence after;
            int rows = 0;
            using (StreamReader sr = new StreamReader(Request.Body))
            {
                List<Absence> absences = JsonConvert.DeserializeObject<List<Absence>>(sr.ReadToEnd());
                before = absences[0];
                after = absences[1];
            }
            if (after != null)
            {
                string query = "UPDATE AbsenceTable" +
                " SET Type=@Type, EndDate=@EndDate, Hours=@Hours WHERE Id=@Id;";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        rows = conn.Execute(query, after);
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine(ex);
                        rows= -1;
                    }
                }
            }
            if(rows > 0)
            {
                double difference = after.Hours - before.Hours;
                RosterController.UpdateAbsence(after.EmployeeId, difference, RosterController.GetWeek(after.StartDate));
            }
            return rows;
        }

        [HttpDelete()]
        [Route("Delete")]
        public int Delete()
        {
            Absence absence = new Absence();
            int rows = 0;
            using (StreamReader sr = new StreamReader(Request.Body))
            {
                absence = JsonConvert.DeserializeObject<Absence>(sr.ReadToEnd());
            }
            if (absence != null)
            {
                string query = "DELETE FROM AbsenceTable WHERE Id=@Id;";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        rows = conn.Execute(query, absence);
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine(ex);
                        rows = -1;
                    }
                }
            }
            if (rows > 0)
            {
                RosterController.UpdateAbsence(absence.EmployeeId, -absence.Hours, RosterController.GetWeek(absence.StartDate));
            }
            return rows;
        }

        public static string GetStatus(int id, DateTime date, List<Absence> absences)
        {
            string status = "Okay";
            foreach (Absence a in absences)
            {
                if (a.EmployeeId == id
                    && DateTime.Parse(a.StartDate).CompareTo(date) <= 0
                    && DateTime.Parse(a.EndDate).CompareTo(date) >= 0)
                {
                    status = a.Type;
                    break;
                }
            }
            return status;
        }

        public static string GetEmployeeStatus(int employeeid, string date)
        {
            string query = "SELECT * FROM AbsenceTable WHERE EmployeeId=@EmployeeId AND @Date BETWEEN StartDate AND EndDate;";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    Absence temp = conn.QueryFirstOrDefault<Absence>(query, new { employeeid, date });
                    if(temp != null)
                    {
                        return temp.Type;
                    }
                    else
                    {
                        return "";
                    }
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                    return "";
                }
            }
        }
    }
}
