import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
//http isteklerimizi tek bir servis altında topladım 
//basit bir api kullandığım için url leri bir değişkene atamadım 
  http= inject(HttpClient)

  httpOptions = {
     headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
    //  withCredentials: true, 
     observe: 'response' as 'response'
    };

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>('http://localhost:5124/HyperTask/GettAll');
  }

  addTask(task: Task): Observable<any> {
    return this.http.post<Task>('http://localhost:5124/HyperTask/Add', task);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:5124/HyperTask/Delete?id=${taskId}`);
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>('http://localhost:5124/HyperTask/Update', task);
  }
  SignAsCompleted(taskId: number): Observable<Task> {
    return this.http.put<Task>('http://localhost:5124/HyperTask/SignAsCompleted', taskId);
  }
  getCompletedTasks(): Observable<Task[]> {
    return this.http.get<Task[]>('http://localhost:5124/HyperTask/GetCompletedTasks');
  }
  getUncompletedTasks(): Observable<Task[]> {
    return this.http.get<Task[]>('http://localhost:5124/HyperTask/GetUnCompletedTasks');
  }
}
