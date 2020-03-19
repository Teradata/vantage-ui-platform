import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import { VantageThemeModule } from '../theme/theme.module';

import { VantageAppSwitcherComponent } from './app-switcher.component';

describe('VantageAppSwitcherComponent', () => {
  let component: VantageAppSwitcherComponent;
  let fixture: ComponentFixture<VantageAppSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VantageAppSwitcherComponent],
      imports: [MatMenuModule, MatIconModule, MatButtonModule, MatDividerModule, TranslateModule, VantageThemeModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VantageAppSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
