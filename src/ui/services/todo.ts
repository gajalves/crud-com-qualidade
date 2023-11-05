import { CreateTodoDto } from "@ui/dto/todo/createTodoDto";
import { GetTodoWithPaginationDto } from "@ui/dto/todo/getTodoWithPaginationDto";
import { getTodoWithPaginationResponseDto } from "@ui/dto/todo/getTodoWithPaginationResponseDto";
import { Todo } from "domain/todo";

async function get(): Promise<Todo[]> {
    return fetch("/api/todos").then(async (response) => {
        if (response.ok) {
            const todosText = await response.text();
            return JSON.parse(todosText).todos;
        }
    });
}

async function getTodoWithPagination({
    page,
    limit,
}: GetTodoWithPaginationDto): Promise<getTodoWithPaginationResponseDto> {
    return fetch(`api/todospagination?page=${page}&limit=${limit}`).then(
        async (response) => {
            if (response.ok) {
                const responseText = await response.text();
                return JSON.parse(responseText);
            }
        }
    );
}

async function create(payload: CreateTodoDto): Promise<Todo> {
    return fetch("api/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: payload.content,
        }),
    }).then(async (response) => {
        const responseText = await response.text();
        return JSON.parse(responseText);
    });
}

async function toggleDone(todoId: string): Promise<Todo> {
    return fetch(`api/todos/${todoId}/toggle-done`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(async (response) => {
        const responseText = await response.text();
        return JSON.parse(responseText);
    });
}

async function deleteById(todoId: string): Promise<Todo> {
    return fetch(`api/todos/${todoId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(async (response) => {
        const responseText = await response.text();
        return JSON.parse(responseText);
    });
}

export const todoService = {
    get,
    getTodoWithPagination,
    create,
    toggleDone,
    deleteById,
};
