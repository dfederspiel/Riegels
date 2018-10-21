using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using QuickType;

namespace Riegels.Controllers
{
    public class ArticlesController : ApiController
    {
        public List<Article> Get()
        {
            return new List<Article>()
            {
                new Article(),
                new Article(),
                new Article()
            };
        }
    }
}