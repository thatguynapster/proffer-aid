/**
 * Content recovered from the old profferaid.org (Internet Archive, Feb 2024).
 * Provenance and cautions: docs/salvaged-content.md. Raw source text:
 * docs/salvage/pages/.
 *
 * Copy has been lightly edited for typos and grammar — the source is riddled
 * with them ("lifes", "rquired", "geniunely", "examplaring") and the PRD calls
 * for an editing pass rather than a straight port. Meaning is unchanged.
 * Everything here still needs PAIF's confirmation before launch; the seed
 * prints a checklist of what to verify.
 */

import { doc, h, p, ul } from "./lexical";

export const siteSettings = {
	orgName: "Proffer Aid International Foundation",
	// Source reads "Racing to save lifes" — typo in the original.
	tagline: "Racing to save lives",
	vision: "A world in which health care reaches everyone, everywhere.",
	mission:
		"To make the last mile the most important in health care delivery: creating, showing and sharing the solutions for achieving truly equitable health care.",

	impactCounters: [
		// Cumulative — can only have grown since, so safe to publish as a floor.
		{ label: "People reached", value: 1500, asOf: "" },
		// Point-in-time. Left without an "as of" qualifier deliberately: inventing
		// a date would be worse than omitting one. Confirm with PAIF (PRD §2.1).
		{ label: "Members worldwide", value: 400, asOf: "" },
		{ label: "Active medical practitioners", value: 50, asOf: "" }
	],

	offices: [
		{
			name: "Italian headquarters",
			addressLines:
				"Via Persereano 1/6, loc. Merlana\n33050 Trivignano Udinese (UD)\nItaly",
			phone: "+39 347 580 9685",
			hours: "8:00-18:30 Mon-Fri, 9:00-14:00 Sat-Sun",
			mapUrl: ""
		},
		{
			name: "Ghana office",
			addressLines: "Legon, Accra\nPO Box LG 1126\nGhana",
			phone: "+233 244 098 345",
			hours: "8:00-18:30 Mon-Fri, 9:00-14:00 Sat-Sun",
			mapUrl: ""
		}
	],

	notificationEmail: "info@profferaid.com",
	// Stays off until the Ghanaian entity's Paystack account is verified (PRD §10).
	donationsEnabled: false
};

export const teamMembers = [
	{
		name: "Kofi Bonsu",
		role: "Founder & Leader",
		order: 1,
		photo: null, // Not recovered — needs a photo or an initials avatar.
		bio: "Founder and pioneer president of Proffer Aid International Foundation, and president of the Ghana Nationals Association in Udine, Italy. Kofi Bonsu has broken barriers in immigration advocacy that seemed unimaginable years ago, providing leadership for his community and setting the pace for others to follow."
	},
	{
		name: "Dr. Romano Paduano",
		role: "Chief Medical Consultant",
		order: 2,
		photo: "paduano-foto.jpg",
		bio: "Professor of family medicine at the University of Udine, Italy, and a consultant specialist in nephrology with the Italian national health ministry. An expert in continuing medical education, and a veteran general practitioner and trainer of junior doctors, Dr. Paduano brings the depth of clinical experience the foundation's work demands."
	},
	{
		name: "Dr. Peter Bossman",
		role: "Medical Consultant",
		order: 3,
		photo: "Bossman1.jpg",
		bio: "The first mayor of African descent in Europe, elected in Piran, Slovenia, and a practising medical doctor. Dr. Bossman brings both clinical judgement and public leadership to the foundation, alongside a long record of achievement for Africans in the diaspora."
	},
	{
		name: "Rev. George Kwadwo Asomaning",
		role: "Reverend",
		order: 4,
		photo: null, // Not recovered.
		bio: "A minister with the Church of Pentecost in Italy, well versed in conflict resolution and pastoral care. He brings gracious and visionary leadership to the foundation's work."
	},
	{
		name: "Daniel Forson",
		role: "Secretary",
		order: 5,
		photo: "daniel-forson.jpg",
		bio: "An entrepreneur whose first working experience, at a hospital in Accra, exposed him to the reality of how ordinary Ghanaians experience health care. That led to a lasting commitment to improving the quality of medical services in his country."
	},
	{
		name: "Dr. Luca Catarossi",
		role: "Immigration Expert",
		order: 6,
		photo: "luca-foto.jpg",
		bio: "An expert in immigration, orientation and training, with years of experience across various government offices. He runs an immigration agency for foreign nationals in Udine and serves as technical consultant to the Ghana Nationals Association there."
	}
];

