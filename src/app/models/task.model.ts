export interface Task {
    id: number;
    title: string;
    description: string;
  }
  export interface CompletedTask {
    id: number;
    title: string;
    description: string;
    isCompleted:boolean;
  }