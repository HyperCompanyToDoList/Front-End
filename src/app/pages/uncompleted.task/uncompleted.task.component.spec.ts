import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UncompletedTaskComponent } from './uncompleted.task.component';

describe('UncompletedTaskComponent', () => {
  let component: UncompletedTaskComponent;
  let fixture: ComponentFixture<UncompletedTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncompletedTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UncompletedTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
