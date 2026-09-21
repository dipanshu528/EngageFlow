const allowedTransitions = {
  NOT_STARTED: ["IN_PROGRESS"],

  IN_PROGRESS: [
    "READY_FOR_REVIEW",
    "WAITING_FOR_CLIENT"
  ],

  WAITING_FOR_CLIENT: [
    "IN_PROGRESS"
  ],

  READY_FOR_REVIEW: [
    "COMPLETED",
    "CHANGES_REQUESTED"
  ],

  CHANGES_REQUESTED: [
    "IN_PROGRESS"
  ],

  COMPLETED: []
};

export const isValidTransition = (fromStatus, toStatus) => {
  return allowedTransitions[fromStatus]?.includes(toStatus) || false;
};