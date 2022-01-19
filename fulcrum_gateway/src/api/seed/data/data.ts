import { QueueState, UserStatus } from "@prisma/client";

const nowDate = new Date()
const pastDate = new Date(nowDate.setDate(nowDate.getDate() - 1))
const futureDate = new Date(nowDate.setDate(nowDate.getDate() + 1))

export let user_table = [
  {
    id: "user0",
    name: "Kevin Shen",
    queue_id: "costco_queue1",
    summoned: false,
    phone_number: "4162922346",
    party_size: 1,
    last_online: nowDate,
    index: 0,
    join_time: pastDate,
    reneged_time: futureDate,
    status: UserStatus.ENQUEUED
  },
  {
    id: "user1",
    name: "Flawnson Tong",
    queue_id: "costco_queue2",
    summoned: false,
    phone_number: "4167777777",
    party_size: 1,
    last_online: nowDate,
    index: 0,
    join_time: pastDate,
    reneged_time: futureDate,
    status: UserStatus.ENQUEUED
  },
  {
    id: "user2",
    name: "Joe Mama",
    queue_id: "costco_queue2",
    summoned: false,
    phone_number: "4163333333",
    party_size: 1,
    last_online: nowDate,
    index: 1,
    join_time: pastDate,
    reneged_time: futureDate,
    status: UserStatus.ENQUEUED
  },
  {
    id: "user3",
    name: "Funny name",
    queue_id: "costco_queue1",
    summoned: false,
    phone_number: "4161010111",
    party_size: 1,
    last_online: nowDate,
    index: 1,
    join_time: pastDate,
    reneged_time: futureDate,
    status: UserStatus.ENQUEUED
  },
  {
    id: "user4",
    name: "Joe Biden",
    queue_id: "costco_queue1",
    summoned: false,
    phone_number: "4168762999",
    party_size: 1,
    last_online: nowDate,
    index: 2,
    join_time: pastDate,
    reneged_time: futureDate,
    status: UserStatus.ENQUEUED
  },
  {
    id: "user5",
    name: "Tawnson Flong",
    queue_id: "costco_queue2",
    summoned: true,
    phone_number: "4161928984",
    party_size: 1,
    last_online: nowDate,
    index: 0,
    join_time: pastDate,
    summoned_time: nowDate,
    total_wait: parseInt("" + ((nowDate.valueOf() - pastDate.valueOf()) / 1000)),
    status: UserStatus.SERVICED
  },
  {
    id: "user6",
    name: "Shevin Ken",
    queue_id: "costco_queue1",
    summoned: true,
    phone_number: "1342344534",
    party_size: 1,
    last_online: nowDate,
    index: 3,
    join_time: pastDate,
    summoned_time: nowDate,
    total_wait: parseInt("" + ((nowDate.valueOf() - pastDate.valueOf()) / 1000)),
    status: UserStatus.SERVICED
  },
  {
    id: "user7",
    name: "Donald Trump",
    queue_id: "costco_queue2",
    summoned: true,
    phone_number: "4442344534123",
    party_size: 1,
    last_online: nowDate,
    index: 0,
    join_time: pastDate,
    summoned_time: nowDate,
    total_wait: parseInt("" + ((nowDate.valueOf() - pastDate.valueOf()) / 1000)),
    status: UserStatus.SERVICED
  },
  {
    id: "user8",
    name: "Jon Snow",
    queue_id: "costco_queue1",
    summoned: true,
    phone_number: "98789476",
    party_size: 1,
    last_online: nowDate,
    index: 4,
    join_time: pastDate,
    summoned_time: nowDate,
    total_wait: parseInt("" + ((nowDate.valueOf() - pastDate.valueOf()) / 1000)),
    status: UserStatus.SERVICED
  },
  {
    id: "user9",
    name: "Costco Thief",
    queue_id: "costco_queue1",
    phone_number: "98784353425463645",
    party_size: 1,
    last_online: nowDate,
    index: 5,
    join_time: pastDate,
    total_wait: parseInt("" + ((nowDate.valueOf() - pastDate.valueOf()) / 1000)),
    status: UserStatus.ABANDONED
  },
  {
    id: "user10",
    name: "Anti Masker",
    queue_id: "costco_queue1",
    phone_number: "9832455323645",
    party_size: 1,
    last_online: nowDate,
    index: 6,
    join_time: pastDate,
    total_wait: parseInt("" + ((nowDate.valueOf() - pastDate.valueOf()) / 1000)),
    status: UserStatus.ABANDONED
  },
  {
    id: "user11",
    name: "Nikhil Budathoki",
    queue_id: "costco_queue2",
    phone_number: "1111111111111",
    party_size: 1,
    last_online: nowDate,
    index: 0,
    join_time: pastDate,
    total_wait: parseInt("" + ((nowDate.valueOf() - pastDate.valueOf()) / 1000)),
    status: UserStatus.ABANDONED
  },
  {
    id: "user12",
    name: "A",
    queue_id: "costco_queue3",
    phone_number: "1111111222",
    party_size: 1,
    last_online: nowDate,
    index: 0,
    join_time: pastDate,
    total_wait: 5000,
    status: UserStatus.SERVICED
  },
  {
    id: "user13",
    name: "B",
    queue_id: "costco_queue3",
    summoned: false,
    phone_number: "4161231233",
    party_size: 1,
    last_online: nowDate,
    index: 1,
    join_time: pastDate,
    reneged_time: futureDate,
    status: UserStatus.ENQUEUED
  },
  {
    id: "user14",
    name: "C",
    queue_id: "costco_queue3",
    summoned: false,
    phone_number: "12324687632423",
    party_size: 1,
    last_online: nowDate,
    index: 2,
    join_time: pastDate,
    reneged_time: futureDate,
    status: UserStatus.ENQUEUED
  },
  {
    id: "user15",
    name: "D",
    queue_id: "costco_queue3",
    summoned: false,
    phone_number: "1232462141423",
    party_size: 1,
    last_online: nowDate,
    index: 3,
    join_time: pastDate,
    reneged_time: futureDate,
    status: UserStatus.ENQUEUED
  },
  {
    id: "user16",
    name: "E",
    queue_id: "costco_queue5",
    summoned: false,
    phone_number: "123241423",
    party_size: 1,
    last_online: nowDate,
    index: 3,
    join_time: pastDate,
    reneged_time: futureDate,
    status: UserStatus.ENQUEUED
  }


];


