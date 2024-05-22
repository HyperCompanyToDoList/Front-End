import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main.layout/main.layout.component';
import { AddTaskComponent } from './pages/add.task/add.task.component';
import { UncompletedTaskComponent } from './pages/uncompleted.task/uncompleted.task.component';
import { CompletedTaskComponent } from './pages/completed.task/completed.task.component';



export const routes: Routes = [
{
    //hangi linkte hangi component gösterilicek düzenliyoruz ve parent-child ilişkisi kuruyoruz
    path:'',
    component:MainLayoutComponent,
    children:[
        {
            path:'',
            component:AddTaskComponent,
            pathMatch:'full'
        },
        {
            path:'UncompletedTasks',
            component:UncompletedTaskComponent,
            pathMatch:'full'
        }
        ,
        {
            path:'CompletedTasks',
            component:CompletedTaskComponent,
            pathMatch:'full'
        }
    ]
}
];
