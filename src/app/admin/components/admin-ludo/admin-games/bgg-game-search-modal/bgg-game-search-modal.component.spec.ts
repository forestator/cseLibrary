import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BggGameSearchModalComponent} from './bgg-game-search-modal.component';

describe('BggGameSearchModalComponent', () => {
  let component: BggGameSearchModalComponent;
  let fixture: ComponentFixture<BggGameSearchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BggGameSearchModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BggGameSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
