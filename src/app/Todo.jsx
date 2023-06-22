import React from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";

const style = {
    li: `flex justify-between bg-violet-200 p-5 my-2 capitalize`,
    liComplete: `flex justify-between bg-violet-400 p-5 my-2 capitalize`,
    row: `flex`,
    checkbox: `accent-violet-800`,
    text: `ml-2 cursor-pointer`,
    textComplete: `ml-2 cursor-pointer line-through`,
    button: `cursor-pointer flex items-center ms-2`,
};

const Todo = ({ todo, toggleComplete, handleDeleteTodo, handleEditTodo }) => {
    return (
        <li className={todo.completed ? style.liComplete : style.li}>
            <div className={style.row}>
                <input
                    type="checkbox"
                    checked={todo.completed ? "checked" : ""}
                    className={style.checkbox}
                    onChange={() => toggleComplete(todo)}
                />
                <p
                    className={todo.completed ? style.textComplete : style.text}
                    onClick={() => toggleComplete(todo)}
                >
                    {todo.text}
                </p>
            </div>
            <div className={style.row}>
                <button
                    onClick={() => handleEditTodo(todo)}
                    className={style.button}
                >
                    <FaEdit />
                </button>
                <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className={style.button}
                >
                    <FaRegTrashAlt />
                </button>
            </div>
        </li>
    );
};

export default Todo;
