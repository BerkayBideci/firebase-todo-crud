"use client"

import { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai'
import { BsCloudUpload } from 'react-icons/bs'
import { MdOutlineFileDownloadDone } from 'react-icons/md'
import { ImCancelCircle } from 'react-icons/im'
import Todo from './Todo';
import { db } from './firebase';
import { query, collection, onSnapshot, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';

const style = {
  bg: `p-10`,
  container: `bg-violet-50 max-w-[50rem] w-full mx-auto rounded-xl shadow-xl p-5`,
  heading: `text-4xl font-bold text-center p-2 text-violet-950 mb-2`,
  form: `flex justify-between`,
  input: `border p-2 w-full text-xl focus:outline-violet-400`,
  button: `border p-4 ml-2 bg-violet-400 text-violet-800 hover:bg-violet-800 hover:text-violet-400`,
  error: `text-center text-lg font-semibold py-2 text-pink-700`,
  count: `text-center text-lg font-semibold py-2`
};

export default function Home() {
  const [todos, setTodos] = useState([])
  const [selectedTodoId, setSelectedTodoId] = useState(null)
  const [editTodo, setEditTodo] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false);

  // Create
  const handleCreateTodo = async (e) => {
    e.preventDefault()
    if (input.trim() !== '') {
      await addDoc(collection(db, 'todos'), {
        text: input,
        completed: false
      })
    } else {
      setError('Field can\'t be empty!')
      setTimeout(() => {
        setError(null)
      }, 3500)
    }
    setInput('')
  }

  // Read
  useEffect(() => {
    const q = query(collection(db, 'todos'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = []
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id })
      })
      setTodos(todosArr)
    })
    return () => unsubscribe()
  }, [])

  // Update
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, 'todos', todo.id), {
      completed: !todo.completed
    })
  }

  const handleEditTodo = async (todo) => {
    setEditMode(true)
    setSelectedTodoId(todo.id)
  }

  const handleDisableEditTodo = () => {
    setEditMode(false)
    setEditTodo('');
    setSelectedTodoId(null)
  }

  const handleSaveEditTodo = async () => {
    const todo = todos.find((todo) => todo.id === selectedTodoId);
    if (editTodo.trim() !== '') {
      setIsLoading(true)
      await updateDoc(doc(db, 'todos', todo.id), {
        text: editTodo
      })
      setEditMode(false);
      setEditTodo('');
      setSelectedTodoId(null);
      setIsLoading(false)
    } else {
      setError('Edit field can\'t be empty!')
      setTimeout(() => {
        setError(null)
      }, 3500)
    }
  }

  // Delete
  const handleDeleteTodo = async (id) => {
    await deleteDoc(doc(db, 'todos', id))
  }

  return <main className={style.bg}>
    <section className={style.container}>
      <h1 className={style.heading}>Todo App</h1>
      <form className={style.form} onSubmit={handleCreateTodo}>
        <input
          className={style.input}
          type="text"
          placeholder="Add Todo"
          value={input}
          onChange={(e) => setInput(e.target.value)}>
        </input>
        <button className={style.button}><AiOutlinePlus size={30} /></button>
      </form>
      <ul>
        {todos.map((todo, index) => <Todo key={index} todo={todo} toggleComplete={toggleComplete} handleDeleteTodo={handleDeleteTodo} handleEditTodo={handleEditTodo} />)}
        {editMode && selectedTodoId && todos.length > 0 &&
          <div className={style.form}>
            <input className={style.input} type='text' placeholder='Edit Todo' value={editTodo} onChange={(e) => setEditTodo(e.target.value)}>
            </input>
            {isLoading ? <button className={style.button}><BsCloudUpload size={30} /></button> : <button className={style.button}><MdOutlineFileDownloadDone size={30} onClick={handleSaveEditTodo} /></button>}
            <button className={style.button} onClick={handleDisableEditTodo}><ImCancelCircle size={30} /></button>
          </div>}
      </ul>
      {error && <p className={style.error}>{error}</p>}
      {todos.length > 0 && <p className={style.count}>{`You have ${todos.length} todos.`}</p>}
    </section>
  </main>;
}
