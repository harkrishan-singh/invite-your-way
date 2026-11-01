/**
 * Both links render the same website, story, full itinerary, and venue list.
 * Only the hero and "so please join us" event details vary by URL.
 *
 * Dates, venue details, and photographs below contain sample values carried
 * over from the supplied project. Confirm them before sharing invitations.
 */
const weddingDateISO = "2026-11-13T10:00:00+05:30";
const receptionDateISO = "2026-11-15T18:00:00+05:30"; // Confirm the reception start time.

// These are two INDEPENDENT venue entries. Replace each name, address, link,
// photograph, and description when you have the confirmed venue information.
// At present the source project only supplied one sample venue and photograph.
const weddingMapsUrl =
  "https://www.google.com/maps/dir//DEVDAR+By+Nirvana,+Khanyara+Rd,+near+H.P.+University+Regional+Centre,+Dharamshala,+Sokani+Da+Kot,+Himachal+Pradesh+176218/@30.7593216,76.6345216,10z/data=!4m8!4m7!1m0!1m5!1m1!1s0x391b53d3f7d6e3f7:0xc63998dd11014848!2m2!1d76.3689738!2d32.206809?entry=ttu&g_ep=EgoyMDI2MTAyMC4wIKXMDSoASAFQAw%3D%3D";
const receptionMapsUrl =
  "https://www.google.com/maps/dir//Hotel+Dh,+6897%2BQC2,+Sudher,+Dharamshala,+Loharkar,+Himachal+Pradesh+176217/@30.7625984,76.6377984,10z/data=!4m8!4m7!1m0!1m5!1m1!1s0x391b50de5b3553f9:0xf740add93f821e42!2m2!1d76.313525!2d32.219395?entry=ttu&g_ep=EgoyMDI2MTAyMC4wIKXMDSoASAFQAw%3D%3D";

const weddingVenue = {
  id: "wedding",
  label: "Wedding Venue",
  name: "Devdar Resort",
  address: "Khanyara Road, Khaniara, Kangra, Himachal Pradesh (176218)",
  location: "Dharamshala",
  mapsUrl: weddingMapsUrl,
  photo: `${import.meta.env.BASE_URL}events/amanpreet-weds-megha/photos/Wedding1.jpg`,
  photo_2: `${import.meta.env.BASE_URL}events/amanpreet-weds-megha/photos/Wedding3.jpeg`,
  photoAlt: "Illustrated wedding venue exterior (sample image)",
  description:
    "A beautiful beginning, surrounded by love, blessings, and the warmth of our favorite people.\nJoin us as we celebrate our special day.",
};

const receptionVenue = {
  id: "reception",
  label: "Reception Venue",
  name: "Dhauladhar Heights",
  address: "6897+QC2, Sudher, Dharamshala, Loharkar, Himachal Pradesh (176217)",
  location: "Dharamshala",
  mapsUrl: receptionMapsUrl,
  photo: `${import.meta.env.BASE_URL}events/amanpreet-weds-megha/photos/Reception2.jpg`,
  photo_2: `${import.meta.env.BASE_URL}events/amanpreet-weds-megha/photos/Reception1.jpg`,
  photoAlt: "Illustrated reception venue exterior (sample image)",
  description:
    "An evening of love, laughter, music, and memories beneath the mountain skies.\nJoin us for a celebration to remember.",
};

// The same five-day itinerary appears on BOTH /wedding and /reception.
const sharedSchedule = [
  {
    id: "path",
    offset: -2,
    location: "At Our Residence",
    items: [
      { title: "Bhogh Shri Akhand Path", time: "11:00 AM" },
      { title: "Kirtan & Ardaas", time: "11:00 AM - 12:30 PM" },
      { title: "Guru Ka Langar", time: "12:30 PM - 4:00 PM" },
    ],
  },
  {
    id: "jago",
    offset: -1,
    location: "At Our Residence",
    items: [
      { title: "Jago", time: "6:00 PM" },
      { title: "Mehndi", time: "8:00 PM" },
    ],
  },
  {
    id: "wedding",
    offset: 0,
    note: "(Wedding Day)",
    location: "Devdar Resort, Dharamshala",
    items: [
      { title: "Departure of Barat", time: "9:00 AM" },
      { title: "Varmala Ceremony", time: "10:15 AM" },
      { title: "Anand Karaj at the Gurudwara", time: "12:15 PM" },
      { title: "Wedding Pheras", time: "2:30 PM" },
      { title: "Vadu Pravesh", time: "6:00 PM" },
    ],
  },
  {
    id: "dham",
    offset: 1,
    location: "Shri Gurudwara Singh Sabha, Yol",
    items: [{ title: "Traditional Wedding Dham", time: "12:00 PM" }],
  },
  {
    id: "reception",
    dateISO: receptionDateISO,
    note: "(Reception)",
    location: "Dhauladhar Heights, Dharamshala",
    items: [{ title: "Wedding Reception", time: "6:30 PM" }],
  },
];

