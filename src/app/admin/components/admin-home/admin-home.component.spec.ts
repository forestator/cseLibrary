import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {AuthentificationService} from '../../../services/firebase/authentification.service';

import {AdminHomeComponent} from './admin-home.component';

describe('AdminHomeComponent', () => {
  let component: AdminHomeComponent;
  let fixture: ComponentFixture<AdminHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AdminHomeComponent],
      providers: [{provide: AuthentificationService, useValue: {currentUser$: of(null)}}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
