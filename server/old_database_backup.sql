--
-- PostgreSQL database dump
--

\restrict 0LLKaUcemD2WrYaNAL4hhSGtVW04iEJMXYWRsY8mfFGqfaTbOV8d4cadhNhxNEh

-- Dumped from database version 18.1 (Debian 18.1-1.pgdg12+2)
-- Dumped by pg_dump version 18.1 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: csn_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO csn_user;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: csn_user
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Chapter; Type: TABLE; Schema: public; Owner: csn_user
--

CREATE TABLE public."Chapter" (
    id text NOT NULL,
    name text NOT NULL,
    city text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Chapter" OWNER TO csn_user;

--
-- Name: Connection; Type: TABLE; Schema: public; Owner: csn_user
--

CREATE TABLE public."Connection" (
    id text NOT NULL,
    "requesterId" text NOT NULL,
    "addresseeId" text NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "requestMessage" text,
    "lastActionBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "acceptedAt" timestamp(3) without time zone
);


ALTER TABLE public."Connection" OWNER TO csn_user;

--
-- Name: ContactRequest; Type: TABLE; Schema: public; Owner: csn_user
--

CREATE TABLE public."ContactRequest" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    reason text NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ContactRequest" OWNER TO csn_user;

--
-- Name: Event; Type: TABLE; Schema: public; Owner: csn_user
--

CREATE TABLE public."Event" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    type text NOT NULL,
    location text,
    "isVirtual" boolean DEFAULT false NOT NULL,
    "virtualLink" text,
    date timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone,
    "isRecurring" boolean DEFAULT false NOT NULL,
    "recurrenceType" text,
    "isPublic" boolean DEFAULT true NOT NULL,
    "chapterId" text,
    "creatorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Event" OWNER TO csn_user;

--
-- Name: EventAttendee; Type: TABLE; Schema: public; Owner: csn_user
--

CREATE TABLE public."EventAttendee" (
    id text NOT NULL,
    "eventId" text NOT NULL,
    "userId" text NOT NULL,
    status text DEFAULT 'GOING'::text NOT NULL,
    role text DEFAULT 'ATTENDEE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."EventAttendee" OWNER TO csn_user;

--
-- Name: EventPhoto; Type: TABLE; Schema: public; Owner: csn_user
--

CREATE TABLE public."EventPhoto" (
    id text NOT NULL,
    "eventId" text NOT NULL,
    url text NOT NULL,
    "uploadedBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."EventPhoto" OWNER TO csn_user;

--
-- Name: GalleryPhoto; Type: TABLE; Schema: public; Owner: csn_user
--

CREATE TABLE public."GalleryPhoto" (
    id text NOT NULL,
    "userId" text NOT NULL,
    url text NOT NULL,
    caption text,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "featuredAt" timestamp(3) without time zone,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "cloudinaryPublicId" text
);


ALTER TABLE public."GalleryPhoto" OWNER TO csn_user;

--
-- Name: Interest; Type: TABLE; Schema: public; Owner: csn_user
--

CREATE TABLE public."Interest" (
    id text NOT NULL,
    name text NOT NULL,
    "categoryId" text NOT NULL
);


ALTER TABLE public."Interest" OWNER TO csn_user;

--
-- Name: InterestCategory; Type: TABLE; Schema: public; Owner: csn_user
--

CREATE TABLE public."InterestCategory" (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL
);


ALTER TABLE public."InterestCategory" OWNER TO csn_user;

--
-- Name: Referral; Type: TABLE; Schema: public; Owner: csn_user
--

CREATE TABLE public."Referral" (
    id text NOT NULL,
    "fromUserId" text NOT NULL,
    "toUserId" text NOT NULL,
    type text DEFAULT 'BUSINESS'::text NOT NULL,
    description text NOT NULL,
    "contactName" text,
    "contactEmail" text,
    "contactPhone" text,
    "businessValue" double precision,
    status text DEFAULT 'PENDING'::text NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Referral" OWNER TO csn_user;

--
-- Name: Testimonial; Type: TABLE; Schema: public; Owner: csn_user
--

CREATE TABLE public."Testimonial" (
    id text NOT NULL,
    "fromUserId" text NOT NULL,
    "toUserId" text NOT NULL,
    type text NOT NULL,
    content text NOT NULL,
    "referralId" text,
    "eventId" text,
    visibility text DEFAULT 'PUBLIC'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Testimonial" OWNER TO csn_user;

--
-- Name: User; Type: TABLE; Schema: public; Owner: csn_user
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    company text,
    "position" text,
    city text,
    phone text,
    "profilePhoto" text,
    tagline text,
    bio text,
    "emailVerified" boolean DEFAULT false NOT NULL,
    "emailVerifiedAt" timestamp(3) without time zone,
    "phoneVerified" boolean DEFAULT false NOT NULL,
    "phoneVerifiedAt" timestamp(3) without time zone,
    "communityVerified" boolean DEFAULT false NOT NULL,
    "socialLinks" text,
    "chapterId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "profilePhotoPublicId" text
);


ALTER TABLE public."User" OWNER TO csn_user;

--
-- Name: UserInterest; Type: TABLE; Schema: public; Owner: csn_user
--

CREATE TABLE public."UserInterest" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "interestId" text NOT NULL,
    visibility text DEFAULT 'PUBLIC'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."UserInterest" OWNER TO csn_user;

--
-- Name: UserPrivacy; Type: TABLE; Schema: public; Owner: csn_user
--

CREATE TABLE public."UserPrivacy" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "emailVisibility" text DEFAULT 'PUBLIC'::text NOT NULL,
    "phoneVisibility" text DEFAULT 'PRIVATE'::text NOT NULL,
    "eventsVisibility" text DEFAULT 'CONNECTIONS'::text NOT NULL,
    "interestsVisibility" text DEFAULT 'PUBLIC'::text NOT NULL,
    "activityVisibility" text DEFAULT 'CONNECTIONS'::text NOT NULL
);


ALTER TABLE public."UserPrivacy" OWNER TO csn_user;

--
-- Name: UserVerification; Type: TABLE; Schema: public; Owner: csn_user
--

CREATE TABLE public."UserVerification" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "verifiedBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."UserVerification" OWNER TO csn_user;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: csn_user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO csn_user;

--
-- Data for Name: Chapter; Type: TABLE DATA; Schema: public; Owner: csn_user
--

COPY public."Chapter" (id, name, city, "createdAt", "updatedAt") FROM stdin;
eb0cbfdd-ef6d-403b-ac9a-a515041ca228	San Francisco Tech	San Francisco	2026-01-16 06:50:41.252	2026-01-16 06:50:41.252
\.


--
-- Data for Name: Connection; Type: TABLE DATA; Schema: public; Owner: csn_user
--

COPY public."Connection" (id, "requesterId", "addresseeId", status, "requestMessage", "lastActionBy", "createdAt", "updatedAt", "acceptedAt") FROM stdin;
6d4eb74c-846a-4717-910d-22ed71796565	5bd48495-8f6a-40aa-93bb-fd6589fab07a	cb0ceb4f-46f5-48d5-80d6-3cc76fb32027	ACCEPTED	\N	\N	2026-01-16 06:51:44.258	2026-01-16 06:51:44.258	\N
923f6dbe-9519-45af-9490-7c6236b1c99b	5bd48495-8f6a-40aa-93bb-fd6589fab07a	d259702c-f472-4105-bffb-b078649a7424	ACCEPTED	\N	\N	2026-01-16 06:51:46.753	2026-01-16 06:51:46.753	\N
5af253ea-b139-4d0b-8252-7b9bd3eb82e5	5bd48495-8f6a-40aa-93bb-fd6589fab07a	d651f6a3-6505-49e4-b93e-cb9358eab5ce	ACCEPTED	\N	\N	2026-01-16 06:51:48.616	2026-01-16 06:51:48.616	\N
bcd7e250-6380-405b-a4eb-030fad5044b3	5bd48495-8f6a-40aa-93bb-fd6589fab07a	f75d7c6e-9650-426f-846e-f7a5e67feace	ACCEPTED	\N	\N	2026-01-16 06:51:50.059	2026-01-16 06:51:50.059	\N
04938f93-b28f-4208-942a-ef14f053f9ec	5bd48495-8f6a-40aa-93bb-fd6589fab07a	2d76c495-4aa0-402f-80d6-5d6cbc27fc07	ACCEPTED	\N	\N	2026-01-16 06:51:51.566	2026-01-16 06:51:51.566	\N
92ec617e-6b9b-45ac-982f-c25da10bd186	5bd48495-8f6a-40aa-93bb-fd6589fab07a	19ad4961-d8c8-4f69-ade1-a255520d0af6	ACCEPTED	\N	\N	2026-01-16 06:51:53.011	2026-01-16 06:51:53.011	\N
ca4ae7a8-ac4d-4b87-b991-fb908d33bdd0	5bd48495-8f6a-40aa-93bb-fd6589fab07a	0971cfb0-995b-41a7-b619-3f4fa5cca8a7	ACCEPTED	\N	\N	2026-01-16 06:51:54.535	2026-01-16 06:51:54.535	\N
203aa165-07b2-4f44-aea0-e3508b7b26a8	5bd48495-8f6a-40aa-93bb-fd6589fab07a	8c93df39-a741-46cc-beb8-b87778b30c30	ACCEPTED	\N	\N	2026-01-16 06:51:55.974	2026-01-16 06:51:55.974	\N
dd5fa318-1725-4b28-b59f-76782b6e3c62	5bd48495-8f6a-40aa-93bb-fd6589fab07a	e1310163-2259-4db0-aeb3-33669dbe32ff	ACCEPTED	\N	\N	2026-01-16 06:51:57.422	2026-01-16 06:51:57.422	\N
27077b91-3c7c-4def-b3ef-157dce752eac	5bd48495-8f6a-40aa-93bb-fd6589fab07a	6f97ce6b-c7f7-4385-89a7-1257eb363f5c	ACCEPTED	\N	\N	2026-01-16 06:52:00.517	2026-01-16 06:52:00.517	\N
913a9324-deb4-4b48-931d-f07434da748c	73125d32-f995-4a10-a620-1a4475c39946	5bd48495-8f6a-40aa-93bb-fd6589fab07a	ACCEPTED	\N	5bd48495-8f6a-40aa-93bb-fd6589fab07a	2026-01-18 18:44:39.574	2026-01-18 18:53:32.522	2026-01-18 18:53:32.521
\.


--
-- Data for Name: ContactRequest; Type: TABLE DATA; Schema: public; Owner: csn_user
--

COPY public."ContactRequest" (id, name, email, reason, status, "createdAt") FROM stdin;
\.


--
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: csn_user
--

COPY public."Event" (id, title, description, type, location, "isVirtual", "virtualLink", date, "endDate", "isRecurring", "recurrenceType", "isPublic", "chapterId", "creatorId", "createdAt", "updatedAt") FROM stdin;
b325a668-25aa-4fc1-a00b-4271de8345d1	hi	zxcvvbm,	NETWORKING	India	f	\N	2026-01-15 01:06:00	\N	t		t	\N	5bd48495-8f6a-40aa-93bb-fd6589fab07a	2026-01-14 12:07:24.083	2026-01-14 12:07:24.083
6d88d411-b529-4677-87c6-9bc1babd0780	Tech Networking Mixer	Join us for an evening of networking with tech professionals	NETWORKING	Downtown Tech Hub	f	\N	2026-01-17 12:30:00	\N	t	WEEKLY	t	eb0cbfdd-ef6d-403b-ac9a-a515041ca228	5bd48495-8f6a-40aa-93bb-fd6589fab07a	2026-01-16 06:51:39.689	2026-01-16 06:51:39.689
6ed5b66e-cac3-4302-b7ab-fd77ab001670	Private Networking Dinner	Exclusive networking dinner for selected members. Join us for an intimate evening of meaningful connections and conversations.	NETWORKING	The Ivy Restaurant, San Francisco	f	\N	2026-01-23 06:52:01.959	2026-01-23 09:52:01.962	f	\N	f	eb0cbfdd-ef6d-403b-ac9a-a515041ca228	5bd48495-8f6a-40aa-93bb-fd6589fab07a	2026-01-16 06:52:01.963	2026-01-16 06:52:01.963
\.


--
-- Data for Name: EventAttendee; Type: TABLE DATA; Schema: public; Owner: csn_user
--

COPY public."EventAttendee" (id, "eventId", "userId", status, role, "createdAt") FROM stdin;
41d4f260-9182-4b8c-80ea-0d4c72e8f973	b325a668-25aa-4fc1-a00b-4271de8345d1	5bd48495-8f6a-40aa-93bb-fd6589fab07a	GOING	ORGANIZER	2026-01-14 12:07:24.093
fb3fa62a-e773-4b65-b39b-501e08c0fac4	6d88d411-b529-4677-87c6-9bc1babd0780	5bd48495-8f6a-40aa-93bb-fd6589fab07a	GOING	HOST	2026-01-16 06:51:40.269
ea861daa-75ce-49ec-ae1b-f1c2a798d534	6d88d411-b529-4677-87c6-9bc1babd0780	cb0ceb4f-46f5-48d5-80d6-3cc76fb32027	GOING	ATTENDEE	2026-01-16 06:51:40.852
f02c9c90-ae64-449e-a874-219e5dfe2423	6ed5b66e-cac3-4302-b7ab-fd77ab001670	cb0ceb4f-46f5-48d5-80d6-3cc76fb32027	INVITED	ATTENDEE	2026-01-16 06:52:03.187
6f811ff6-3cda-443a-901b-88045c9e65ad	6ed5b66e-cac3-4302-b7ab-fd77ab001670	5bd48495-8f6a-40aa-93bb-fd6589fab07a	MAYBE	ORGANIZER	2026-01-16 06:52:02.609
\.


--
-- Data for Name: EventPhoto; Type: TABLE DATA; Schema: public; Owner: csn_user
--

COPY public."EventPhoto" (id, "eventId", url, "uploadedBy", "createdAt") FROM stdin;
\.


--
-- Data for Name: GalleryPhoto; Type: TABLE DATA; Schema: public; Owner: csn_user
--

COPY public."GalleryPhoto" (id, "userId", url, caption, "isFeatured", "featuredAt", "uploadedAt", "cloudinaryPublicId") FROM stdin;
2ab779ff-2853-4b05-b8be-537f2dcef7ad	5bd48495-8f6a-40aa-93bb-fd6589fab07a	https://res.cloudinary.com/dexm42xoh/image/upload/v1768773436/csn/gallery/5bd48495-8f6a-40aa-93bb-fd6589fab07a/09da57ce-5b94-4641-80b0-3ef789634fb9/cmwlasdqua2cgltpmcav.png	earth	f	\N	2026-01-18 21:57:17.106	csn/gallery/5bd48495-8f6a-40aa-93bb-fd6589fab07a/09da57ce-5b94-4641-80b0-3ef789634fb9/cmwlasdqua2cgltpmcav
\.


--
-- Data for Name: Interest; Type: TABLE DATA; Schema: public; Owner: csn_user
--

COPY public."Interest" (id, name, "categoryId") FROM stdin;
fdce38f6-f93f-4c6e-ae1a-569dae2bf49f	Technology	af37cda9-bf87-4d98-9a32-92c5908f949f
5bb454b5-a315-4b50-99a6-94d1c4155f52	Marketing	af37cda9-bf87-4d98-9a32-92c5908f949f
04e85bec-8882-4011-9de5-78c0c244b81f	Finance	af37cda9-bf87-4d98-9a32-92c5908f949f
04043ccc-fd4a-41c3-9ef8-d9e8e1ff5e87	Startups	af37cda9-bf87-4d98-9a32-92c5908f949f
9766361d-5449-4ef3-9fcc-825a4c8d0dc1	Consulting	af37cda9-bf87-4d98-9a32-92c5908f949f
65edb9bd-3c12-459a-a3f9-b5ec9bf641a8	Fitness	82798e03-3a7f-4ada-9e47-50e1c008a9b3
1214fe76-b261-465f-96c1-090fc36c2d35	Travel	82798e03-3a7f-4ada-9e47-50e1c008a9b3
721a55e4-9ac3-4a8d-8f13-20e872c60eeb	Music	82798e03-3a7f-4ada-9e47-50e1c008a9b3
efaf9c79-25fc-4892-9194-a316b548e45c	Food	82798e03-3a7f-4ada-9e47-50e1c008a9b3
25d1f5a8-5bb0-4119-83c9-a79b9a1306ce	Photography	82798e03-3a7f-4ada-9e47-50e1c008a9b3
b108bca6-7f8d-4db0-9296-be4eb544ffa4	Reading	801a025f-a759-4def-896a-9e999ae8f388
cff7f41d-0a67-4616-ba14-4e83633cf27c	Podcasts	801a025f-a759-4def-896a-9e999ae8f388
81b193ce-4794-4052-b9a7-b52cdee32d1a	Workshops	801a025f-a759-4def-896a-9e999ae8f388
3f161760-cdb8-4f4b-ac35-69d89299d679	Mentoring	801a025f-a759-4def-896a-9e999ae8f388
ef7c9055-7e5e-40bd-a371-e1096eb30f3e	Gaming	ca6285d8-0d58-4040-95bf-17b658872fb5
0752f18a-00d8-4c16-8098-d65db8004f64	Sports	ca6285d8-0d58-4040-95bf-17b658872fb5
c15156ca-62ed-445f-8613-02771d7b942b	Arts	ca6285d8-0d58-4040-95bf-17b658872fb5
d9fd5a1e-0f5a-47c4-bdd3-c415e871ce57	Volunteering	ca6285d8-0d58-4040-95bf-17b658872fb5
\.


--
-- Data for Name: InterestCategory; Type: TABLE DATA; Schema: public; Owner: csn_user
--

COPY public."InterestCategory" (id, name, type) FROM stdin;
af37cda9-bf87-4d98-9a32-92c5908f949f	PROFESSIONAL	PROFESSIONAL
82798e03-3a7f-4ada-9e47-50e1c008a9b3	LIFESTYLE	LIFESTYLE
801a025f-a759-4def-896a-9e999ae8f388	LEARNING	LEARNING
ca6285d8-0d58-4040-95bf-17b658872fb5	SOCIAL	SOCIAL
\.


--
-- Data for Name: Referral; Type: TABLE DATA; Schema: public; Owner: csn_user
--

COPY public."Referral" (id, "fromUserId", "toUserId", type, description, "contactName", "contactEmail", "contactPhone", "businessValue", status, notes, "createdAt", "updatedAt") FROM stdin;
2862574f-87ad-4aa9-a7a2-cd790400560a	5bd48495-8f6a-40aa-93bb-fd6589fab07a	cb0ceb4f-46f5-48d5-80d6-3cc76fb32027	BUSINESS	Great marketing opportunity for new tech product	Alice Johnson	alice@startup.com	\N	5000	PENDING	\N	2026-01-16 06:51:38.748	2026-01-16 06:51:38.748
f3c144fc-0b1e-4e7a-ba09-7875ab8dbeca	cb0ceb4f-46f5-48d5-80d6-3cc76fb32027	5bd48495-8f6a-40aa-93bb-fd6589fab07a	BUSINESS	Software development project	Bob Williams	bob@company.com	\N	10000	CONVERTED	\N	2026-01-16 06:51:39.33	2026-01-16 06:51:39.33
\.


--
-- Data for Name: Testimonial; Type: TABLE DATA; Schema: public; Owner: csn_user
--

COPY public."Testimonial" (id, "fromUserId", "toUserId", type, content, "referralId", "eventId", visibility, "createdAt") FROM stdin;
73132c8b-82a2-48c2-9712-dff2dd3854c5	cb0ceb4f-46f5-48d5-80d6-3cc76fb32027	5bd48495-8f6a-40aa-93bb-fd6589fab07a	REFERRAL	John provided an excellent referral that resulted in a ₹10,000 project. Highly professional and trustworthy!	f3c144fc-0b1e-4e7a-ba09-7875ab8dbeca	\N	PUBLIC	2026-01-16 06:51:41.223
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: csn_user
--

COPY public."User" (id, email, password, "firstName", "lastName", company, "position", city, phone, "profilePhoto", tagline, bio, "emailVerified", "emailVerifiedAt", "phoneVerified", "phoneVerifiedAt", "communityVerified", "socialLinks", "chapterId", "createdAt", "updatedAt", "profilePhotoPublicId") FROM stdin;
5bd48495-8f6a-40aa-93bb-fd6589fab07a	test@gmail.com	$2b$10$iy94q09eh3BY0pywmiQiYOVBymxYM58ps1D24vhrmsyKH0R40GaLK	Test	User	XYZ	CEO	HARIDWAR	9660054473	https://res.cloudinary.com/dexm42xoh/image/upload/v1768773599/csn/profile_photos/5bd48495-8f6a-40aa-93bb-fd6589fab07a/azxjkic9s9pytqebtye3.jpg		Hi, it is the testing phase.	f	\N	f	\N	f	\N	\N	2026-01-14 10:25:07.069	2026-01-18 22:00:00.301	csn/profile_photos/5bd48495-8f6a-40aa-93bb-fd6589fab07a/azxjkic9s9pytqebtye3
cb0ceb4f-46f5-48d5-80d6-3cc76fb32027	jane@example.com	$2b$10$IP6L9nZgUHIpNllWd.7ELecQLLNDAy1Oyfr53MWabaxuJvHypRkYG	Jane	Smith	Marketing Pro	Marketing Director	San Francisco	+1-555-0456	\N	Connecting brands with their audience	Marketing expert with 10+ years of experience	t	2026-01-16 06:51:23.802	f	\N	f	\N	eb0cbfdd-ef6d-403b-ac9a-a515041ca228	2026-01-16 06:51:23.803	2026-01-16 06:51:23.803	\N
f75d7c6e-9650-426f-846e-f7a5e67feace	emily.rodriguez@example.com	$2b$10$Y8H.T5emZRBiIJYXdxpAzOoX1A.7Dzio5/hHVWmrrE7KrW.2AAyLi	Emily	Rodriguez	Design Studio	UX Lead	San Francisco	\N	\N	Connecting and growing together	Professional UX Lead at Design Studio	t	2026-01-16 06:51:27.622	f	\N	f	\N	eb0cbfdd-ef6d-403b-ac9a-a515041ca228	2026-01-16 06:51:27.623	2026-01-16 06:51:27.623	\N
19ad4961-d8c8-4f69-ade1-a255520d0af6	lisa.patel@example.com	$2b$10$0QkYifDpogQDP9qtBK2uL.2Go/znVSMGwN5Yx2qs88lSo4Jn0F4Vq	Lisa	Patel	FinTech Solutions	CFO	San Francisco	\N	\N	Connecting and growing together	Professional CFO at FinTech Solutions	t	2026-01-16 06:51:27.682	f	\N	f	\N	eb0cbfdd-ef6d-403b-ac9a-a515041ca228	2026-01-16 06:51:27.683	2026-01-16 06:51:27.683	\N
e1310163-2259-4db0-aeb3-33669dbe32ff	robert.taylor@example.com	$2b$10$RMHAxoQ6XPG6FlMl3apBI.Jz7cCcBrS523U1DYIoJKHLzqRIYsN/S	Robert	Taylor	Sales Corp	Sales Director	San Francisco	\N	\N	Connecting and growing together	Professional Sales Director at Sales Corp	t	2026-01-16 06:51:27.682	f	\N	f	\N	eb0cbfdd-ef6d-403b-ac9a-a515041ca228	2026-01-16 06:51:27.683	2026-01-16 06:51:27.683	\N
0971cfb0-995b-41a7-b619-3f4fa5cca8a7	james.brown@example.com	$2b$10$CjHYCzOZhgt.sZXp607me.O2pjffMfW0Q8TmRBltn/eW2OcB6Nqee	James	Brown	Marketing Pro	CMO	San Francisco	\N	\N	Connecting and growing together	Professional CMO at Marketing Pro	t	2026-01-16 06:51:27.682	f	\N	f	\N	eb0cbfdd-ef6d-403b-ac9a-a515041ca228	2026-01-16 06:51:27.683	2026-01-16 06:51:27.683	\N
8c93df39-a741-46cc-beb8-b87778b30c30	anna.martinez@example.com	$2b$10$4xBnJSlED0i0mdH6Uimuxumm3zpITY9YK1CwswgvybPDbQa7Ed1NS	Anna	Martinez	Legal Advisors	Attorney	San Francisco	\N	\N	Connecting and growing together	Professional Attorney at Legal Advisors	t	2026-01-16 06:51:27.682	f	\N	f	\N	eb0cbfdd-ef6d-403b-ac9a-a515041ca228	2026-01-16 06:51:27.683	2026-01-16 06:51:27.683	\N
d259702c-f472-4105-bffb-b078649a7424	sarah.johnson@example.com	$2b$10$P9Xq2lMtbFkrFnqnRy.GtOq2TJAZbuUNSeB8Ls3LMX1p5b1AyOjGq	Sarah	Johnson	Tech Innovations	Product Manager	San Francisco	\N	\N	Connecting and growing together	Professional Product Manager at Tech Innovations	t	2026-01-16 06:51:27.622	f	\N	f	\N	eb0cbfdd-ef6d-403b-ac9a-a515041ca228	2026-01-16 06:51:27.623	2026-01-16 06:51:27.623	\N
6f97ce6b-c7f7-4385-89a7-1257eb363f5c	chris.anderson@example.com	$2b$10$CDafx04mL6/XRY6pEAf2pu8pDvEbJX2v/rHbZxEyc5nsKqlhDaUvi	Chris	Anderson	Consulting Group	Senior Consultant	San Francisco	\N	\N	Connecting and growing together	Professional Senior Consultant at Consulting Group	t	2026-01-16 06:51:27.742	f	\N	f	\N	eb0cbfdd-ef6d-403b-ac9a-a515041ca228	2026-01-16 06:51:27.743	2026-01-16 06:51:27.743	\N
d651f6a3-6505-49e4-b93e-cb9358eab5ce	mike.chen@example.com	$2b$10$jMZQNoxTXaulaibcrWhAj.fCThlsm2jRIygGU5p66hxzjnrpSWo7m	Mike	Chen	StartupHub	CTO	San Francisco	\N	\N	Connecting and growing together	Professional CTO at StartupHub	t	2026-01-16 06:51:27.622	f	\N	f	\N	eb0cbfdd-ef6d-403b-ac9a-a515041ca228	2026-01-16 06:51:27.623	2026-01-16 06:51:27.623	\N
c2dfb067-ca92-4cae-a2a0-3b94fc8eabf9	michelle.lee@example.com	$2b$10$vvYm95Ug8Pb6pEp/BPKkku5U9UfrSqtMea3CzxOTrci/rMWmaHgv2	Michelle	Lee	HR Solutions	HR Manager	San Francisco	\N	\N	Connecting and growing together	Professional HR Manager at HR Solutions	t	2026-01-16 06:51:27.742	f	\N	f	\N	eb0cbfdd-ef6d-403b-ac9a-a515041ca228	2026-01-16 06:51:27.743	2026-01-16 06:51:27.743	\N
2d76c495-4aa0-402f-80d6-5d6cbc27fc07	david.kim@example.com	$2b$10$1hbc7xUjrBdqJIv2tZP7zucFvd0sFx4cUmpSYuahEnDy1vRtYj30G	David	Kim	AI Labs	ML Engineer	San Francisco	\N	\N	Connecting and growing together	Professional ML Engineer at AI Labs	t	2026-01-16 06:51:27.622	f	\N	f	\N	eb0cbfdd-ef6d-403b-ac9a-a515041ca228	2026-01-16 06:51:27.623	2026-01-16 06:51:27.623	\N
73125d32-f995-4a10-a620-1a4475c39946	xo@gmail.ocm	$2b$10$7ozBmOW36SQXwosEHY5K7O7nQX/nSq7EjcpM6wxnYqZevvqZkBiwC	xo	xo	\N	\N	\N	\N	/uploads/profiles/73125d32-f995-4a10-a620-1a4475c39946-1768762163616.jpg	\N	\N	f	\N	f	\N	f	\N	\N	2026-01-18 18:31:54.097	2026-01-18 18:49:23.627	\N
\.


--
-- Data for Name: UserInterest; Type: TABLE DATA; Schema: public; Owner: csn_user
--

COPY public."UserInterest" (id, "userId", "interestId", visibility, "createdAt") FROM stdin;
62e760f5-caa8-4089-b0e6-90ac9612cdfb	5bd48495-8f6a-40aa-93bb-fd6589fab07a	65edb9bd-3c12-459a-a3f9-b5ec9bf641a8	PUBLIC	2026-01-16 06:51:35.776
cc123ef1-9170-467d-a286-fa591fe06fdd	5bd48495-8f6a-40aa-93bb-fd6589fab07a	04043ccc-fd4a-41c3-9ef8-d9e8e1ff5e87	PUBLIC	2026-01-16 06:51:37.274
df24ae0f-75d0-4899-8f9c-6fbe0f5228c5	5bd48495-8f6a-40aa-93bb-fd6589fab07a	04e85bec-8882-4011-9de5-78c0c244b81f	PUBLIC	2026-01-16 07:13:02.411
c06e70f3-b288-4589-adf8-98bbb5ea4c13	5bd48495-8f6a-40aa-93bb-fd6589fab07a	0752f18a-00d8-4c16-8098-d65db8004f64	PUBLIC	2026-01-16 07:13:10.162
\.


--
-- Data for Name: UserPrivacy; Type: TABLE DATA; Schema: public; Owner: csn_user
--

COPY public."UserPrivacy" (id, "userId", "emailVisibility", "phoneVisibility", "eventsVisibility", "interestsVisibility", "activityVisibility") FROM stdin;
c77f79c2-008a-426a-a5c0-c4f556fccf15	5bd48495-8f6a-40aa-93bb-fd6589fab07a	PUBLIC	PRIVATE	CONNECTIONS	PUBLIC	CONNECTIONS
93f343bf-bcbe-4dca-94f9-2088ab2af790	cb0ceb4f-46f5-48d5-80d6-3cc76fb32027	PUBLIC	PRIVATE	CONNECTIONS	PUBLIC	CONNECTIONS
10115f84-9846-4a7e-b95b-2d6d3920d6b5	73125d32-f995-4a10-a620-1a4475c39946	PUBLIC	PRIVATE	CONNECTIONS	PUBLIC	CONNECTIONS
\.


--
-- Data for Name: UserVerification; Type: TABLE DATA; Schema: public; Owner: csn_user
--

COPY public."UserVerification" (id, "userId", "verifiedBy", "createdAt") FROM stdin;
3a33a9c1-8e4a-441e-bd28-1fbc89780217	5bd48495-8f6a-40aa-93bb-fd6589fab07a	cb0ceb4f-46f5-48d5-80d6-3cc76fb32027	2026-01-16 06:51:41.814
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: csn_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
f6bae5f2-5166-43be-ae47-a1fbe8d145c1	b5aecf377ed1e877875aafc7764891543132fff5b5ce24fb2f508807d9bdd9c4	2026-01-14 10:18:02.666824+00	20260114101759_init_postgresql	\N	\N	2026-01-14 10:18:00.566844+00	1
a77d37c2-910b-475f-8114-e4bbe3b413f0	22a8063734d8e6635a83547b4db8cb89c74092f8dfa4bb050f15cbdf925e2de3	2026-01-16 08:04:14.436532+00	20260116080411_add_contact_request	\N	\N	2026-01-16 08:04:12.95053+00	1
58d007a3-0bfe-430e-bd05-3c7600e60423	88b78498298430316ad338f6a67478cf08d86829edb6d54914d3394f79ed156e	2026-01-18 21:47:24.140468+00	20260119_add_cloudinary_fields		\N	2026-01-18 21:47:24.140468+00	0
\.


--
-- Name: Chapter Chapter_pkey; Type: CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."Chapter"
    ADD CONSTRAINT "Chapter_pkey" PRIMARY KEY (id);


--
-- Name: Connection Connection_pkey; Type: CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."Connection"
    ADD CONSTRAINT "Connection_pkey" PRIMARY KEY (id);


--
-- Name: ContactRequest ContactRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."ContactRequest"
    ADD CONSTRAINT "ContactRequest_pkey" PRIMARY KEY (id);


--
-- Name: EventAttendee EventAttendee_pkey; Type: CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."EventAttendee"
    ADD CONSTRAINT "EventAttendee_pkey" PRIMARY KEY (id);


--
-- Name: EventPhoto EventPhoto_pkey; Type: CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."EventPhoto"
    ADD CONSTRAINT "EventPhoto_pkey" PRIMARY KEY (id);


--
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- Name: GalleryPhoto GalleryPhoto_pkey; Type: CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."GalleryPhoto"
    ADD CONSTRAINT "GalleryPhoto_pkey" PRIMARY KEY (id);


--
-- Name: InterestCategory InterestCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."InterestCategory"
    ADD CONSTRAINT "InterestCategory_pkey" PRIMARY KEY (id);


--
-- Name: Interest Interest_pkey; Type: CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."Interest"
    ADD CONSTRAINT "Interest_pkey" PRIMARY KEY (id);


--
-- Name: Referral Referral_pkey; Type: CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."Referral"
    ADD CONSTRAINT "Referral_pkey" PRIMARY KEY (id);


--
-- Name: Testimonial Testimonial_pkey; Type: CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."Testimonial"
    ADD CONSTRAINT "Testimonial_pkey" PRIMARY KEY (id);


--
-- Name: UserInterest UserInterest_pkey; Type: CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."UserInterest"
    ADD CONSTRAINT "UserInterest_pkey" PRIMARY KEY (id);


--
-- Name: UserPrivacy UserPrivacy_pkey; Type: CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."UserPrivacy"
    ADD CONSTRAINT "UserPrivacy_pkey" PRIMARY KEY (id);


--
-- Name: UserVerification UserVerification_pkey; Type: CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."UserVerification"
    ADD CONSTRAINT "UserVerification_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Chapter_city_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "Chapter_city_idx" ON public."Chapter" USING btree (city);


--
-- Name: Chapter_name_key; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE UNIQUE INDEX "Chapter_name_key" ON public."Chapter" USING btree (name);


--
-- Name: Connection_addresseeId_status_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "Connection_addresseeId_status_idx" ON public."Connection" USING btree ("addresseeId", status);


--
-- Name: Connection_requesterId_addresseeId_key; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE UNIQUE INDEX "Connection_requesterId_addresseeId_key" ON public."Connection" USING btree ("requesterId", "addresseeId");


--
-- Name: Connection_requesterId_status_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "Connection_requesterId_status_idx" ON public."Connection" USING btree ("requesterId", status);


--
-- Name: Connection_status_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "Connection_status_idx" ON public."Connection" USING btree (status);


--
-- Name: ContactRequest_email_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "ContactRequest_email_idx" ON public."ContactRequest" USING btree (email);


--
-- Name: ContactRequest_status_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "ContactRequest_status_idx" ON public."ContactRequest" USING btree (status);


--
-- Name: EventAttendee_eventId_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "EventAttendee_eventId_idx" ON public."EventAttendee" USING btree ("eventId");


--
-- Name: EventAttendee_eventId_userId_key; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE UNIQUE INDEX "EventAttendee_eventId_userId_key" ON public."EventAttendee" USING btree ("eventId", "userId");


--
-- Name: EventAttendee_status_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "EventAttendee_status_idx" ON public."EventAttendee" USING btree (status);


--
-- Name: EventAttendee_userId_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "EventAttendee_userId_idx" ON public."EventAttendee" USING btree ("userId");


--
-- Name: EventPhoto_eventId_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "EventPhoto_eventId_idx" ON public."EventPhoto" USING btree ("eventId");


--
-- Name: EventPhoto_uploadedBy_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "EventPhoto_uploadedBy_idx" ON public."EventPhoto" USING btree ("uploadedBy");


--
-- Name: Event_chapterId_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "Event_chapterId_idx" ON public."Event" USING btree ("chapterId");


--
-- Name: Event_creatorId_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "Event_creatorId_idx" ON public."Event" USING btree ("creatorId");


--
-- Name: Event_date_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "Event_date_idx" ON public."Event" USING btree (date);


--
-- Name: Event_type_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "Event_type_idx" ON public."Event" USING btree (type);


--
-- Name: GalleryPhoto_isFeatured_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "GalleryPhoto_isFeatured_idx" ON public."GalleryPhoto" USING btree ("isFeatured");


--
-- Name: GalleryPhoto_uploadedAt_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "GalleryPhoto_uploadedAt_idx" ON public."GalleryPhoto" USING btree ("uploadedAt");


--
-- Name: GalleryPhoto_userId_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "GalleryPhoto_userId_idx" ON public."GalleryPhoto" USING btree ("userId");


--
-- Name: InterestCategory_name_key; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE UNIQUE INDEX "InterestCategory_name_key" ON public."InterestCategory" USING btree (name);


--
-- Name: Interest_categoryId_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "Interest_categoryId_idx" ON public."Interest" USING btree ("categoryId");


--
-- Name: Interest_name_key; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE UNIQUE INDEX "Interest_name_key" ON public."Interest" USING btree (name);


--
-- Name: Referral_createdAt_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "Referral_createdAt_idx" ON public."Referral" USING btree ("createdAt");


--
-- Name: Referral_fromUserId_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "Referral_fromUserId_idx" ON public."Referral" USING btree ("fromUserId");


--
-- Name: Referral_status_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "Referral_status_idx" ON public."Referral" USING btree (status);


--
-- Name: Referral_toUserId_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "Referral_toUserId_idx" ON public."Referral" USING btree ("toUserId");


--
-- Name: Testimonial_fromUserId_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "Testimonial_fromUserId_idx" ON public."Testimonial" USING btree ("fromUserId");


--
-- Name: Testimonial_fromUserId_toUserId_referralId_key; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE UNIQUE INDEX "Testimonial_fromUserId_toUserId_referralId_key" ON public."Testimonial" USING btree ("fromUserId", "toUserId", "referralId");


--
-- Name: Testimonial_referralId_key; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE UNIQUE INDEX "Testimonial_referralId_key" ON public."Testimonial" USING btree ("referralId");


--
-- Name: Testimonial_toUserId_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "Testimonial_toUserId_idx" ON public."Testimonial" USING btree ("toUserId");


--
-- Name: Testimonial_type_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "Testimonial_type_idx" ON public."Testimonial" USING btree (type);


--
-- Name: UserInterest_interestId_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "UserInterest_interestId_idx" ON public."UserInterest" USING btree ("interestId");


--
-- Name: UserInterest_userId_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "UserInterest_userId_idx" ON public."UserInterest" USING btree ("userId");


--
-- Name: UserInterest_userId_interestId_key; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE UNIQUE INDEX "UserInterest_userId_interestId_key" ON public."UserInterest" USING btree ("userId", "interestId");


--
-- Name: UserPrivacy_userId_key; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE UNIQUE INDEX "UserPrivacy_userId_key" ON public."UserPrivacy" USING btree ("userId");


--
-- Name: UserVerification_userId_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "UserVerification_userId_idx" ON public."UserVerification" USING btree ("userId");


--
-- Name: UserVerification_userId_verifiedBy_key; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE UNIQUE INDEX "UserVerification_userId_verifiedBy_key" ON public."UserVerification" USING btree ("userId", "verifiedBy");


--
-- Name: UserVerification_verifiedBy_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "UserVerification_verifiedBy_idx" ON public."UserVerification" USING btree ("verifiedBy");


--
-- Name: User_chapterId_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "User_chapterId_idx" ON public."User" USING btree ("chapterId");


--
-- Name: User_communityVerified_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "User_communityVerified_idx" ON public."User" USING btree ("communityVerified");


--
-- Name: User_emailVerified_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "User_emailVerified_idx" ON public."User" USING btree ("emailVerified");


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: csn_user
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Connection Connection_addresseeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."Connection"
    ADD CONSTRAINT "Connection_addresseeId_fkey" FOREIGN KEY ("addresseeId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Connection Connection_requesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."Connection"
    ADD CONSTRAINT "Connection_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EventAttendee EventAttendee_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."EventAttendee"
    ADD CONSTRAINT "EventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EventAttendee EventAttendee_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."EventAttendee"
    ADD CONSTRAINT "EventAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EventPhoto EventPhoto_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."EventPhoto"
    ADD CONSTRAINT "EventPhoto_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EventPhoto EventPhoto_uploadedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."EventPhoto"
    ADD CONSTRAINT "EventPhoto_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Event Event_chapterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES public."Chapter"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Event Event_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GalleryPhoto GalleryPhoto_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."GalleryPhoto"
    ADD CONSTRAINT "GalleryPhoto_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Interest Interest_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."Interest"
    ADD CONSTRAINT "Interest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."InterestCategory"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Referral Referral_fromUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."Referral"
    ADD CONSTRAINT "Referral_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Referral Referral_toUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."Referral"
    ADD CONSTRAINT "Referral_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Testimonial Testimonial_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."Testimonial"
    ADD CONSTRAINT "Testimonial_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Testimonial Testimonial_fromUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."Testimonial"
    ADD CONSTRAINT "Testimonial_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Testimonial Testimonial_referralId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."Testimonial"
    ADD CONSTRAINT "Testimonial_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES public."Referral"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Testimonial Testimonial_toUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."Testimonial"
    ADD CONSTRAINT "Testimonial_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserInterest UserInterest_interestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."UserInterest"
    ADD CONSTRAINT "UserInterest_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES public."Interest"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserInterest UserInterest_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."UserInterest"
    ADD CONSTRAINT "UserInterest_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserPrivacy UserPrivacy_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."UserPrivacy"
    ADD CONSTRAINT "UserPrivacy_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserVerification UserVerification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."UserVerification"
    ADD CONSTRAINT "UserVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserVerification UserVerification_verifiedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."UserVerification"
    ADD CONSTRAINT "UserVerification_verifiedBy_fkey" FOREIGN KEY ("verifiedBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_chapterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: csn_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES public."Chapter"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: csn_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO csn_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO csn_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO csn_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO csn_user;


--
-- PostgreSQL database dump complete
--

\unrestrict 0LLKaUcemD2WrYaNAL4hhSGtVW04iEJMXYWRsY8mfFGqfaTbOV8d4cadhNhxNEh

