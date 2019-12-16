import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VantageAppIconComponent } from './app-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

describe('VantageAppIconComponent', () => {
  let component: VantageAppIconComponent;
  let fixture: ComponentFixture<VantageAppIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VantageAppIconComponent],
      imports: [TranslateModule.forRoot(), MatIconModule, MatListModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VantageAppIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.matListAvatar = true;

    component.app = {
      app_id: '12345',
      name: 'test',
      icon: 'cancel',
    };
    expect(component).toBeTruthy();
    component.matListAvatar = false;
    component.app = {
      app_id: '12345',
      name: 'test',
      icon: 'https://bitnami.com/assets/stacks/drupal/img/drupal-stack-220x234.png',
    };
    expect(component).toBeTruthy();
  });
});
