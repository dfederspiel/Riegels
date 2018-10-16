using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;
using System.Web;
using System.Web.Hosting;

namespace Riegels.Controllers
{
    public class EventsController : ApiController
    {
        // GET api/values
        public Events Get()
        {
            return GetEvents();
        }

        private Events GetEvents()
        {
            string[] Scopes = { CalendarService.Scope.CalendarReadonly };
            string ApplicationName = "Google Calendar API .NET Quickstart";

            UserCredential credential;
            using (var stream =
                new FileStream(HostingEnvironment.MapPath("~/credentials.json"), FileMode.Open, FileAccess.Read))
            {
                string credPath = HostingEnvironment.MapPath("~/") + "token.json";
                credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    Scopes,
                    "user",
                    CancellationToken.None,
                    new FileDataStore(credPath, true)).Result;
            }
            
            var service = new CalendarService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = ApplicationName,
            });
            
            EventsResource.ListRequest request = service.Events.List("federnet.com_out8r72vgs8qacea81hahntmd0@group.calendar.google.com");
            request.TimeMin = DateTime.Now;
            request.ShowDeleted = false;
            request.SingleEvents = true;
            request.MaxResults = 10;
            request.OrderBy = EventsResource.ListRequest.OrderByEnum.StartTime;

            Events events = request.Execute();
            return events;
        }
    }
}
