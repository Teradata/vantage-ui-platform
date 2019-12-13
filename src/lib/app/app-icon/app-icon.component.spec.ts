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
  });
});
