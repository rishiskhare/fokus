import React from "react";
import { useState, useEffect, useRef } from "react";
import "./Todo.css";
import "./itemadd.scss";
import "./delEdit.scss"

const Todo = () => {
  const [items, setItems] = useState([]);
  const [editMode, setEditMode] = useState([false, -1]);
  useEffect(() => {
    const prevItems = window.localStorage.getItem("todo_items");
    if (prevItems != null) {
      setItems(JSON.parse(prevItems));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("todo_items", JSON.stringify(items));
  }, [items]);

  const changeItems = (e) => {
    console.log("chaningItems");
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      if (editMode[0]) {
        console.log("editMode");
        editTask(editMode[1], e.target.value);
      } else {
        console.log("setItems");
        setItems([...items, [e.target.value, false]])
      }
    }
  }

  const updateStatus = (ind) => {
    let nItems = [...items];
    nItems[ind] = [nItems[ind][0], !nItems[ind][1]];
    setItems(nItems);
    window.localStorage.setItem("todo_items", JSON.stringify(items));
  }

  const editTask = (ind, value) => {
    console.log("editTask");
    let nItems = [...items];
    nItems[ind] = [value, nItems[ind][1]];
    setItems(nItems);
    setEditMode(false, "", -1)
    window.localStorage.setItem("todo_items", JSON.stringify(items));
  }

  const deleteTask = (ind) => {
    console.log("editTask");
    let nItems = [...items];
    nItems.splice(ind, 1);
    setItems(nItems);
  }

  return (
    <div className="main-bod">
      <div class="form__group field">
        <input onKeyUp={changeItems} type="text" class="form__field" placeholder="Name" name="name" id='name' />
        <label for="name" class="form__label">Task</label>
      </div>
      <ul> 
        {items.map((item, i) => {
          let completed = (item[1] === true) ? "completed" : "";
          return (
            <li className="task" key={i} style={{background:"#fa7d23", padding: "5px", margin: "5px 0"}}>
                            <label for={i}>
                                <input onClick={(e) => updateStatus(i)} type="checkbox" id={`${i}, ${i}`} className="notInline"/>
                                <p className={`${completed} notInline`}>{item[0]}</p>
                            </label>
                            {/* <div class='wrapper'>
                              <input class='dot-menu__checkbox' id='dot-menu' type='checkbox'/>
                              <label class='dot-menu__label' for='dot-menu'>
                                <span>Menu</span>
                              </label>
                            </div> */}

                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul className="task-menu" style={{color: "white"}}>
                                    <li onClick={(e) => setEditMode([!editMode[0], i])}>Edit</li>
                                    <li onClick={(e) => deleteTask(i)}>Delete</li>
                                </ul>
                            </div>
          </li>
          );
        })} 
      </ul>
    </div>
  );
};

export default Todo;
