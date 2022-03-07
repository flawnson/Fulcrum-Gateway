import { QueueState, UserStatus } from "@prisma/client";

const nowDate = new Date()
//const pastDate = new Date(nowDate.setDate(nowDate.getDate() - 1))

const pastDate = new Date(nowDate.getTime()-(20*60*1000)); // minus 20 minutes

const futureDate = new Date(nowDate.getTime()+(10*60*1000)) // add 10 minutes to now date
const futureDate2 = new Date(futureDate.getTime()+(20*60*1000)); // add 20 minutes to future date

console.log("Now Date: " + nowDate);
console.log("Past Date: " + pastDate);
console.log("Future Date: " + futureDate);
console.log("Future Date 2: " + futureDate2);

export let user_table = [
  {
    id: "user17",
    name: "Person 17",
    queue_id: "bakery_queue_2",
    phone_number: "49385772365",
    party_size: 1,
    last_online: nowDate,
    index: 0,
    join_time: pastDate,
    summoned: true,
    summoned_time: futureDate,
    finish_time: futureDate2,
    status: UserStatus.SERVICED
  },
  {
    id: "user1",
    name: "Person 1",
    queue_id: "bakery_queue_2",
    summoned: false,
    phone_number: "4167777777",
    party_size: 1,
    last_online: nowDate,
    index: 1,
    join_time: pastDate,
    status: UserStatus.ENQUEUED
  },
  {
    id: "user2",
    name: "Person 2",
    queue_id: "bakery_queue_2",
    summoned: false,
    phone_number: "4163333333",
    party_size: 1,
    last_online: nowDate,
    index: 2,
    join_time: pastDate,
    status: UserStatus.ENQUEUED
  },
  {
    id: "user5",
    name: "Person 5",
    queue_id: "bakery_queue_2",
    summoned: true,
    phone_number: "4161928984",
    party_size: 1,
    last_online: nowDate,
    index: 0,
    join_time: pastDate,
    summoned_time: futureDate,
    finish_time: futureDate2,
    status: UserStatus.SERVICED
  },
  {
    id: "user7",
    name: "Person 7",
    queue_id: "bakery_queue_2",
    summoned: true,
    phone_number: "4442344534123",
    party_size: 1,
    last_online: nowDate,
    index: 0,
    join_time: pastDate,
    summoned_time: futureDate,
    finish_time: futureDate2,
    status: UserStatus.SERVICED
  },
  {
    id: "user11",
    name: "Person 11",
    queue_id: "bakery_queue_2",
    summoned: false,
    phone_number: "1111111111111",
    party_size: 1,
    last_online: nowDate,
    index: 0,
    join_time: pastDate,
    finish_time: futureDate2,
    status: UserStatus.ABANDONED
  },
  {
    id: "user0",
    name: "Person 0",
    queue_id: "bakery_queue_1",
    summoned: false,
    phone_number: "4162922346",
    party_size: 1,
    last_online: nowDate,
    index: 1,
    join_time: pastDate,
    status: UserStatus.ENQUEUED
  },
  {
    id: "user3",
    name: "Person 3",
    queue_id: "bakery_queue_1",
    summoned: false,
    phone_number: "4161010111",
    party_size: 1,
    last_online: nowDate,
    index: 2,
    join_time: pastDate,
    status: UserStatus.ENQUEUED
  },
  {
    id: "user4",
    name: "Person 4",
    queue_id: "bakery_queue_1",
    summoned: false,
    phone_number: "4168762999",
    party_size: 1,
    last_online: nowDate,
    index: 3,
    join_time: pastDate,
    status: UserStatus.ENQUEUED
  },
  {
    id: "user6",
    name: "Person 6",
    queue_id: "bakery_queue_1",
    summoned: true,
    phone_number: "1342344534",
    party_size: 1,
    last_online: nowDate,
    index: 0,
    join_time: pastDate,
    summoned_time: futureDate,
    finish_time: futureDate2,
    status: UserStatus.SERVICED
  },
  {
    id: "user8",
    name: "Person 8",
    queue_id: "bakery_queue_1",
    summoned: true,
    phone_number: "98789476",
    party_size: 1,
    last_online: nowDate,
    index: 0,
    join_time: pastDate,
    summoned_time: futureDate,
    finish_time: futureDate2,
    status: UserStatus.SERVICED
  },
  {
    id: "user9",
    name: "Person 9",
    queue_id: "bakery_queue_1",
    summoned: false,
    phone_number: "98784353425463645",
    party_size: 1,
    last_online: nowDate,
    index: 0,
    join_time: pastDate,
    finish_time: futureDate2,
    status: UserStatus.ABANDONED
  },
  {
    id: "user10",
    name: "Person 10",
    queue_id: "bakery_queue_1",
    summoned: false,
    phone_number: "9832455323645",
    party_size: 1,
    last_online: nowDate,
    index: 0,
    join_time: pastDate,
    finish_time: futureDate2,
    status: UserStatus.ABANDONED
  },
  {
    id: "user18",
    name: "Person 18",
    queue_id: "bakery_queue_1",
    summoned: false,
    phone_number: "0913745345",
    party_size: 1,
    last_online: nowDate,
    index: 4,
    join_time: pastDate,
    status: UserStatus.ENQUEUED
  },
  {
    id: "user19",
    name: "Person 19",
    queue_id: "bakery_queue_1",
    summoned: true,
    phone_number: "10429586234",
    party_size: 1,
    last_online: nowDate,
    index: 0,
    join_time: pastDate,
    summoned_time: futureDate,
    finish_time: futureDate2,
    status: UserStatus.SERVICED
  },
  {
    id: "user20",
    name: "Person 20",
    queue_id: "bakery_queue_1",
    summoned: false,
    phone_number: "0897867564",
    party_size: 1,
    last_online: nowDate,
    index: 5,
    join_time: pastDate,
    status: UserStatus.ENQUEUED
  },
  {
    id: "user12",
    name: "Person 12",
    queue_id: "bakery_queue_3",
    summoned: true,
    phone_number: "1111111222",
    party_size: 1,
    last_online: nowDate,
    index: 0,
    join_time: pastDate,
    summoned_time: futureDate,
    finish_time: futureDate2,
    status: UserStatus.SERVICED
  },
  {
    id: "user13",
    name: "Person 13",
    queue_id: "bakery_queue_3",
    summoned: false,
    phone_number: "4161231233",
    party_size: 1,
    last_online: nowDate,
    index: 1,
    join_time: pastDate,
    status: UserStatus.ENQUEUED
  },
  {
    id: "user14",
    name: "Person 14",
    queue_id: "bakery_queue_3",
    summoned: false,
    phone_number: "34506721823",
    party_size: 1,
    last_online: nowDate,
    index: 2,
    join_time: pastDate,
    status: UserStatus.ENQUEUED
  },
  {
    id: "user15",
    name: "Person 15",
    queue_id: "bakery_queue_3",
    summoned: false,
    phone_number: "1467245843205",
    party_size: 1,
    last_online: nowDate,
    index: 3,
    join_time: pastDate,
    status: UserStatus.ENQUEUED
  }
];


export let queue_table = [
  {
    id: "bakery_queue_1",
    organizer_id: "134huefe234",
    join_code: "123456",
    name: "Cake Line",
    address: "123 Front Street",
    state: QueueState.ACTIVE,
    create_time: nowDate,
    capacity: 10,
    grace_period: 2000,
    max_party_size: 4,
    offline_time: 5,
    password: ""
  },
  {
    id: "bakery_queue_2",
    organizer_id: "134huefe234",
    join_code: "333444",
    name: "Coffee Line",
    address: "123 Front Street",
    state: QueueState.PAUSED,
    create_time: nowDate,
    capacity: 10,
    grace_period: 2000,
    max_party_size: 4,
    offline_time: 5,
    password: ""
  },
  {
    id: "bakery_queue_3",
    organizer_id: "134huefe234",
    join_code: "444777",
    name: "Bagel Line",
    address: "somewhere, someplace",
    state: QueueState.ACTIVE,
    create_time: nowDate,
    capacity: 10,
    grace_period: 2000,
    max_party_size: 4,
    offline_time: 5,
    password: ""
  }
];

export let organizer_table = [
  {
    id: "134huefe234",
    name: "Bob's Bakery",
    email: "test@gmail.com",
    confirmed: true,
    password: ""
  }
];
