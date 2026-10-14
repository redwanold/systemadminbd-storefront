export type ReviewSeed = {
  author: string;
  handle: string;
  rating: number;
  title: string;
  body: string;
  daysAgo: number;
};

export const reviewPool: ReviewSeed[] = [
  {
    author: "Rafiul H.",
    handle: "@nullbyte_rafi",
    rating: 5,
    title: "Packed like a camera lens",
    body: "Arrived in Dhaka in four days, foam-cut case, serial matched the invoice. Firmware flashed clean on the first try and the docs are genuinely readable. I have bought gear twice this price that felt half as finished.",
    daysAgo: 6,
  },
  {
    author: "Priya N.",
    handle: "@priya.sec",
    rating: 5,
    title: "Finally, documentation written by humans",
    body: "I am eight months into learning this stuff and I usually drown in forum threads. The included booklet assumed I knew nothing and never made me feel stupid about it. Got a working setup in one evening.",
    daysAgo: 13,
  },
  {
    author: "Marcus O.",
    handle: "@m_odell",
    rating: 4,
    title: "Great hardware, mediocre bag",
    body: "No complaints on the device itself, it has been rock solid across three client engagements. The carry sleeve is thin though, I replaced it immediately. Four stars only for that.",
    daysAgo: 21,
  },
  {
    author: "Soo-Jin K.",
    handle: "@sj_packets",
    rating: 5,
    title: "Replaced a rack with this",
    body: "We were running this workload on a noisy 2U box under the desk. This sits on the shelf, runs silent, and finished the same sweep eleven minutes faster. My team is quietly delighted.",
    daysAgo: 29,
  },
  {
    author: "Tomas B.",
    handle: "@tbrandt",
    rating: 5,
    title: "The scope gating is the selling point",
    body: "I was sceptical about hardware that refuses to run until you register what you own, but it has already saved a junior from an embarrassing mistake on a shared range. Keep it.",
    daysAgo: 34,
  },
  {
    author: "Amara D.",
    handle: "@amaradoes",
    rating: 4,
    title: "Solid, battery is honest",
    body: "Rated runtime is basically what I get in the field, which is rare. Took a star because the status LED is bright enough to read by, but you can dim it in firmware once you find the setting.",
    daysAgo: 40,
  },
  {
    author: "Victor L.",
    handle: "@vl_ops",
    rating: 5,
    title: "Build quality is unreasonable",
    body: "Machined shell, flush ports, no creak anywhere. Dropped it off a tailgate onto gravel and it did not care. Systemadminbd clearly spends money where it shows up later.",
    daysAgo: 48,
  },
  {
    author: "Hasan M.",
    handle: "@hasan.m",
    rating: 3,
    title: "Good, but the learning curve is real",
    body: "This is not a plug-and-play toy and the listing is honest about that. I needed a weekend and two rewatches of the setup video. Once it clicked it has been excellent, but go in expecting homework.",
    daysAgo: 55,
  },
  {
    author: "Elena V.",
    handle: "@elena_v",
    rating: 5,
    title: "Support answered at 2am",
    body: "Hit a weird firmware state on a Sunday night, emailed with low expectations, got a real human with a real fix in under an hour. That alone earns the repeat business.",
    daysAgo: 62,
  },
  {
    author: "Daniel Q.",
    handle: "@dq_redteam",
    rating: 5,
    title: "Client demo gold",
    body: "Used this in a board-level walkthrough. Watching the room go quiet when the dashboard lit up did more for our remediation budget than forty pages of report ever did.",
    daysAgo: 70,
  },
  {
    author: "Nadia F.",
    handle: "@nadiaf",
    rating: 4,
    title: "Exactly as described",
    body: "No surprises, good or bad, which is the highest compliment I give to tools. Shipping was a day late and that is the only note in my book.",
    daysAgo: 78,
  },
  {
    author: "Owen P.",
    handle: "@owen.pcap",
    rating: 5,
    title: "Worth the upgrade from my old rig",
    body: "Side by side with my three-year-old setup it is not close. Faster, quieter, and the export formats actually import into our reporting pipeline without a pile of glue scripts.",
    daysAgo: 86,
  },
];

export const featuredReviews: Record<string, ReviewSeed[]> = {
  "portsniffer-mk-iv": [
    {
      author: "Imran S.",
      handle: "@imran_sweeps",
      rating: 5,
      title: "Watched a /16 bloom in ninety seconds",
      body: "The host-bloom view is not a gimmick. Being able to see discovery happen instead of staring at a progress bar changed how I triage a range. Three engagements in, zero crashes, battery still does a full day.",
      daysAgo: 4,
    },
    {
      author: "Clara Z.",
      handle: "@czed",
      rating: 5,
      title: "The firmware being readable actually matters",
      body: "I read the whole scanning module before I let it onto a client network. It is clean, commented, and matches the published hashes. That is the entire reason I bought it over the competition.",
      daysAgo: 17,
    },
    {
      author: "Bashir A.",
      handle: "@bashir.a",
      rating: 4,
      title: "Hot-swap cells are the killer feature",
      body: "Swapping a cell without dropping the scan saved an entire afternoon on a warehouse job. Minus one star because the spare cells cost more than they should.",
      daysAgo: 31,
    },
  ],
  "badusb-phantom-key": [
    {
      author: "Jules R.",
      handle: "@julesr",
      rating: 5,
      title: "My first real aha moment",
      body: "I am very much the target audience for this shop and this was the thing that made the theory feel real. The arming switch meant I never once worried I would trigger it in my bag.",
      daysAgo: 9,
    },
    {
      author: "Farhana K.",
      handle: "@farhana_k",
      rating: 5,
      title: "Used it in a staff awareness session",
      body: "Ran a consented demo for forty colleagues. The cookbook had a ready-made harmless payload that just opens a notepad with a warning. Nobody leaves USB sticks lying around on that floor anymore.",
      daysAgo: 25,
    },
    {
      author: "Dmitri K.",
      handle: "@dk_hid",
      rating: 4,
      title: "Titanium shell is overkill and I love it",
      body: "Feels like a watch part. Script store is a bit fiddly to manage from Linux but the web flasher works fine once you get past the browser permissions prompt.",
      daysAgo: 44,
    },
  ],
  "script-kiddie-starter-crate": [
    {
      author: "Tanvir R.",
      handle: "@tanvir.learns",
      rating: 5,
      title: "Day 1 to first flag in nineteen days",
      body: "I followed the syllabus exactly. Day 19 I popped my first target on the included lab image and shouted loud enough to wake my flatmate. The crate is the best money I have spent on this hobby.",
      daysAgo: 11,
    },
    {
      author: "Megan W.",
      handle: "@meganw",
      rating: 5,
      title: "Bought it for my son, stole it back",
      body: "He is fifteen and he is now better at this than I am. The syllabus is paced beautifully and the Discord is unexpectedly kind to beginners.",
      daysAgo: 23,
    },
    {
      author: "Sami B.",
      handle: "@sami_b",
      rating: 4,
      title: "Wish the SBC was a tier faster",
      body: "The content is excellent and worth the price on its own. The board is adequate rather than generous, so the later modules do chug a little. Still recommending it to everyone who asks.",
      daysAgo: 37,
    },
  ],
};
