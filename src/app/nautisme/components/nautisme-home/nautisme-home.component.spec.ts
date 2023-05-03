import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NautismeHomeComponent} from './nautisme-home.component';

describe('NautismeHomeComponent', () => {
  let component: NautismeHomeComponent;
  let fixture: ComponentFixture<NautismeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NautismeHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NautismeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
