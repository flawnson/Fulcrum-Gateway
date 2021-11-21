export const user_table = [
  {
    id: "user0",
    name: "Kevin Shen",
    current_queue: "costco_queue1"
  },
  {
    id: "user1",
    name: "Flawnson Tong",
    current_queue: "costco_queue2"
  }
];

export const queue_table = [
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

export const organizer_table = [
  {
    id: "costco",
    name: "Costco",
    queues: [
      "costco_queue1",
      "costco_queue2"
    ]
  }
];
