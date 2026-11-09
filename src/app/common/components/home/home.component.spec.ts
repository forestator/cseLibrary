import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {provideRouter} from '@angular/router';
import {AuthentificationService} from '../../../services/firebase/authentification.service';

import {HomeComponent} from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [HomeComponent],
      providers: [provideRouter([]), {provide: AuthentificationService, useValue: {isUserSuperAdmin: of(false), isUserLudoAdmin$: of(false), isUserBricolageAdmin$: of(false), isUserSonoAdmin$: of(false), isUserNautismeAdmin$: of(false), currentUser$: of(null)}}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
