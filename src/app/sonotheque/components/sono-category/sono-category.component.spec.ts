import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SonoCategoryComponent} from './sono-category.component';

describe('SonoCategoryComponent', () => {
  let component: SonoCategoryComponent;
  let fixture: ComponentFixture<SonoCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SonoCategoryComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SonoCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