export let queue_table = [
  {
    id: "costco_queue1",
    organizer_id: "costco_toronto",
    join_code: "123abc",
    name: "Queue1",
    address: "somewhere, someplace",
    state: QueueState.ACTIVE,
    create_time: nowDate,
    capacity: 10,
    grace_period: 2000,
    max_party_size: 4,
    offline_time: 5,
    password: ""
  },
  {
    id: "costco_queue2",
    organizer_id: "costco_toronto",
    join_code: "333444",
    name: "Queue2",
    address: "somewhere, someplace",
    state: QueueState.PAUSED,
    create_time: nowDate,
    capacity: 10,
    grace_period: 2000,
    max_party_size: 4,
    offline_time: 5,
    password: ""
  },
  {
    id: "costco_queue3",
    organizer_id: "costco_toronto",
    join_code: "a4e35t",
    name: "Queue3",
    address: "somewhere, someplace",
    state: QueueState.ACTIVE,
    create_time: nowDate,
    capacity: 10,
    grace_period: 2000,
    max_party_size: 4,
    offline_time: 5,
    password: ""
  },
  {
    id: "costco_queue4",
    organizer_id: "costco_toronto",
    join_code: "678iuy",
    name: "Queue4",
    address: "somewhere, someplace",
    state: QueueState.ACTIVE,
    create_time: nowDate,
    capacity: 10,
    grace_period: 2000,
    max_party_size: 4,
    offline_time: 5,
    password: ""
  },
  {
    id: "costco_queue5",
    organizer_id: "costco_toronto",
    join_code: "456234",
    name: "Queue5",
    address: "somewhere, someplace",
    state: QueueState.ACTIVE,
    create_time: nowDate,
    capacity: 10,
    grace_period: 2000,
    max_party_size: 4,
    offline_time: 5,
    password: ""
  },
];

export let organizer_table = [
  {
    id: "costco_toronto",
    name: "Costco In Toronto",
    email: "test@gmail.com",
    confirmed: true,
    password: ""
  }
];
