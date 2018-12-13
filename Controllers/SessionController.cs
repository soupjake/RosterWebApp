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
    public class SessionController : Controller
    {

        [HttpGet()]
        [Route("GetSessions")]
        public List<Session> GetSessions([FromQuery]string date)
        {
            string query = "SELECT * FROM SessionTable WHERE Date=@Date;";
            string queryList = "SELECT * From SessionEmployeeTable WHERE SessionId=@Id";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    List<Session> temp =  conn.Query<Session>(query, new { date }).ToList();
                    foreach(Session s in temp)
                    {
                        s.Employees = conn.Query<SessionEmployee>(queryList, new { s.Id }).ToList();
                    }
                    return temp;
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                    return new List<Session>();
                }
            }
        }

        [HttpGet()]
        [Route("GetById")]
        public Session GetById([FromQuery]int id)
        {
            string query = "SELECT * FROM SessionTable WHERE Id=@Id;";
            string queryList = "SELECT * FROM SessionEmployeeTable WHERE SessionId=@Id";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    Session temp = conn.QueryFirstOrDefault<Session>(query, new { id });
                    temp.Employees = conn.Query<SessionEmployee>(queryList, new { id }).ToList();
                    return temp;
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
            Session session = new Session();
            using (StreamReader sr = new StreamReader(Request.Body))
            {
                session = JsonConvert.DeserializeObject<Session>(sr.ReadToEnd());
                session.Day = DateTime.Parse(session.Date).DayOfWeek.ToString();
                session.Holiday = CheckHoliday(session.Date, session.Day);
            }
            if (session != null)
            {
                string query = "IF NOT EXISTS (SELECT * FROM SessionTable WHERE Date=@Date AND Site=@Site AND Time=@Time) " +
                "INSERT INTO SessionTable (Date, Day, Site, Time, LOD, Holiday, Note, StaffCount, State) " +
                "VALUES (@Date, @Day, @Site, @Time, @LOD, @Holiday, @Note, @StaffCount, @State);";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        return conn.Execute(query, session);
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

        [HttpPut]
        [Route("Update")]
        public int Update()
        {
            Session session = new Session();
            using (StreamReader sr = new StreamReader(Request.Body))
            {
                session = JsonConvert.DeserializeObject<Session>(sr.ReadToEnd());
            }
            if (session != null)
            {
                string query = " UPDATE SessionTable" +
                    " SET Time=@Time, Site=@Site, LOD=@LOD WHERE Id=@Id;";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        return conn.Execute(query, session);
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
                string query = "DELETE FROM SessionTable WHERE Id=@Id;";
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

        //Method for checking if selected date is weekend/holiday
        public int CheckHoliday(string date, string day)
        {
            int holiday = 0;
            if (day.Equals("Saturday"))
            {
                holiday = 1;
            }
            else if (day.Equals("Sunday"))
            {
                holiday = 1;
            }
            else
            {
                foreach (Holiday sd in AdminController.GetHolidaysStatic())
                {
                    if (sd.Date.Equals(date))
                    {
                        holiday = 1;
                    }
                }
            }
            return holiday;
        }
    }
}
