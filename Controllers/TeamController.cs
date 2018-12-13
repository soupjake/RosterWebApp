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
    public class TeamController : Controller
    {
        [HttpGet]
        [Route("GetTeams")]
        public List<Team> GetTeams()
        {
            string query = "SELECT * FROM TeamTable;";
            string queryList = "SELECT * From TeamMemberTable WHERE TeamId=@Id";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    List<Team> temp = conn.Query<Team>(query).ToList();
                    foreach (Team t in temp)
                    {
                        t.Members = conn.Query<TeamMember>(queryList, new { t.Id }).ToList();
                    }
                    return temp;
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                    return new List<Team>();
                }
            }
        }

        [HttpGet]
        [Route("GetTeamSites")]
        public List<TeamSite> GetTeamSites([FromQuery]int id, [FromQuery]string startdate, [FromQuery]string enddate)
        {
            string query = "SELECT SessionSite FROM SessionEmployeeTable WHERE EmployeeId=@EmployeeId AND SessionDate=@Date;";
            Team team = GetByIdStatic(id);
            List<string> dates = new List<string>();
            List<TeamSite> teamsites = new List<TeamSite>(); 
            for (DateTime dt = DateTime.Parse(startdate); dt <= DateTime.Parse(enddate); dt = dt.AddDays(1))
            {
                dates.Add(dt.ToString("yyyy-MM-dd"));
            }
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    foreach(string date in dates)
                    {
                        TeamSite teamsite = new TeamSite
                        {
                            Date = date,
                            Day = DateTime.Parse(date).DayOfWeek.ToString(),
                            Members = new List<SessionEmployee>()
                        };
                        foreach (TeamMember member in team.Members)
                        {
                            SessionEmployee employee = new SessionEmployee();
                            employee.EmployeeName = member.EmployeeName;
                            List<string> sites = new List<string>();
                            sites = conn.Query<string>(query, new { date, member.EmployeeId }).ToList();
                            if (sites.Count < 1)
                            {
                                employee.SessionSite = AbsenceController.GetEmployeeStatus(member.EmployeeId, date);

                            }
                            else if (sites.Count > 0)
                            {
                                employee.SessionSite = string.Join(", ", sites);
                            }
                            teamsite.Members.Add(employee);
                        }
                        teamsites.Add(teamsite);
                    }
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                }
            }
            return teamsites;
        }

        [HttpPost]
        [Route("Create")]
        public int Create()
        {
            Team team = new Team();
            using (StreamReader sr = new StreamReader(Request.Body))
            {
                team = JsonConvert.DeserializeObject<Team>(sr.ReadToEnd());
            }
            if (team != null)
            {
                string query = "IF NOT EXISTS (SELECT * FROM TeamTable WHERE Name=@Name) " +
                 "INSERT INTO TeamTable (Name) VALUES (@Name);";
                string queryId = "SELECT Id FROM TeamTable WHERE Name=@Name";
                string queryName = "SELECT Name FROM EmployeeTable WHERE Id=@Id;";
                string queryList = "INSERT INTO TeamMemberTable (TeamId, EmployeeId, EmployeeName, EmployeeRole) " +
                    "VALUES(@TeamId, @EmployeeId, @EmployeeName, @EmployeeRole)";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        conn.Execute(query, team);
                        team.Id = conn.QueryFirstOrDefault<int>(queryId, new { team.Name });
                        foreach (TeamMember m in team.Members)
                        {
                            m.TeamId = team.Id;
                            m.EmployeeName = conn.QueryFirstOrDefault<string>(queryName, new { Id = m.EmployeeId });
                        }
                        return conn.Execute(queryList, team.Members);
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
        public Team GetById([FromQuery]int id)
        {
            return GetByIdStatic(id);
        }

        public static Team GetByIdStatic(int id)
        {
            string query = "SELECT * FROM TeamTable WHERE Id=@Id;";
            string queryList = "SELECT * FROM TeamMemberTable WHERE TeamId=@Id;";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    Team temp = conn.QueryFirstOrDefault<Team>(query, new { id });
                    temp.Members = conn.Query<TeamMember>(queryList, new { id }).ToList();
                    return temp;
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                    return null;
                }
            }
        }

        [HttpGet]
        [Route("GetTeamName")]
        [Produces("application/json")]
        public string GetTeamName([FromQuery]int id)
        {
            string query = "SELECT Name FROM TeamTable WHERE Id=@Id;";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    return conn.QueryFirstOrDefault<string>(query, new { id });
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
            Team team = new Team();
            using (StreamReader sr = new StreamReader(Request.Body))
            {
                team = JsonConvert.DeserializeObject<Team>(sr.ReadToEnd());
            }
            if (team != null)
            {
                string query = "DELETE From TeamMemberTable WHERE TeamId=@Id;";
                string queryId = "SELECT Id FROM TeamTable WHERE Name=@Name";
                string queryName = "SELECT Name FROM EmployeeTable WHERE Id=@Id;";
                string queryList = "INSERT INTO TeamMemberTable (TeamId, EmployeeId, EmployeeName, EmployeeRole) " +
                    "VALUES(@TeamId, @EmployeeId, @EmployeeName, @EmployeeRole)";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        conn.Execute(query, new { team.Id });
                        team.Id = conn.QueryFirstOrDefault<int>(queryId, new { team.Name });
                        foreach (TeamMember m in team.Members)
                        {
                            m.TeamId = team.Id;
                            m.EmployeeName = conn.QueryFirstOrDefault<string>(queryName, new { Id = m.EmployeeId });
                        }
                        return conn.Execute(queryList, team.Members);
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
                string query = "DELETE FROM TeamTable WHERE Id=@Id;";
                string queryList = "DELETE FROM TeamMemberTable WHERE TeamId=@Id";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        conn.Execute(query, new { id });
                        return conn.Execute(queryList, new { id });
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
    }
}
