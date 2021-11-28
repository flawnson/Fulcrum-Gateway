let nowDate = new Date()
let pastDate = nowDate.setDate(nowDate.getDate() - 1)
let laterDate = nowDate.setDate(nowDate.getDate() + 1)

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
    reneged_time: laterDate
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
    reneged_time: laterDate
  }
];

export let queue_table = [
  {
    id: "costco_queue1",
    name: "Queue1",
    state: "ACTIVE",
    create_time: nowDate,
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
    state: "PAUSED",
    create_time: nowDate,
    enqueued: [],
    serviced: [
      "user1"
    ],
    deferred: [],
    abandoned: [],
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
