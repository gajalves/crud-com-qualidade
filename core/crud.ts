import { Todo } from "domain/todo";
import fs from "fs";
import { v4 as uuid } from "uuid";

const DB_FILE_PATH = "./core/db";
type UUID = string;

export function create(content: string): Todo {
    const todo: Todo = {
        id: uuid(),
        date: new Date().toISOString(),
        content: content,
        done: false,
    };

    const todos: Array<Todo> = [...read(), todo];

    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify(
            {
                todos,
            },
            null,
            2
        )
    );
    return todo;
}

export function read(): Array<Todo> {
    const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const db = JSON.parse(dbString || "{}");
    if (!db.todos) return [];

    return db.todos;
}

function update(id: UUID, partialTodo: Partial<Todo>): Todo {
    let updatedTodo;
    const todos = read();
    todos.forEach((currentTodo) => {
        const isToUpdate = currentTodo.id === id;
        if (isToUpdate) {
            updatedTodo = Object.assign(currentTodo, partialTodo);
        }
    });

    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify(
            {
                todos,
            },
            null,
            2
        )
    );

    if (!updatedTodo) {
        throw new Error("Please, provide another ID!");
    }

    return updatedTodo;
}

export function toggleToDone(id: UUID): Todo {
    let updatedTodo;
    const todos = read();
    todos.forEach((currentTodo) => {
        const isToUpdate = currentTodo.id === id;
        if (isToUpdate) {
            currentTodo.done = currentTodo.done ? false : true;
            updatedTodo = currentTodo;
        }
    });

    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify(
            {
                todos,
            },
            null,
            2
        )
    );
    
    return updatedTodo;
}

export function todoExists(id: string): Boolean {
    const todos = read();
    return todos.some(todo => todo.id === id);
}


function updateContentById(id: UUID, content: string): Todo {
    return update(id, {
        content,
    });
}

export function deleteById(id: UUID): Boolean {
    const todos = read();

    const todosWithoutOne = todos.filter((todo) => {
        if (id === todo.id) {
            return false;
        }
        return true;
    });

    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify(
            {
                todos: todosWithoutOne,
            },
            null,
            2
        )
    );

    return true;
}

function CLEAR_DB() {
    fs.writeFileSync(DB_FILE_PATH, "");
}