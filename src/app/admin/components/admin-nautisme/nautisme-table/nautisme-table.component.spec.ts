import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NautismeTableComponent} from './nautisme-table.component';

describe('NautismeTableComponent', () => {
  let component: NautismeTableComponent;
  let fixture: ComponentFixture<NautismeTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NautismeTableComponent]
    });
    fixture = TestBed.createComponent(NautismeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
