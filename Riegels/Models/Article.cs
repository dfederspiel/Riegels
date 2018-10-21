// To parse this JSON data, add NuGet 'Newtonsoft.Json' then do:
//
//    using QuickType;
//
//    var article = Article.FromJson(jsonString);

namespace QuickType
{
    using System;
    using System.Collections.Generic;

    using System.Globalization;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    public partial class Article
    {
        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("date")]
        public DateTimeOffset Date { get; set; }

        [JsonProperty("authorId")]
        public long AuthorId { get; set; }

        [JsonProperty("body")]
        public string Body { get; set; }

        [JsonProperty("author")]
        public Author Author { get; set; }
    }

    public partial class Author
    {
        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("firstName")]
        public string FirstName { get; set; }

        [JsonProperty("lastName")]
        public string LastName { get; set; }

        [JsonProperty("bio")]
        public string Bio { get; set; }

        [JsonProperty("website")]
        public Uri Website { get; set; }
    }

    public partial class Article
    {
        public static Article[] FromJson(string json) => JsonConvert.DeserializeObject<Article[]>(json, QuickType.Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this Article[] self) => JsonConvert.SerializeObject(self, QuickType.Converter.Settings);
    }

    internal static class Converter
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            Converters = {
                new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
            },
        };
    }
}