const sharedSections = {
  scheduleTitle: "The Celebrations",
  scheduleBaseDateISO: weddingDateISO,
  schedule: sharedSchedule,
  venues: [weddingVenue, receptionVenue], // Wedding venue first, reception venue second.
  letter:
    "We can't wait to celebrate together and share an unforgettable time with you.",
};

export const wedding = {
  firstName: "Amanpreet",
  secondName: "Megha",
  title: "Amanpreet weds Megha",
  names: "Amanpreet & Megha",
  spokenNames: "Amanpreet and Megha",
  monogram: "AM",
  contactEmail: "harkrishanyol@gmail.com",

  events: {
    wedding: {
      ...sharedSections,
      label: "Wedding & Reception",
      heroLabel: "Wedding & Reception",
      dateISO: weddingDateISO,
      receptionDateISO,
      countdownLabel: "wedding",
      venue: weddingVenue, // Hero + later "so please join us" venue.
    },
    reception: {
      ...sharedSections,
      schedule: sharedSchedule.filter(
        (day) => day.id === "dham" || day.id === "reception",
      ),
      label: "Reception",
      heroLabel: "Reception Celebration",
      dateISO: receptionDateISO,
      countdownLabel: "reception",
      venue: receptionVenue, // Hero + later "so please join us" venue.
    },
  },
};

// Format calendar dates in UTC to keep the calendar day the same worldwide.
// Countdown uses the actual ISO timezone offset.
function calendarDate(iso) {
  return new Date(`${iso.slice(0, 10)}T12:00:00Z`);
}

function formatDate(iso, options) {
  return new Intl.DateTimeFormat("en-GB", {
    ...options,
    timeZone: "UTC",
  }).format(calendarDate(iso));
}

function shiftDate(iso, offset) {
  const date = calendarDate(iso);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

/** One display-ready event config selected by the current URL. */
export function getInvitation(variant = "wedding") {
  const key = variant === "reception" ? "reception" : "wedding";
  const event = wedding.events[key];
  const dates = [
    event.dateISO,
    ...(event.receptionDateISO ? [event.receptionDateISO] : []),
  ];
  const dateLine = dates
    .map((iso) => formatDate(iso, { day: "numeric", month: "long" }))
    .join(" & ");
  const sameMonth =
    dates.length === 2 && dates[0].slice(0, 7) === dates[1].slice(0, 7);
  const invitationDate = sameMonth
    ? `${formatDate(dates[0], { day: "numeric" })} & ${formatDate(dates[1], { day: "numeric", month: "long", year: "numeric" })}`
    : dates
        .map((iso) =>
          formatDate(iso, { day: "numeric", month: "long", year: "numeric" }),
        )
        .join(" & ");

  return {
    ...event,
    variant: key,
    year: formatDate(event.dateISO, { year: "numeric" }),
    dateLine,
    dateLabel: invitationDate.toLowerCase(),
    joinDateLabel:
      key === "wedding"
        ? formatDate(event.dateISO, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : invitationDate.toLowerCase(),
    footerDate: invitationDate,
    footerLabel: event.label,
    footerLocation: weddingVenue.location,
    schedule: event.schedule.map((day) => ({
      ...day,
      title: formatDate(
        day.dateISO || shiftDate(event.scheduleBaseDateISO, day.offset),
        {
          weekday: "long",
          day: "numeric",
          month: "long",
        },
      ),
    })),
    menuLinks: [
      { id: "top", label: "The Invitation" },
      { id: "letter", label: "A Note" },
      { id: "weekend", label: event.scheduleTitle },
      { id: "place", label: "The Venue" },
      { id: "second-invitation", label: "Our Story" },
    ],
  };
}
