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
        [JsonProperty("accessRole")]
        public string AccessRole { get; set; }

        [JsonProperty("defaultReminders")]
        public object[] DefaultReminders { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("etag")]
        public string Etag { get; set; }

        [JsonProperty("items")]
        public Item[] Items { get; set; }

        [JsonProperty("kind")]
        public string Kind { get; set; }

        [JsonProperty("nextPageToken")]
        public object NextPageToken { get; set; }

        [JsonProperty("nextSyncToken")]
        public object NextSyncToken { get; set; }

        [JsonProperty("summary")]
        public string Summary { get; set; }

        [JsonProperty("timeZone")]
        public string TimeZone { get; set; }

        [JsonProperty("updated")]
        public DateTimeOffset Updated { get; set; }
    }

    public partial class Item
    {
        [JsonProperty("anyoneCanAddSelf")]
        public object AnyoneCanAddSelf { get; set; }

        [JsonProperty("attachments")]
        public Attachment[] Attachments { get; set; }

        [JsonProperty("attendees")]
        public object Attendees { get; set; }

        [JsonProperty("attendeesOmitted")]
        public object AttendeesOmitted { get; set; }

        [JsonProperty("colorId")]
        public object ColorId { get; set; }

        [JsonProperty("conferenceData")]
        public object ConferenceData { get; set; }

        [JsonProperty("created")]
        public DateTimeOffset Created { get; set; }

        [JsonProperty("creator")]
        public Creator Creator { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("end")]
        public End End { get; set; }

        [JsonProperty("endTimeUnspecified")]
        public object EndTimeUnspecified { get; set; }

        [JsonProperty("etag")]
        public string Etag { get; set; }

        [JsonProperty("extendedProperties")]
        public ExtendedProperties ExtendedProperties { get; set; }

        [JsonProperty("gadget")]
        public object Gadget { get; set; }

        [JsonProperty("guestsCanInviteOthers")]
        public object GuestsCanInviteOthers { get; set; }

        [JsonProperty("guestsCanModify")]
        public object GuestsCanModify { get; set; }

        [JsonProperty("guestsCanSeeOtherGuests")]
        public object GuestsCanSeeOtherGuests { get; set; }

        [JsonProperty("hangoutLink")]
        public object HangoutLink { get; set; }

        [JsonProperty("htmlLink")]
        public Uri HtmlLink { get; set; }

        [JsonProperty("iCalUID")]
        public string ICalUid { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("kind")]
        public string Kind { get; set; }

        [JsonProperty("location")]
        public string Location { get; set; }

        [JsonProperty("locked")]
        public object Locked { get; set; }

        [JsonProperty("organizer")]
        public Creator Organizer { get; set; }

        [JsonProperty("originalStartTime")]
        public object OriginalStartTime { get; set; }

        [JsonProperty("privateCopy")]
        public object PrivateCopy { get; set; }

        [JsonProperty("recurrence")]
        public object Recurrence { get; set; }

        [JsonProperty("recurringEventId")]
        public object RecurringEventId { get; set; }

        [JsonProperty("reminders")]
        public Reminders Reminders { get; set; }

        [JsonProperty("sequence")]
        public long Sequence { get; set; }

        [JsonProperty("source")]
        public object Source { get; set; }

        [JsonProperty("start")]
        public End Start { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("summary")]
        public string Summary { get; set; }

        [JsonProperty("transparency")]
        public object Transparency { get; set; }

        [JsonProperty("updated")]
        public DateTimeOffset Updated { get; set; }

        [JsonProperty("visibility")]
        public object Visibility { get; set; }
    }

    public partial class Attachment
    {
        [JsonProperty("fileId")]
        public string FileId { get; set; }

        [JsonProperty("fileUrl")]
        public Uri FileUrl { get; set; }

        [JsonProperty("iconLink")]
        public Uri IconLink { get; set; }

        [JsonProperty("mimeType")]
        public string MimeType { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("ETag")]
        public object ETag { get; set; }
    }

    public partial class Creator
    {
        [JsonProperty("displayName")]
        public string DisplayName { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("id")]
        public object Id { get; set; }

        [JsonProperty("self")]
        public bool? Self { get; set; }
    }

    public partial class End
    {
        [JsonProperty("date")]
        public object Date { get; set; }

        [JsonProperty("dateTime")]
        public DateTimeOffset DateTime { get; set; }

        [JsonProperty("timeZone")]
        public object TimeZone { get; set; }

        [JsonProperty("ETag")]
        public object ETag { get; set; }
    }

    public partial class ExtendedProperties
    {
        [JsonProperty("private")]
        public Private Private { get; set; }

        [JsonProperty("shared")]
        public object Shared { get; set; }
    }

    public partial class Private
    {
        [JsonProperty("everyoneDeclinedDismissed")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long EveryoneDeclinedDismissed { get; set; }
    }

    public partial class Reminders
    {
        [JsonProperty("overrides")]
        public object Overrides { get; set; }

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
