import React from 'react'

const newTaskContext = React.createContext({

  // task state variables
  taskName: "",
  taskDetails: "",
  priority: "",
  dueDate: "",
  allTasks: [],

  // tab state variable
  activeTab: "TODO",

  // label state variables
  labelName: "",
  labelColor: "#c731de",
  editedLabelText: "",
  editedLabelColor: "",
  allLabels: [],

  // tasks methods
  changeTask: () => {},
  changeTaskDetails: () => {},
  changePriority: () => {},
  changeDueDate: () => {},
  createNewTask: () => {},

  // change tab method
  changeTab: () => {},

  // labels methods
  changeLabelInput: () => {},
  changeLabelColor: () => {},
  createNewLabel: () => {},
  deleteLabel: () => {},
  editLabelText: () => {},
  editLabelColor: () => {},
  editLabel: () => {},
  setEditableLabelData: () => {},
})

export default newTaskContext