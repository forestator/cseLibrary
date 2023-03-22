import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddGameModalComponent} from './add-game-modal.component';

describe('AddGameModalComponent', () => {
  let component: AddGameModalComponent;
  let fixture: ComponentFixture<AddGameModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGameModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
