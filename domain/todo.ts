import { v4 as uuid } from "uuid";

type UUID = string;

export interface Todo {
    id: UUID;
    date: string;
    content: string;
    done: boolean;
}

