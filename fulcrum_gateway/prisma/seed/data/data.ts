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
    index: 1,
    join_time: pastDate,
    reneged_time: futureDate,
    status: UserStatus.ENQUEUED,
    total_wait: 1000
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
    status: UserStatus.SERVICED,
    total_wait: 700
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
    status: UserStatus.ENQUEUED,
    total_wait: 800
  },
  {
    id: "user3",
    name: "Funny name",
    queue_id: "costco_queue1",
    summoned: false,
    phone_number: "4161010111",
    party_size: 1,
    last_online: nowDate,
    index: 2,
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
    join_code: "123456",
    name: "Queue1",
    address: "somewhere, someplace",
    state: QueueState.ACTIVE,
    create_time: nowDate,
    capacity: 10,
    grace_period: 2,
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
    grace_period: 2,
    max_party_size: 4,
    offline_time: 5,
    password: ""
  }
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
