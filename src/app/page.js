"use client"

import { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai'
import Todo from './Todo';
import { db } from './firebase';
import { query, collection, onSnapshot, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';

const style = {
  bg: `h-screen w-screen bg-gradient-to-b from-purple-500 to-pink-500 p-10`,
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
  const [editTodo, setEditTodo] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(null)

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
    setEditMode(!editMode)
    if (editTodo.trim() !== '') {
      await updateDoc(doc(db, 'todos', todo.id), {
        text: editTodo
      })
    }
    setEditTodo('')
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
        {editMode && todos.length > 0 &&
          <div className={style.form}>
            <input className={style.input} type='text' placeholder='Edit Todo' value={editTodo} onChange={(e) => setEditTodo(e.target.value)}>
            </input>
          </div>}
      </ul>
      {error && <p className={style.error}>{error}</p>}
      {todos.length > 0 && <p className={style.count}>{`You have ${todos.length} todos.`}</p>}
    </section>
  </main>;
}
