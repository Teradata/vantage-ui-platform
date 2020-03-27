import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { CovalentMenuModule } from '@covalent/core/menu';

import { VantageThemeModule } from '../../theme/theme.module';

import { VantageAppSwitcherMenuComponent } from './app-switcher-menu.component';

describe('VantageAppSwitcherMenuComponent', () => {
  let component: VantageAppSwitcherMenuComponent;
  let fixture: ComponentFixture<VantageAppSwitcherMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VantageAppSwitcherMenuComponent],
      imports: [
        HttpClientTestingModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        CovalentMenuModule,
        TranslateModule.forRoot(),
        VantageThemeModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    const iconRegistry: MatIconRegistry = TestBed.inject(MatIconRegistry);
    const domSanitizer: DomSanitizer = TestBed.inject(DomSanitizer);

    // Register Teradata icons
    iconRegistry.addSvgIconSetInNamespace(
      'td-logo',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/teradata-logo.svg'),
    );

    fixture = TestBed.createComponent(VantageAppSwitcherMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
