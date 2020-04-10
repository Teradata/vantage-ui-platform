import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CovalentMenuModule } from '@covalent/core/menu';

import { VantageAccountProfileComponent } from './account-profile.component';
import { VantageAccountProfileMenuComponent } from './account-profile-menu/account-profile-menu.component';

describe('VantageAccountProfileComponent', () => {
  let component: VantageAccountProfileComponent;
  let fixture: ComponentFixture<VantageAccountProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VantageAccountProfileComponent, VantageAccountProfileMenuComponent],
      imports: [MatMenuModule, MatIconModule, MatButtonModule, MatListModule, CovalentMenuModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VantageAccountProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
