import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {UserService} from '../../../services/firebase/user.service';

import {AdminMenuComponent} from './admin-menu.component';

describe('AdminMenuComponent', () => {
  let component: AdminMenuComponent;
  let fixture: ComponentFixture<AdminMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AdminMenuComponent],
      providers: [{provide: UserService, useValue: {userList$: of([]), addUser: () => Promise.resolve()}}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