export const pages = [
	{
		slug: "about",
		title: "About us",
		_status: "published" as const,
		body: doc(
			h("h2", "Our story"),
			p(
				"Proffer Aid International Foundation is an international non-governmental organisation, established by a group of professionals. The founder, Kofi Bonsu, is a Ghanaian based in Italy who formed the organisation to reach people in the rural areas of sub-Saharan Africa with the health care services they need. It was formed with the support of his fellow professionals, to race in delivering vital health care to remote communities across Africa."
			),
			h("h2", "Where we operate"),
			p(
				"The PAIF team operates principally in Africa, and aims to establish branches across several regions and continents. The foundation currently has its headquarters in Europe and an operational branch in Ghana."
			),
			h("h2", "Our vision"),
			p("A world in which health care reaches everyone, everywhere."),
			h("h2", "Our mission"),
			p(
				"To make the last mile the most important in health care delivery: creating, showing and sharing the solutions for achieving truly equitable health care."
			)
		)
	},

	{
		slug: "what-we-do",
		title: "What we do",
		_status: "published" as const,
		body: doc(
			p(
				"Proffer Aid works to bridge the gap between health care services and the patients who need them. Across sub-Saharan Africa there are many ill-stricken people who, for a number of reasons, cannot access health care. PAIF works to reach those who appear invisible and voiceless, organising health events in rural areas where basic health services are acutely deficient, inefficient or simply unavailable."
			),
			p(
				"Our primary focus is women, children and the elderly. Our programmes are organised broadly, to reach everyone in need of health care."
			),
			h("h2", "In summary"),
			ul([
				"Advocating for better health care services in African countries where health services are acutely deficient.",
				"Partnering with professional health bodies, governmental and non-governmental organisations, and corporate institutions to upgrade health services in these countries.",
				"Establishing affordable and accessible health structures — primary health centres and local hospitals — in regions where these facilities are not present.",
				"Upgrading facilities that have been badly managed in existing primary health centres and local hospitals.",
				"Organising exchange programmes for health personnel, giving students and professionals the opportunity to improve the lives of the less privileged through better health care."
			])
		)
	},

	{
		slug: "get-involved",
		title: "Get involved",
		_status: "published" as const,
		body: doc(
			p(
				"There are several ways to work with Proffer Aid — as a member, as a volunteer on a specific project, or as a partner organisation. The questions below cover most of what people ask before getting in touch."
			),
			h("h2", "Frequently asked questions"),
			h("h3", "Who is allowed to be a member of PAIF?"),
			p(
				"Any member of the public without criminal convictions can become a member, irrespective of race, religion, professional status or location. PAIF also allows membership to minors from the age of 14, with the express consent of a parent, guardian or other legal authority."
			),
			h("h3", "What projects does PAIF undertake?"),
			p(
				"Our main areas of focus are community health projects, health services education, and health services management."
			),
			h("h3", "What geographical areas do you work in?"),
			p(
				"PAIF currently focuses on rural African communities where basic health services are acutely deficient, inefficient or poorly managed."
			),
			h("h3", "Can someone without medical expertise become a member?"),
			p(
				"Yes. PAIF accepts members without any professional medical background. All that is needed is a genuine interest in contributing to community health and our other areas of work."
			),
			h("h3", "What role do volunteers play?"),
			p(
				"Volunteers may be members or non-members who join major projects as resource people in a range of capacities — doctors, pharmacists, nurses, drivers, technicians, managers and more. Volunteers give their professional expertise and services free of charge, and PAIF goes to considerable lengths to provide the best possible working environment in return."
			),
			h("h3", "When during the year do projects usually run?"),
			p(
				"Projects have no fixed schedule. Those involving international teams from Europe and elsewhere are most often planned towards the summer, when many of the professionals involved are off duty and available. All logistics are arranged by mutual agreement across the team."
			),
			h("h3", "How can I donate?"),
			p(
				"PAIF receives more than financial donations — medical equipment, pharmaceuticals and other relevant technical donations are highly encouraged. Donors are welcome to contact us to discuss where the need is greatest and how a donation can be made."
			),
			h("h3", "Can I donate equipment or materials rather than money?"),
			p(
				"Yes. Medical equipment, hospital beds and mattresses, pharmaceuticals and similar materials are coordinated to the communities where they are most needed, often in conjunction with the relevant government agencies. PAIF keeps detailed records of these donations and can provide a report to donors on request."
			),
			h("h3", "Can I join a project on my own schedule?"),
			p(
				"Yes. PAIF accepts professionals joining on their own terms, including arrival dates and accommodation arrangements. All medical working terms must fall within internationally recognised norms."
			),
			h("h3", "What medical expertise can take part?"),
			p(
				"All medical expertise is welcome. Areas of greatest need vary between projects depending on location."
			)
		)
	},

	{
		slug: "contact",
		title: "Contact",
		_status: "published" as const,
		body: doc(
			p(
				"Proffer Aid operates from two offices — our headquarters in Italy and our operational branch in Ghana. Reach out to either, or use the form below and we will direct your message to the right place."
			)
		)
	},

	{
		slug: "donate",
		title: "Donate",
		_status: "published" as const,
		body: doc(
			p(
				"Proffer Aid is a registered non-profit organisation, and our work depends on individual and corporate donations."
			),
			p(
				"We accept both financial and material donations. Medical equipment, hospital beds and mattresses, and pharmaceuticals are coordinated to the communities where they are most needed, often working alongside the relevant government agencies. We keep detailed records of these donations and can report back to donors on how they were used."
			),
			p(
				"If you would like to discuss where the need is greatest, or arrange a donation of equipment or materials, please get in touch."
			)
		)
	},

	{
		slug: "privacy",
		title: "Privacy policy",
		// Deliberately left as a DRAFT. A privacy policy makes binding legal
		// representations about how personal data is handled; inventing one and
		// publishing it would be worse than having none. This stub exists so the
		// route is reserved and the gap is visible (PRD §5, §11).
		_status: "draft" as const,
		body: doc(
			p(
				"This page is a placeholder and must be written before launch. It is deliberately unpublished."
			),
			p(
				"The site collects personal data through the volunteer, membership and partnership forms — names, email addresses, phone numbers, and occupation. A privacy policy covering what is collected, why, how long it is retained, who can access it, and how someone can request deletion is required before those forms go live. PAIF should also confirm whether it needs to register as a data controller under Ghana's Data Protection Act 2012."
			),
			p("This text must not be published as-is.")
		)
	}
];

