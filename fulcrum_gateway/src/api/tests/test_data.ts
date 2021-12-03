export let nowDate = new Date()
export let pastDate = new Date(nowDate.setDate(nowDate.getDate() - 1))
export let futureDate = new Date(nowDate.setDate(nowDate.getDate() + 1))

export let user_table = [
  {
    id: "user0",
    name: "Kevin Shen",
    queue_id: "costco_queue1",
    online: true,
    summoned: false,
    phone_number: "4162922346",
    party_size: 1,
    last_online: nowDate,
    index: 1,
    estimated_wait: 3,
    average_wait: 17,
    join_time: pastDate,
    reneged_time: futureDate
  },
  {
    id: "user1",
    name: "Flawnson Tong",
    queue_id: "costco_queue2",
    online: true,
    summoned: false,
    phone_number: "4162922346",
    party_size: 2,
    last_online: nowDate,
    index: 2,
    estimated_wait: 3,
    average_wait: 13,
    join_time: pastDate,
    reneged_time: futureDate
  },
  {
    id: "user2",
    name: "Joe Mama",
    queue_id: "costco_queue2",
    online: true,
    summoned: false,
    phone_number: "911",
    party_size: 2,
    last_online: nowDate,
    index: 3,
    estimated_wait: 420,
    average_wait: 69,
    join_time: pastDate,
    reneged_time: futureDate
  }
];

export let queue_table = [
  {
    id: "costco_queue1",
    name: "Queue1",
    address: "somewhere, someplace",
    state: "ACTIVE",
    create_time: nowDate,
    capacity: 10,
    grace_period: 2,
    max_party_size: 4,
    offline_time: 5,
    enqueued: [
      "user0"
    ],
    serviced: [],
    deferred: [],
    abandoned: [],
    noshows: []
  },
  {
    id: "costco_queue2",
    name: "Queue2",
    address: "somewhere, someplace",
    state: "PAUSED",
    create_time: nowDate,
    capacity: 10,
    grace_period: 2,
    max_party_size: 4,
    offline_time: 5,
    enqueued: [],
    serviced: [
      "user1"
    ],
    deferred: [],
    abandoned: [
      "user2"
    ],
    noshows: []
  }

];

export let organizer_table = [
  {
    id: "costco",
    name: "Costco",
    queues: [
      "costco_queue1",
      "costco_queue2"
    ]
  }
];
