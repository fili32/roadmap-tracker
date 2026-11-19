export interface Topic {
  id: string;
  title: string;
}

export interface Week {
  id: number;
  title: string;
  topics: Topic[];
}

// ids of the topics that has already finished
export type Progress = Record<string, boolean>;
