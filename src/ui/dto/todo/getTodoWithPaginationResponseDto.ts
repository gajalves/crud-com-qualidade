import { Todo } from "domain/todo";

export interface getTodoWithPaginationResponseDto {
    todos: Todo[];
    totalTodos: number;
    currentPage: number;
    totalPages: number;
}
