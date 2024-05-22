import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, map, startWith } from 'rxjs';
import { CompletedTask, Task } from '../../models/task.model';
import { addTask, deleteTask, setTasks, updateTask } from '../../store/actions/action';
import { selectAllTasks } from '../../store/selectors/task.selectors'
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add.task',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add.task.component.html',
  styleUrl: './add.task.component.scss'
})
export class AddTaskComponent implements OnInit {
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
//sayfa açıldığı anda veriler ekrana yazılıyor
  ngOnInit(): void {
    this.loadTasks();
  }
//verileri api aracılığı ile alıp storumuza kaydediyoruz
  loadTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      // Gelen görevleri store'a ekleme 
      this.store.dispatch(setTasks({ tasks }));
     // tasks.forEach(task => this.store.dispatch(addTask({ task })));
    });
  }
  //formumuzun validasyonlarını tamamlayıp hem databaseye hemde gözlemlenebilir nesnemize task kaydımızı yapıyoruz
  addTask() {
    if (this.form.valid) {
      const newTask: Task = {
        id: 0,
        title: this.taskTitle,
        description: this.taskDescription
      };
      this.taskService.addTask(newTask).subscribe(response => {
        const task:Task = {
          id: response.id,
          title: response.title,
          description: response.description
        };
        this.store.dispatch(addTask({ task }));
        this.taskTitle = '';
        this.taskDescription = '';    
      });
    }
  }
  //seçtiğimiz taskın idsini kullanarak delete işlemini tamamlıyoruz
  deleteTask(taskId: number) {
  
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.store.dispatch(deleteTask({ taskId }));
    });
  }
    //editlemek için seçtiğimiz taskın verilerini inputa yazdırıyoruz
  editTask(task: Task) {

    this.editingTask = task;
    this.taskTitle = task.title;
    this.taskDescription = task.description;
    this.taskId = task.id

  }
  //taskımızın idsini kullanarak back-endde isCompeted kısmını truya çeviriyoruz ve listeden silip completed sekmesinde çağırdığımızda gelmesini sağlıyoruz
  completeTask(taskId: number){
    this.taskService.SignAsCompleted(taskId).subscribe(()=>{
      this.store.dispatch(deleteTask({ taskId }));
    })
  }
  //inputlara gelen verileri değiştirip güncellemeyi tamamlıyoruz
  updateTask() {
  
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