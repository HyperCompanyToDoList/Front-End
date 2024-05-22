import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, map, startWith } from 'rxjs';
import { CompletedTask, Task } from '../../models/task.model';
import { addTask, deleteTask, updateTask } from '../../store/actions/action';
import { selectAllTasks } from '../../store/selectors/task.selectors'
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-completed.task',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './completed.task.component.html',
  styleUrl: './completed.task.component.scss'
})
export class CompletedTaskComponent {
  //kullandığım nesneler ve servisler..
  tasks$: Observable<Task[]>;
  taskTitle: string = '';
  taskDescription: string = '';
  taskId:number =0;
  form: FormGroup;
  titleError$: Observable<string>;
  descriptionError$: Observable<string>;
  isFormValid$: Observable<boolean>;
  editingTask: Task | null = null;
  taskService = inject(TaskService)
  modalService = inject(NgbModal)

    //sayfa build edilirken storedan tasklarımızı alıyoruz//formumuzu build ediyoruz 
  constructor(private store: Store, private fb: FormBuilder) { 
    this.tasks$ = this.store.select(selectAllTasks);
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(8)]]
    });
    
    const titleControl = this.form.get('title');
    const descriptionControl = this.form.get('description');

    this.titleError$ = titleControl!.valueChanges.pipe(
      startWith(''),
      map(() => {
        if (titleControl!.hasError('required')) {
          return 'title is required';
        } else if (titleControl!.hasError('title')) {
          return 'title is empty';
        } else {
          return '';
        }
      })
    );

    this.descriptionError$ = descriptionControl!.valueChanges.pipe(
      startWith(''),
      map(() => {
        if (descriptionControl!.hasError('required')) {
          return 'description is required';
        } else if (descriptionControl!.hasError('minlength')) {
          return 'description must be at least 8 characters long';
        } else {
          return '';
        }
      })
    );

    this.isFormValid$ = this.form.statusChanges.pipe(
      startWith(this.form.status),
      map(status => status === 'VALID')
    );
  }

//verileri api aracılığı ile alıp storumuza kaydediyoruz
  loadTasks() {
    this.taskService.getCompletedTasks().subscribe(tasks => {
      // Gelen görevleri store'a ekleme 
      tasks.forEach(task => this.store.dispatch(addTask({ task })));
    });
  }
  //seçtiğimiz taskın idsini kullanarak delete işlemini tamamlıyoruz
  deleteTask(taskId: number) {
    debugger
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.store.dispatch(deleteTask({ taskId }));
    });
  }
  //editlemek için seçtiğimiz taskın verilerini inputa yazdırıyoruz
  editTask(task: Task) {
    debugger
    this.editingTask = task;
    this.taskTitle = task.title;
    this.taskDescription = task.description;
    this.taskId = task.id

  }
//inputlara gelen verileri değiştirip güncellemeyi tamamlıyoruz
  updateTask() {
    debugger
    if (this.editingTask && this.form.valid) {
      const updatedTask: Task = { ...this.editingTask, title: this.taskTitle, description: this.taskDescription ,id:this.taskId};

      this.taskService.updateTask(updatedTask).subscribe(response => {
        const task:Task = {
          id: response.id,
          title: response.title,
          description: response.description
        };
        this.store.dispatch(updateTask({ task }));
        this.taskTitle = '';
        this.taskDescription = '';
        this.editingTask = null;
      });
    }
  }
  //update işleminde formu tekrar task eklemek için hazır hale getiriyor
  cancelEdit() {
    this.editingTask = null;
    this.taskTitle = '';
    this.taskDescription = '';
  }
  //Modalımızı açıyor
	openSm(content: TemplateRef<any>) {
		this.modalService.open(content, { size: 'sm' });
	}

  addTaskClick(content: TemplateRef<any>){
    this.modalService.open(content, { size: 'lg' });
  }
}
