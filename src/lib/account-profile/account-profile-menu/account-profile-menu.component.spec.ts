import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CovalentMenuModule } from '@covalent/core/menu';

import { VantageAccountProfileMenuComponent } from './account-profile-menu.component';

describe('VantageAccountProfileMenuComponent', () => {
  let component: VantageAccountProfileMenuComponent;
  let fixture: ComponentFixture<VantageAccountProfileMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VantageAccountProfileMenuComponent],
      imports: [MatIconModule, MatListModule, CovalentMenuModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VantageAccountProfileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.email = 'daffy.duck@teradata.com';
    component.name = 'Daffy Duck';
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should block out click event on header click', () => {
    const mouseEvent: MouseEvent = new MouseEvent("click",{bubbles: true, cancelable: true});

    spyOn(mouseEvent, 'preventDefault');
    spyOn(mouseEvent, 'stopPropagation');

    component._blockEvent(mouseEvent);
    fixture.detectChanges();

    expect(mouseEvent.preventDefault).toHaveBeenCalled();
    expect(mouseEvent.stopPropagation).toHaveBeenCalled();
  });
});
