--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Ubuntu 12.9-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.9 (Ubuntu 12.9-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: QueueState; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."QueueState" AS ENUM (
    'ACTIVE',
    'PAUSED',
    'INACTIVE'
);


ALTER TYPE public."QueueState" OWNER TO postgres;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ENQUEUED',
    'SERVICED',
    'DEFERRED',
    'ABANDONED',
    'NOSHOW'
);


ALTER TYPE public."UserStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Organizer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Organizer" (
    id integer NOT NULL,
    name text NOT NULL,
    password text
);


ALTER TABLE public."Organizer" OWNER TO postgres;

--
-- Name: Organizer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Organizer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Organizer_id_seq" OWNER TO postgres;

--
-- Name: Organizer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Organizer_id_seq" OWNED BY public."Organizer".id;


--
-- Name: Queue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Queue" (
    id integer NOT NULL,
    organizer_id integer NOT NULL,
    join_code text NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    state public."QueueState" NOT NULL,
    capacity integer NOT NULL,
    max_party_size integer DEFAULT 1 NOT NULL,
    grace_period integer,
    offline_time integer,
    create_time timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Queue" OWNER TO postgres;

--
-- Name: Queue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Queue_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Queue_id_seq" OWNER TO postgres;

--
-- Name: Queue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Queue_id_seq" OWNED BY public."Queue".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    name text NOT NULL,
    queue_id integer NOT NULL,
    summoned boolean DEFAULT false NOT NULL,
    password text,
    phone_number text NOT NULL,
    party_size integer DEFAULT 1 NOT NULL,
    last_online timestamp(3) without time zone,
    index integer NOT NULL,
    estimated_wait integer NOT NULL,
    join_time timestamp(3) without time zone,
    reneged_time timestamp(3) without time zone,
    state public."UserStatus" NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Organizer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Organizer" ALTER COLUMN id SET DEFAULT nextval('public."Organizer_id_seq"'::regclass);


--
-- Name: Queue id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Queue" ALTER COLUMN id SET DEFAULT nextval('public."Queue_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Organizer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Organizer" (id, name, password) FROM stdin;
0	Costco	\N
\.


--
-- Data for Name: Queue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Queue" (id, organizer_id, join_code, name, address, state, capacity, max_party_size, grace_period, offline_time, create_time) FROM stdin;
1	0	11111	Queue1	Denver, Colarado	ACTIVE	5	1	\N	\N	1970-01-01 00:00:00
2	0	22222	Queue2	Toronto, Ontario	ACTIVE	10	1	\N	\N	1970-01-01 00:00:00
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, queue_id, summoned, password, phone_number, party_size, last_online, index, estimated_wait, join_time, reneged_time, state) FROM stdin;
2	Flawnson Tong	2	f	\N	222-222-2222	2	1970-01-01 00:00:00	0	0	1970-01-01 00:00:00	1970-01-01 00:00:00	ENQUEUED
3	Joe Mama	1	f	\N	333-333-3333	2	1970-01-01 00:00:00	3	0	1970-01-01 00:00:00	1970-01-01 00:00:00	ENQUEUED
1	Kevin Shen	1	f	\N	111-111-1111	1	1970-01-01 00:00:00	2	0	1970-01-01 00:00:00	1970-01-01 00:00:00	ENQUEUED
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
ca320d51-4619-4eb1-8713-ffd7b9cee2f7	3e40d4d467fa2473a86c417de9ef0245b4f1c67bbc954a3564f7b9effd8053b6	2021-12-03 14:26:45.064311-05	20211203191712_init	\N	\N	2021-12-03 14:26:45.025859-05	1
cb6be044-8e6f-4633-9301-2b0406f9f61b	0197bb79ab0359d1fddf3891bc6e0ba3cfa629839f82eafd4bd62e28045e3bf4	2021-12-05 17:48:01.32256-05	20211205224801_init	\N	\N	2021-12-05 17:48:01.318042-05	1
\.


--
-- Name: Organizer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Organizer_id_seq"', 1, true);


--
-- Name: Queue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Queue_id_seq"', 3, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 3, true);


--
-- Name: Organizer Organizer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Organizer"
    ADD CONSTRAINT "Organizer_pkey" PRIMARY KEY (id);


--
-- Name: Queue Queue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Queue"
    ADD CONSTRAINT "Queue_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Queue Queue_organizer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Queue"
    ADD CONSTRAINT "Queue_organizer_id_fkey" FOREIGN KEY (organizer_id) REFERENCES public."Organizer"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_queue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_queue_id_fkey" FOREIGN KEY (queue_id) REFERENCES public."Queue"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

