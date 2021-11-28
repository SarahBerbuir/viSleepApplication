import React from 'react'
import Todo from './Header'

export default function TodoList({todos}) {
    return (
        
        todos.map(todo =>{
            return <Todo todo={todo}/>
        })
        
    )
}
