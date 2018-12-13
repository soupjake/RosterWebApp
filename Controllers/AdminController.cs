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
    public class AdminController : Controller
    {
        [HttpGet]
        [Route("GetHolidays")]
        public List<Holiday> GetHolidays()
        {
            return GetHolidaysStatic();
        }

        public static List<Holiday> GetHolidaysStatic()
        {
            string query = "SELECT * FROM HolidayTable;";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    List<Holiday> holidays = conn.Query<Holiday>(query).ToList();
                    if(holidays.Count < 1)
                    {
                        holidays = new List<Holiday>();
                        holidays.Add(new Holiday
                        {
                            Name = "Christmas 2018",
                            Date = "2018-12-25"
                        });
                        holidays.Add(new Holiday
                        {
                            Name = "Boxing Day 2018",
                            Date = "2018-12-26"
                        });
                        holidays.Add(new Holiday
                        {
                            Name = "Christmas 2019",
                            Date = "2019-12-25"
                        });
                        holidays.Add(new Holiday
                        {
                            Name = "Boxing Day 2019",
                            Date = "2019-12-26"
                        });
                        string queryInitialise = "INSERT INTO HolidayTable (Name, Date) VALUES (@Name, @Date);";
                        conn.Execute(queryInitialise, holidays);
                    }
                    return holidays;
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                    return new List<Holiday>();
                }
            }
        }

        [HttpGet]
        [Route("GetHolidayById")]
        public Holiday GetHolidayById([FromQuery]int id)
        {
            string query = "SELECT * FROM HolidayTable WHERE Id=@Id;";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    return conn.QueryFirstOrDefault<Holiday>(query, new { id });
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                    return null;
                }
            }
        }

        [HttpPost]
        [Route("CreateHoliday")]
        public int CreateHoliday()
        {
            Holiday holiday = new Holiday();
            using (StreamReader sr = new StreamReader(Request.Body))
            {
                holiday = JsonConvert.DeserializeObject<Holiday>(sr.ReadToEnd());
            }
            if (holiday != null)
            {
                string query = "IF NOT EXISTS (SELECT * FROM HolidayTable WHERE Name=@Name AND Date=@Date) " +
                "INSERT INTO HolidayTable (Name, Date) VALUES (@Name, @Date);";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        return conn.Execute(query, holiday);
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
        [Route("UpdateHoliday")]
        public int UpdateHoliday()
        {
            Holiday holiday = new Holiday();
            using (StreamReader sr = new StreamReader(Request.Body))
            {
                holiday = JsonConvert.DeserializeObject<Holiday>(sr.ReadToEnd());
            }
            if (holiday != null)
            {
                string query = "UPDATE HolidayTable SET Name=@Name, Date=@Date WHERE Id=@Id;";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        return conn.Execute(query, holiday);
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
        [Route("DeleteHoliday")]
        public int DeleteSpecialDate([FromQuery]int id)
        {
            if (id > 0)
            {
                string query = "DELETE FROM HolidayTable WHERE Id=@Id;";
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
        [Route("GetSites")]
        public List<Site> GetSites()
        {
            return GetSitesStatic();
        }

        public static List<Site> GetSitesStatic()
        {
            string query = "SELECT * FROM SiteTable;";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    List<Site> sites = conn.Query<Site>(query).ToList();
                    if (sites.Count < 1)
                    {
                        sites = new List<Site>();
                        sites.Add(new Site
                        {
                            Name = "Site A",
                            Times = "08:00 - 16:00/09:00 - 17:00/10:00 - 18:00"
                        });
                        sites.Add(new Site
                        {
                            Name = "Site B",
                            Times = "09:00 - 17:00/10:00 - 18:00/11:00 - 19:00"
                        });
                        sites.Add(new Site
                        {
                            Name = "Site C",
                            Times = "07:00 - 15:00/08:00 - 16:00/09:00 - 17:00"
                        });
                        string queryInitialise = "INSERT INTO SiteTable (Name, Times) VALUES (@Name, @Times);";
                        conn.Execute(queryInitialise, sites);
                    }
                    return sites;
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                    return new List<Site>();
                }
            }
        }

        [HttpGet]
        [Route("GetSiteById")]
        public Site GetSiteById([FromQuery]int id)
        {
            string query = "SELECT * FROM SiteTable WHERE Id=@Id;";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    return conn.QueryFirstOrDefault<Site>(query, new { id });
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                    return null;
                }
            }
        }

        [HttpPost]
        [Route("CreateSite")]
        public int CreateSite()
        {
            Site site = new Site();
            using (StreamReader sr = new StreamReader(Request.Body))
            {
                site = JsonConvert.DeserializeObject<Site>(sr.ReadToEnd());
            }
            if (site != null)
            {
                string query = "IF NOT EXISTS (SELECT * FROM SiteTable WHERE Name=@Name) " +
                "INSERT INTO SiteTable (Name, Times) VALUES (@Name, @Times);";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        return conn.Execute(query, site);
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
        [Route("UpdateSite")]
        public int UpdateSite()
        {
            Site site = new Site();
            using (StreamReader sr = new StreamReader(Request.Body))
            {
                site = JsonConvert.DeserializeObject<Site>(sr.ReadToEnd());
            }
            if (site != null)
            {
                string query = "UPDATE SiteTable SET Name=@Name, Times=@Times WHERE Id=@Id;";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        return conn.Execute(query, site);
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
        [Route("DeleteSite")]
        public int DeleteSite([FromQuery]int id)
        {
            if (id > 0)
            {
                string query = "DELETE FROM SiteTable WHERE Id=@Id;";
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
    }
}
