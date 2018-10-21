// To parse this JSON data, add NuGet 'Newtonsoft.Json' then do:
//
//    using QuickType;
//
//    var event = Event.FromJson(jsonString);

namespace QuickType
{
    using System;
    using System.Collections.Generic;

    using System.Globalization;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    public partial class Event
    {
        [JsonProperty("kind")]
        public string Kind { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("items")]
        public Item[] Items { get; set; }

        [JsonProperty("updated")]
        public DateTimeOffset Updated { get; set; }

        [JsonProperty("summary")]
        public string Summary { get; set; }

        [JsonProperty("etag")]
        public string Etag { get; set; }

        [JsonProperty("nextSyncToken")]
        public string NextSyncToken { get; set; }

        [JsonProperty("timeZone")]
        public string TimeZone { get; set; }

        [JsonProperty("accessRole")]
        public string AccessRole { get; set; }
    }

    public partial class Item
    {
        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("kind")]
        public string Kind { get; set; }

        [JsonProperty("end")]
        public End End { get; set; }

        [JsonProperty("created")]
        public DateTimeOffset Created { get; set; }

        [JsonProperty("iCalUID")]
        public string ICalUid { get; set; }

        [JsonProperty("reminders")]
        public Reminders Reminders { get; set; }

        [JsonProperty("extendedProperties")]
        public ExtendedProperties ExtendedProperties { get; set; }

        [JsonProperty("htmlLink")]
        public Uri HtmlLink { get; set; }

        [JsonProperty("sequence")]
        public long Sequence { get; set; }

        [JsonProperty("updated")]
        public DateTimeOffset Updated { get; set; }

        [JsonProperty("summary")]
        public string Summary { get; set; }

        [JsonProperty("start")]
        public End Start { get; set; }

        [JsonProperty("etag")]
        public string Etag { get; set; }

        [JsonProperty("organizer")]
        public Organizer Organizer { get; set; }

        [JsonProperty("creator")]
        public Creator Creator { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }
    }

    public partial class Creator
    {
        [JsonProperty("displayName")]
        public string DisplayName { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }
    }

    public partial class End
    {
        [JsonProperty("dateTime")]
        public DateTimeOffset DateTime { get; set; }
    }

    public partial class ExtendedProperties
    {
        [JsonProperty("private")]
        public Private Private { get; set; }
    }

    public partial class Private
    {
        [JsonProperty("everyoneDeclinedDismissed")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long EveryoneDeclinedDismissed { get; set; }
    }

    public partial class Organizer
    {
        [JsonProperty("self")]
        public bool Self { get; set; }

        [JsonProperty("displayName")]
        public string DisplayName { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }
    }

    public partial class Reminders
    {
        [JsonProperty("useDefault")]
        public bool UseDefault { get; set; }
    }

    public partial class Event
    {
        public static Event FromJson(string json) => JsonConvert.DeserializeObject<Event>(json, QuickType.Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this Event self) => JsonConvert.SerializeObject(self, QuickType.Converter.Settings);
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

    internal class ParseStringConverter : JsonConverter
    {
        public override bool CanConvert(Type t) => t == typeof(long) || t == typeof(long?);

        public override object ReadJson(JsonReader reader, Type t, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null) return null;
            var value = serializer.Deserialize<string>(reader);
            long l;
            if (Int64.TryParse(value, out l))
            {
                return l;
            }
            throw new Exception("Cannot unmarshal type long");
        }

        public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
        {
            if (untypedValue == null)
            {
                serializer.Serialize(writer, null);
                return;
            }
            var value = (long)untypedValue;
            serializer.Serialize(writer, value.ToString());
            return;
        }

        public static readonly ParseStringConverter Singleton = new ParseStringConverter();
    }
}
