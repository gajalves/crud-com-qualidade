import { todoService } from "@ui/services/todo";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { Todo } from "domain/todo";
import React from "react";

const bg = "https://mariosouto.com/cursos/crudcomqualidade/bg";

export default function Page() {
    const [alreadyLoad, setAlreadyLoad] = React.useState(false);
    const [todos, setTodos] = React.useState<Todo[]>([]);
    const [page, setPage] = React.useState<number>(1);
    const [totalPages, setTotalPages] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchTodo, setSearchTodo] = React.useState("");
    const [newTodoContent, setNewTodoContent] = React.useState("");

    const hasMorePages = totalPages > page;
    const hasNoTodos = todos.length === 0;

    const homeTodos = todos.filter((todo) =>
        todo.content
            .toLocaleLowerCase()
            .includes(searchTodo.toLocaleLowerCase())
    );

    React.useEffect(() => {
        if (!alreadyLoad) {
            setAlreadyLoad(true);
            todoService
                .getTodoWithPagination({ page, limit: 2 })
                .then((todosResponse) => {
                    setTodos(todosResponse.todos);
                    setTotalPages(todosResponse.totalPages);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, []);

    return (
        <main>
            <GlobalStyles />
            <header
                style={{
                    backgroundImage: `url('${bg}')`,
                }}
            >
                <div className="typewriter">
                    <h1>O que fazer hoje?</h1>
                </div>
                <form
                    onSubmit={async (event) => {
                        event.preventDefault();
                        if (newTodoContent) {
                            const newTodo = await todoService.create({
                                content: newTodoContent,
                            });
                            setTodos((todos) => {
                                return [...todos, newTodo];
                            });
                        }
                    }}
                >
                    <input
                        name="add-todo"
                        type="text"
                        placeholder="Correr, Estudar..."
                        onChange={function newTodoHandler(event) {
                            setNewTodoContent(event.target.value);
                        }}
                    />
                    <button
                        type="submit"
                        aria-label="Adicionar novo item"
                        data-type="add"
                    >
                        +
                    </button>
                </form>
            </header>

            <section>
                <form>
                    <input
                        type="text"
                        placeholder="Filtrar lista atual, ex: Dentista"
                        onChange={function handleSearch(event) {
                            setSearchTodo(event.target.value);
                        }}
                    />
                </form>

                <table border={1}>
                    <thead>
                        <tr>
                            <th align="left">
                                <input type="checkbox" disabled />
                            </th>
                            <th align="left">Id</th>
                            <th align="left">Conteúdo</th>
                            <th />
                        </tr>
                    </thead>

                    <tbody>
                        {homeTodos.map((todo) => {
                            return (
                                <tr key={todo.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            onChange={() => {
                                                todoService.toggleDone(todo.id);
                                            }}
                                            defaultChecked={todo.done}
                                        />
                                    </td>
                                    <td>{todo.id.substring(0, 5)}</td>
                                    <td>{todo.content}</td>
                                    <td align="right">
                                        <button
                                            data-type="delete"
                                            onClick={() =>
                                                todoService
                                                    .deleteById(todo.id)
                                                    .then((todosResponse) => {
                                                        setTodos(
                                                            (currentTodos) => {
                                                                return currentTodos.filter(
                                                                    (
                                                                        current
                                                                    ) => {
                                                                        return (
                                                                            current.id !==
                                                                            todo.id
                                                                        );
                                                                    }
                                                                );
                                                            }
                                                        );
                                                    })
                                            }
                                        >
                                            Apagar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                        {isLoading && (
                            <tr>
                                <td
                                    colSpan={4}
                                    align="center"
                                    style={{ textAlign: "center" }}
                                >
                                    Carregando...
                                </td>
                            </tr>
                        )}

                        {hasNoTodos && (
                            <tr>
                                <td colSpan={4} align="center">
                                    Nenhum item encontrado.
                                </td>
                            </tr>
                        )}

                        {hasMorePages && (
                            <tr>
                                <td
                                    colSpan={4}
                                    align="center"
                                    style={{ textAlign: "center" }}
                                >
                                    <button
                                        data-type="load-more"
                                        onClick={() => {
                                            setIsLoading(true);
                                            const nextPage = page + 1;
                                            setPage(nextPage);
                                            todoService
                                                .getTodoWithPagination({
                                                    page: nextPage,
                                                    limit: 2,
                                                })
                                                .then((todosResponse) => {
                                                    setTodos((oldTodos) => {
                                                        return [
                                                            ...oldTodos,
                                                            ...todosResponse.todos,
                                                        ];
                                                    });
                                                    setTotalPages(
                                                        todosResponse.totalPages
                                                    );
                                                })
                                                .finally(() => {
                                                    setIsLoading(false);
                                                });
                                        }}
                                    >
                                        Pagina {page}, Carregar mais{" "}
                                        <span
                                            style={{
                                                display: "inline-block",
                                                marginLeft: "4px",
                                                fontSize: "1.2em",
                                            }}
                                        >
                                            ↓
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </main>
    );
}
