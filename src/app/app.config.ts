import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { taskReducer } from './store/reducers/task.reducer';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  //proje ayarlarımızı yaptığımız kısım 
  providers: [provideRouter(routes),  provideStore({ tasks: taskReducer }),provideEffects([]),
    provideStoreDevtools({maxAge: 25}),provideHttpClient()
  ]
};
