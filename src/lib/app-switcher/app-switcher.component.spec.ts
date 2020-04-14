import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { CovalentMenuModule } from '@covalent/core/menu';

import { VantageThemeModule } from '../theme/theme.module';

import { VantageAppSwitcherComponent } from './app-switcher.component';
import { VantageAppSwitcherMenuComponent } from './app-switcher-menu/app-switcher-menu.component';

describe('VantageAppSwitcherComponent', () => {
  let component: VantageAppSwitcherComponent;
  let fixture: ComponentFixture<VantageAppSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VantageAppSwitcherComponent, VantageAppSwitcherMenuComponent],
      imports: [
        HttpClientTestingModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatExpansionModule,
        MatListModule,
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

    fixture = TestBed.createComponent(VantageAppSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
