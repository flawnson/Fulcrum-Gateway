export let user_table = [
  {
    id: "user0",
    name: "Kevin Shen",
    queue_id: "costco_queue1",
    online: true,
    summoned: false,
    phone_number: "4162922346",
    party_size: 1,
    last_online: Date,
    index: 1,
    estimated_wait: 3,
    join_time: Date,
  },
  {
    id: "user1",
    name: "Flawnson Tong",
    queue_id: "costco_queue2",
    online: true,
    summoned: false,
    phone_number: "4162922346",
    party_size: 2,
    last_online: Date,
    index: 2,
    estimated_wait: 3,
    join_time: Date,
  }
];

export let queue_table = [
  {
    id: "costco_queue1",
    name: "Queue1",
    state: "ACTIVE",
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
