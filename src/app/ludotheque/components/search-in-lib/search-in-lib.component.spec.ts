import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchInLibComponent} from './search-in-lib.component';

describe('SearchInLibComponent', () => {
  let component: SearchInLibComponent;
  let fixture: ComponentFixture<SearchInLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SearchInLibComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchInLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
