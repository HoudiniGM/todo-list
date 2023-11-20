import { Component } from '@angular/core';

interface Task {
  title: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})

export class TodoListComponent { 
  tasks: Task[] = [];
  taskTitle: string = '';
  taskDescription: string = '';
  taskColor: string = '#ffffff';
  editingTask: Task | null = null;

  ngOnInit(): void {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }
  }

  addTask(): void {
    if (this.taskTitle && this.taskDescription) {
      if (this.editingTask) {
        const index = this.tasks.indexOf(this.editingTask);
        if (index !== -1) {
          this.tasks[index] = {
            title: this.taskTitle,
            description: this.taskDescription,
            color: this.taskColor
          };
          this.editingTask = null;
        }
      } else {
        this.tasks.push({
          title: this.taskTitle,
          description: this.taskDescription,
          color: this.taskColor
        });
      }

      localStorage.setItem('tasks', JSON.stringify(this.tasks));

      this.taskTitle = '';
      this.taskDescription = '';
      this.taskColor = '#ffffff';
    }
  }

  deleteTask(task: Task): void {
    const index = this.tasks.indexOf(task);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  }

  editTask(task: Task): void {
    this.editingTask = task;
    this.taskTitle = task.title;
    this.taskDescription = task.description;
    this.taskColor = task.color;
  }

  
  // Objetiva reordenar a lista de cards
  dragItem: any;

  onDragStart(event: DragEvent, index: number) {
    this.dragItem = this.tasks[index];
    event.dataTransfer?.setData('text', 'dragging');
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const newIndex = parseInt(target.getAttribute('data-index') || '0', 10);
    
    const currentIndex = this.tasks.indexOf(this.dragItem);
  
    // Remove o item atual da lista
    this.tasks.splice(currentIndex, 1);
  
    // Calcula a posição de soltura e insere o item na posição correta
    const droppedPosition = event.clientY;
    const cards = Array.from(document.querySelectorAll('.card')) as HTMLElement[];
    const cardPositions = cards.map(card => card.getBoundingClientRect().top + card.offsetHeight / 2);
    const closestIndex = cardPositions.findIndex(pos => pos > droppedPosition);
  
    if (closestIndex !== -1) {
      this.tasks.splice(closestIndex, 0, this.dragItem);
    } else {
      this.tasks.push(this.dragItem);
    }
  
    // Atualiza a ordem dos cards no localStorage
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
  //-------------------------------------
}