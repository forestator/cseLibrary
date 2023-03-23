import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddGameFormComponent} from './add-game-form.component';

describe('AddGameFormComponent', () => {
  let component: AddGameFormComponent;
  let fixture: ComponentFixture<AddGameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGameFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
