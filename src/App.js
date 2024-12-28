import React, { useState, useRef, useEffect } from 'react';
import { Button, TextInput, Modal, Group, Select, Card, Text, ActionIcon } from '@mantine/core';
import { Trash } from 'tabler-icons-react';

function App() {
  const taskTitle = useRef(null);
  const taskSummary = useRef(null);
  const taskDeadline = useRef(null);
  const [tasks, setTasks] = useState([]);
  const [taskState, setTaskState] = useState('Not done');
  const [opened, setOpened] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskSummary, setEditTaskSummary] = useState('');
  const [editTaskState, setEditTaskState] = useState('Not done');
  const [editTaskDeadline, setEditTaskDeadline] = useState('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const saveTasks = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const createTask = () => {
    const newTask = {
      title: taskTitle.current.value,
      summary: taskSummary.current.value,
      state: taskState,
      deadline: taskDeadline.current.value,
    };

    if (!newTask.title || !newTask.summary) {
      alert('Title and Summary are required!');
      return;
    }

    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks, newTask];
      saveTasks(updatedTasks);
      return updatedTasks;
    });

    taskTitle.current.value = '';
    taskSummary.current.value = '';
    taskDeadline.current.value = '';
    setTaskState('Not done');
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const openEditModal = (index) => {
    const task = tasks[index];
    setEditTaskTitle(task.title);
    setEditTaskSummary(task.summary);
    setEditTaskState(task.state);
    setEditTaskDeadline(task.deadline);
    setEditingTaskIndex(index);
    setOpened(true);
  };

  const saveTaskChanges = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editingTaskIndex] = {
      title: editTaskTitle,
      summary: editTaskSummary,
      state: editTaskState,
      deadline: editTaskDeadline,
    };

    if (!editTaskTitle || !editTaskSummary) {
      alert('Title and Summary are required!');
      return;
    }

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setOpened(false);
    setEditingTaskIndex(null);
  };

  const sortTasksByState = (state) => {
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.state === state) return -1;
      if (b.state === state) return 1;
      return 0;
    });
    setTasks(sortedTasks);
  };

  const sortTasksByDeadline = () => {
    const sortedTasks = [...tasks].sort((a, b) => {
      return new Date(a.deadline || '9999-12-31') - new Date(b.deadline || '9999-12-31');
    });
    setTasks(sortedTasks);
  };

  const filterTasks = (state) => {
    const savedTasks = localStorage.getItem('tasks');
    const allTasks = JSON.parse(savedTasks) || [];
    const filteredTasks = allTasks.filter((task) => task.state === state);
    setTasks(filteredTasks);
  };

  return (
    <div>
      <Group>
        <Button onClick={() => sortTasksByState('Done')}>Show 'Done' first</Button>
        <Button onClick={() => sortTasksByState('Doing right now')}>Show 'Doing' first</Button>
        <Button onClick={() => sortTasksByState('Not done')}>Show 'Not done' first</Button>
        <Button onClick={sortTasksByDeadline}>Sort by Deadline</Button>
      </Group>

      <Group>
        <Button onClick={() => filterTasks('Done')}>Show only 'Done'</Button>
        <Button onClick={() => filterTasks('Not done')}>Show only 'Not done'</Button>
        <Button onClick={() => filterTasks('Doing right now')}>Show only 'Doing'</Button>
      </Group>

      <div>
        <TextInput ref={taskTitle} placeholder="Task Title" required label="Title" />
        <TextInput ref={taskSummary} placeholder="Task Summary" label="Summary" />
        <TextInput ref={taskDeadline} type="date" label="Deadline" placeholder="Select a deadline" />
        <Select
          label="State"
          placeholder="Pick one"
          data={['Done', 'Not done', 'Doing right now']}
          value={taskState}
          onChange={setTaskState}
        />
        <Button onClick={createTask}>Add Task</Button>
      </div>

      <div>
        {tasks.map((task, index) => (
          <Card withBorder key={index} mt={"sm"}>
            <Group position={"apart"}>
              <Text weight={"bold"}>{task.title}</Text>
              <Group>
                <ActionIcon onClick={() => openEditModal(index)} color={"blue"}>
                  ✏️
                </ActionIcon>
                <ActionIcon onClick={() => deleteTask(index)} color={"red"}>
                  <Trash />
                </ActionIcon>
              </Group>
            </Group>
            <Text>{task.summary}</Text>
            <Text>State: {task.state}</Text>
            <Text>Deadline: {task.deadline || 'No deadline set'}</Text>
          </Card>
        ))}
      </div>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Edit Task">
        <TextInput
          value={editTaskTitle}
          onChange={(e) => setEditTaskTitle(e.target.value)}
          label="Title"
        />
        <TextInput
          value={editTaskSummary}
          onChange={(e) => setEditTaskSummary(e.target.value)}
          label="Summary"
        />
        <TextInput
          value={editTaskDeadline}
          onChange={(e) => setEditTaskDeadline(e.target.value)}
          type="date"
          label="Deadline"
        />
        <Select
          value={editTaskState}
          onChange={setEditTaskState}
          data={['Done', 'Not done', 'Doing right now']}
          label="State"
        />
        <Button onClick={saveTaskChanges}>Save Changes</Button>
      </Modal>
    </div>
  );
}

export default App;