export const updates = [
	{
		slug: "the-blue-mission",
		title: "The Blue Mission",
		date: "2023-05-09",
		category: "outreach" as const,
		excerpt:
			"An international volunteer project promoting healthcare development in Ghanaian communities through mobile clinics, health education and community outreach.",
		body: doc(
			p(
				"The Blue Mission is an international volunteer project that promotes volunteerism to support healthcare development within Ghanaian communities. By running public health projects and promoting health education, the project aims to increase access to basic healthcare for people living in rural areas, reduce the prevalence of treatable diseases, and improve public health overall."
			),
			p(
				"Proffer Aid mobilises volunteers to assist in healthcare delivery in communities across Ghana through mobile clinics, hospitals and community outreach programmes. In many of the communities we work in we also provide basic healthcare services and raise awareness of critical health issues. This empowers local communities, improves quality of life, and opens an avenue for preventing and treating illness."
			),
			p(
				"One goal of our community health outreach is to encourage women to take up breast and cervical cancer screening regularly. We provide free general health screening, including breast cancer education and screening, cervical cancer education and screening, and other health issues."
			),
			h("h2", "Project details"),
			p(
				"Clinics were held in Accra and in villages across the Ashanti, Volta, Eastern and Central regions. During clinics, team members were assigned to registration, triage, consultation, pharmacy and technical support, and where necessary assisted with minor procedures. Mobile clinics targeted chronic pain syndrome, infectious diseases such as malaria, helminth-borne infections, breast and cervical cancer, and health education."
			)
		)
	},

	{
		slug: "dont-ignore-the-red-flags",
		title: "Don't Ignore The Red Flags",
		date: "2021-10-19",
		category: "partnership" as const,
		excerpt:
			"A Breast Cancer Awareness Month series run with Evolve Pink, covering cancer genetics and life after mastectomy.",
		body: doc(
			p(
				"For Breast Cancer Awareness Month, Proffer Aid International Foundation partnered with Evolve Pink to deliver a series of health education sessions on breast cancer and cancer genetics. The All African Student Union and the Ghana University Students Association both supported the initiative."
			),
			p(
				'The series ran across two sessions — "Cancer Genetics" and "Mastectomy Did Not Define Me" — held online and open to participants across Ghana and beyond.'
			)
		)
	},

	{
		slug: "walk-with-me",
		title: "Walk With Me",
		date: "2020-07-21",
		category: "outreach" as const,
		excerpt:
			"A free mentorship platform connecting people with professionals across health, education, management and public speaking.",
		body: doc(
			p(
				"Walk With Me is a free mentorship platform offering the opportunity to network with professionals across a range of industries. We give you the opportunity to mentor or to be mentored in any field we have the faculty to support."
			),
			p(
				"With over fifty years of combined experience gathered from professionals across health, education, managerial skills and public speaking, we believe we can guide you to a satisfying destination."
			),
			// The original listed wwm@profferaid.org. That domain is gone and the
			// address is dead — routed to the general contact instead.
			p(
				"If you would like mentorship, or would like to mentor others, please get in touch through our contact page."
			)
		)
	},

	{
		slug: "cervical-cancer-project-beware",
		title: "Proffer Aid launches cervical cancer project (Beware)",
		date: "2020-01-18",
		category: "campaign" as const,
		excerpt:
			"Project Beware launched at Accra College of Education Community Library, aiming to screen 2,000 women for cervical cancer during 2020.",
		body: doc(
			p(
				"Cervical cancer has for some years been the second most common cause of cancer death among women in Ghana, second only to breast cancer. It is a cancer of the lower narrow opening of the uterus, and it may present no symptoms at all — which is part of why it takes such a high toll. The World Health Organization has projected that by 2025 there will be around 5,007 new cases of cervical cancer and 3,361 deaths from it each year in Ghana."
			),
			p(
				"Proffer Aid International Foundation is dedicated to addressing health problems within the Ghanaian community. As part of our health education work, we launched a project named Beware to caution individuals on health issues through awareness, education and screening."
			),
			p(
				"The official launch was held on 28 December 2019 at the Accra College of Education Community Library. The aim was to build awareness through digital platforms and increase uptake of screening, since cervical cancer is highly preventable when screening tools are used."
			),
			p(
				"General Secretary Daniel Forson set out the foundation's intention to raise funds and screen 2,000 women between 1 February and 31 December 2020. Using our screening coupon, women could visit any Marie Stopes Ghana centre across the country, or the Greater Accra Regional Hospital Female Reproductive Centre, for a free cervical cancer test."
			),
			p(
				"The project was supported by Touch Heart Global, Initiative for Social Change, Warm Heart and Glam Kwin GH, with refreshments provided by the Blue Skies Foundation."
			)
		)
	}
];

/**
 * Surfaced at the end of the seed run. These are real recovered figures and
 * details, but they are roughly a decade old — publishing them as current is
 * the one place this content could mislead.
 */
export const NEEDS_CONFIRMATION = [
	'Impact counters: "Members worldwide" (400) and "Active medical practitioners" (50) are point-in-time figures from ~2015 markup. Confirm with PAIF or add an "as of" qualifier. "People reached" (1,500) is cumulative and safe as a floor.',
	"Team roster: confirm all six members are still with the organisation and their roles are current.",
	"Team photos: Kofi Bonsu and Rev. George Kwadwo Asomaning have no recovered photo. Needs a real photo or a designed initials avatar.",
	"Privacy policy: seeded as an unpublished draft. Must be written before the forms go live.",
	"Social links: no URLs were recoverable from the archive. SiteSettings.social is empty.",
	'Impact framing copy for the donate page: needs real figures from PAIF (e.g. "GHS X funds a market health screening").'
];
