import { read, create, toggleToDone, todoExists, deleteById} from "@db-crud-todo";
import { Todo } from "domain/todo";

async function get() {
    return read();
}

async function createTodo(content: string) : Promise<Todo>{
    return create(content);
}

async function toggleTodoToDone(id: string) : Promise<Todo>{
    return toggleToDone(id);
}

async function todoExistsById(id: string) : Promise<Boolean>{
    return todoExists(id);
}

async function deleteTodoById(id: string) : Promise<Boolean>{
    return deleteById(id);
}

export const todoRepository = {
    get, createTodo, toggleTodoToDone, todoExistsById, deleteTodoById
}
