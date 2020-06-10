import { NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

import { CovalentCommonModule } from '@covalent/core/common';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { CovalentMessageModule } from '@covalent/core/message';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { CovalentMediaModule } from '@covalent/core/media';
import { CovalentBreadcrumbsModule } from '@covalent/core/breadcrumbs';
import { CovalentMarkdownNavigatorModule } from '@covalent/markdown-navigator';
import { CovalentHttpModule } from '@covalent/http';

import { VantageUserFeedbackModule } from '@td-vantage/ui-platform/utilities';
import { VantageUserModule } from '@td-vantage/ui-platform/user';
import { VantageAuthenticationModule } from '@td-vantage/ui-platform/auth';
import { VantageAccessModule } from '@td-vantage/ui-platform/access';
import { VantageThemeModule } from '@td-vantage/ui-platform/theme';
import { VantageSQLEModule } from '@td-vantage/ui-platform/sqle';
import { VantageAppSwitcherModule } from '@td-vantage/ui-platform/app-switcher';
import { VantageAccountProfileModule } from '@td-vantage/ui-platform/account-profile';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';

import { appRoutes, appRoutingProviders } from './app.routes';

import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';

import { getSelectedLanguage, getSelectedLocale, createTranslateLoader, SUPPORTED_LANGS } from '../config/translate';
import { TypographyComponent } from './typography/typography.component';
import { MatComponentsComponent, DialogContentComponent } from './mat-components/mat-components.component';
import { DemosComponent } from './demos/demos.component';
import { CovalentComponentsComponent } from './covalent-components/covalent-components.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DialogContentComponent,
    TypographyComponent,
    MatComponentsComponent,
    DemosComponent,
    CovalentComponentsComponent,
  ], // directives, components, and pipes owned by this NgModule
  imports: [
    /** Angular Modules */
    HttpClientModule,
    HttpClientXsrfModule,
    FormsModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    /** Material Modules */
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    /** Covalent Modules */
    CovalentCommonModule,
    CovalentLayoutModule,
    CovalentBreadcrumbsModule,
    CovalentMediaModule,
    CovalentDialogsModule,
    CovalentLoadingModule,
    CovalentMessageModule,
    CovalentMarkdownNavigatorModule,
    TranslateModule.forRoot(),
    CovalentHttpModule.forRoot(),

    VantageUserFeedbackModule,
    VantageUserModule,
    VantageAuthenticationModule,
    VantageAccessModule,
    VantageThemeModule,
    VantageAppSwitcherModule,
    VantageAccountProfileModule,
    VantageSQLEModule,

    appRoutes,
  ], // modules needed to run this module
  providers: [appRoutingProviders],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(translateService: TranslateService) {
    // set the default language
    translateService.setDefaultLang('en');
    translateService.addLangs(SUPPORTED_LANGS);

    // Get selected language and load it
    const selectedLanguage: string = getSelectedLanguage(translateService);

    // using require here so can avoid making an http request ajax to get the language files
    // this prevents the language keys from flashing on the screen for a second before the actual
    // language files are loaded

    /* tslint:disable-next-line */
    const data: any = require('../../assets/i18n/' + selectedLanguage + '.json');
    translateService.setTranslation(selectedLanguage, data, false);
    translateService.use(selectedLanguage);
  }
}
