import { todoRepository } from "@server/repository/todoRepository";
import { NextApiRequest, NextApiResponse } from "next";

async function get(_: NextApiRequest, res: NextApiResponse) {
  const ALL_TODOS = await todoRepository.get();

  res.status(200).json({
    todos: ALL_TODOS,
  });
}

async function getWithPagination(req: NextApiRequest, res: NextApiResponse) {
    const { limit , page} = req.query;
    const currentPage = page || 1;
    const currentLimit = limit || 2

    const ALL_TODOS = await todoRepository.get();
    const startIndex = (+currentPage - 1) * +currentLimit;
    const endIndex = +currentPage * +currentLimit;
    const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
    const totalPages = Math.ceil(ALL_TODOS.length / +currentLimit);

    res.status(200).json({
      todos: paginatedTodos,
      totalTodos: ALL_TODOS.length,
      currentPage: +currentPage,
      totalPages: totalPages,
    });
}

async function create(req: NextApiRequest, res: NextApiResponse) {
    if(!req.body.content)
        res.status(400).json({message: "Content is required"});

    const createdTodo = await todoRepository.createTodo(req.body.content);
    if(createdTodo)
        res.status(201).json(createdTodo);
}

async function toggleToDone(req: NextApiRequest, res: NextApiResponse) {
    const todoId = req.query.id.toString(); 

    if(!todoId)
        res.status(400).json({message: "ID is required"});

    const todoExists = await todoRepository.todoExistsById(todoId);
    if(!todoExists)
        res.status(400).json({message: "Todo with provided ID not exists!"});

    const updatedTodo = await todoRepository.toggleTodoToDone(todoId);
    res.status(200).json(updatedTodo);
}

async function deleteById(req: NextApiRequest, res: NextApiResponse) {
    const todoId = req.query.id.toString(); 

    if(!todoId)
        res.status(400).json({message: "ID is required"});

    const todoExists = await todoRepository.todoExistsById(todoId);
    if(!todoExists)
        res.status(400).json({message: "Todo with provided ID not exists!"});

    await todoRepository.deleteTodoById(todoId);
    res.status(200).json(true);
}

export const todoController = {
  get, getWithPagination, create, toggleToDone, deleteById
};
