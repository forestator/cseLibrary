import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BadgeComponent} from './badge.component';

describe('BadgeComponent', () => {
  let fixture: ComponentFixture<BadgeComponent>;

  const render = async (status?: string): Promise<HTMLElement> => {
    fixture.componentRef.setInput('status', status);
    await fixture.whenStable();
    return fixture.nativeElement;
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeComponent);
  });

  it('labels book statuses', async () => {
    expect((await render('AVAILABLE')).textContent).toContain('DISPONIBLE');
  });

  it('labels catalogue statuses', async () => {
    expect((await render('REPARATION')).textContent).toContain('EN RÉPARATION');
  });

  it('capitalizes board game categories', async () => {
    expect((await render('duo')).textContent).toContain('Duo');
  });

  it('falls back to the raw value on a neutral tone', async () => {
    const element = await render('SOMETHING');
    expect(element.querySelector('.badge-gray')?.textContent).toContain('SOMETHING');
  });

  it('renders nothing without a status', async () => {
    expect((await render(undefined)).querySelector('.badge')).toBeNull();
  });
});
