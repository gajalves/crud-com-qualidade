type UUID = string;

export interface Todo {
    id: UUID;
    date: string;
    content: string;
    done: boolean;
}
