import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MaterielPhotoHomeComponent} from './materiel-photo-home.component';

describe('NautismeHomeComponent', () => {
  let component: MaterielPhotoHomeComponent;
  let fixture: ComponentFixture<MaterielPhotoHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MaterielPhotoHomeComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(MaterielPhotoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
