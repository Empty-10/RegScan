// RegScan — content for the sample resource article.
// In production each article would come from MDX/CMS; the shape stays the same.

export const ARTICLE = {
  slug: "mot-advisory-explained",
  category: "MOT Advice",
  title: "What Does an MOT Advisory Mean and How Long Can You Ignore It?",
  dek: "Advisories aren’t fails — but they aren’t nothing either. Here’s what they mean, how seriously to take them, and when you can safely wait.",
  metaTitle: "What Does an MOT Advisory Mean? How Long Can You Ignore It?",
  metaDescription:
    "MOT advisories explained in plain English: what they mean, how serious they are, how long you can legally drive on one, and what happens if you ignore them.",
  author: "Jamie Fielding",
  authorInitials: "JF",
  published: "12 May 2026",
  publishedISO: "2026-05-12",
  updated: "30 May 2026",
  updatedISO: "2026-05-30",
  readTime: "6 min read",
};

export const SECTIONS = [
  {
    id: "what-is-an-advisory",
    h2: "What is an MOT advisory?",
    paras: [
      "An MOT advisory is a note from the tester flagging something on your vehicle that is starting to wear or develop a fault, but isn’t yet bad enough to fail the test. Think of it as an early warning rather than a verdict — your car still passed, and it’s legal to drive. Common advisories cover things like brake pads getting thin, tyres approaching the legal tread limit, slight play in a suspension joint, or minor corrosion that hasn’t reached a structural area.",
      "Advisories are recorded against your vehicle on the official DVSA record, which means anyone running an MOT history check — including future buyers — can see them. They’re written in plain testing language and usually include the location and severity, so “nearside front tyre worn close to the legal limit” tells you exactly what to look at. The point is to give you time to plan a repair before it becomes a failure.",
    ],
  },
  {
    id: "how-serious",
    h2: "How serious is an MOT advisory?",
    paras: [
      "It depends entirely on what the advisory is for. Some are genuinely minor — a slightly perished wiper blade or a small stone chip — and can sit for months without any real risk. Others, like brakes or tyres nearing their limits, are safety-critical and should be dealt with quickly even though they technically passed on the day. The tester’s wording is your best guide: phrases like “close to the limit” or “excessively worn” signal that the clock is ticking.",
      "A useful rule of thumb is to separate advisories into “monitor” and “act soon” buckets. Anything affecting braking, steering, tyres or structural integrity belongs in the second group. Cosmetic or comfort items can usually wait until your next service. If you’re ever unsure, a quick inspection at a garage costs little and removes the guesswork — most will take a look at a specific advisory for free.",
    ],
  },
  {
    id: "how-long-can-you-drive",
    h2: "How long can you drive on an MOT advisory?",
    paras: [
      "Legally, an advisory doesn’t carry a deadline. Your MOT certificate remains valid for the full 12 months regardless of how many advisories it lists, and you won’t be breaking any law simply by driving with one. There’s no fine attached to the advisory itself, and it won’t invalidate your certificate.",
      "The practical answer is different. A worn component keeps wearing, so the real question is how long until it becomes dangerous or fails the next test. Brakes and tyres can deteriorate within weeks of heavy use; corrosion and suspension wear tend to progress over months. The safest approach is to book the repair while it’s still cheap, rather than waiting for it to turn into a failure — or worse, a breakdown.",
    ],
  },
  {
    id: "what-happens-if-it-worsens",
    h2: "What happens if an advisory gets worse?",
    paras: [
      "If you ignore an advisory long enough, two things tend to happen. First, the repair gets more expensive — a worn pad left too long can damage the disc, turning a cheap job into a costly one. Second, the item is very likely to become a straight fail at your next MOT, which means you can’t legally drive the car until it’s fixed, sometimes at short notice.",
      "There’s also a safety and legal dimension. If a component covered by an advisory fails and contributes to an incident, you could be considered to have known about a defect and done nothing — which can affect insurance claims and liability. Tracking your advisories year on year, as RegScan does automatically, makes it easy to spot the ones that keep reappearing and budget for them before they escalate.",
    ],
  },
];

export const FAQS = [
  {
    q: "What is the difference between an advisory and a failure?",
    a: "A failure means your vehicle doesn’t meet the legal minimum standard and can’t be driven (except to a pre-booked repair or retest) until it’s fixed. An advisory means it passed, but the tester has noted something that will need attention before it becomes a failure. One stops you driving; the other is a heads-up.",
  },
  {
    q: "Can I drive with an MOT advisory?",
    a: "Yes. An advisory doesn’t affect the validity of your MOT certificate, so the vehicle remains road-legal for the full 12 months. That said, you’re still responsible for keeping the car roadworthy — if an advisory item deteriorates into a dangerous defect, driving on it could become an offence.",
  },
  {
    q: "Do advisories carry over to the next MOT?",
    a: "Advisories don’t automatically transfer, but they stay on your vehicle’s permanent MOT history record. At the next test the examiner will re-assess each item from scratch — so a previous advisory may clear, stay as an advisory, or become a failure depending on its condition on the day.",
  },
  {
    q: "How do I check my MOT advisories online?",
    a: "Enter your registration into RegScan and you’ll see your full MOT history, including every advisory and failure recorded against the vehicle, pulled directly from the official DVSA data. It’s free to check as often as you like.",
  },
  {
    q: "Will an advisory affect my insurance?",
    a: "An advisory on its own won’t change your premium — insurers don’t routinely price on them. However, if you knowingly leave a safety-related advisory unrepaired and it contributes to an accident, an insurer could question whether the vehicle was roadworthy, which may affect a claim.",
  },
];

export const RELATED = [
  {
    tag: "MOT Advice",
    title: "How to Read Your Full MOT History Like a Mechanic",
    desc: "Spot the patterns that reveal a well-kept car — or a problem in the making.",
    href: "#",
  },
  {
    tag: "Buying a Car",
    title: "Using MOT Data to Avoid a Bad Used Car",
    desc: "Mileage gaps, repeat fails and clocked odometers — what to watch for.",
    href: "#",
  },
  {
    tag: "Tax & VED",
    title: "Car Tax Explained: Bands, SORN and Renewal Dates",
    desc: "A plain-English guide to how UK vehicle tax actually works in 2026.",
    href: "#",
  },
];
