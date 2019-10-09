import { NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';

import { CovalentCommonModule } from '@covalent/core/common';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { CovalentMessageModule } from '@covalent/core/message';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { CovalentMediaModule } from '@covalent/core/media';

import { CovalentHttpModule } from '@covalent/http';

import { VantageUserFeedbackModule } from '@td-vantage/ui-platform/utilities';
import { VantageUserModule } from '@td-vantage/ui-platform/user';
import { VantageAuthenticationModule } from '@td-vantage/ui-platform/auth';
import { VantageAccessModule } from '@td-vantage/ui-platform/access';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';

import { appRoutes, appRoutingProviders } from './app.routes';

import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';

import { getSelectedLanguage, getSelectedLocale, createTranslateLoader, SUPPORTED_LANGS } from '../config/translate';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
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
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSnackBarModule,
    MatListModule,
    /** Covalent Modules */
    CovalentCommonModule,
    CovalentLayoutModule,
    CovalentMediaModule,
    CovalentDialogsModule,
    CovalentLoadingModule,
    CovalentMessageModule,
    TranslateModule.forRoot(),
    CovalentHttpModule.forRoot(),

    VantageUserFeedbackModule,
    VantageUserModule,
    VantageAuthenticationModule,
    VantageAccessModule,

    appRoutes,
  ], // modules needed to run this module
  providers: [
    appRoutingProviders,
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule {
  constructor(translateService: TranslateService) {

    // set the default language
    translateService.setDefaultLang('en');
    translateService.addLangs(SUPPORTED_LANGS);

    // Get selected language and load it
    let selectedLocale: string = getSelectedLocale(translateService);
    let selectedLanguage: string = getSelectedLanguage(translateService);

    // using require here so can avoid making an http request ajax to get the language files
    // this prevents the language keys from flashing on the screen for a second before the actual
    // language files are loaded

    /* tslint:disable-next-line */
    const data: any = require('../../assets/i18n/' + selectedLanguage + '.json');
    translateService.setTranslation(selectedLanguage, data, false);
    translateService.use(selectedLanguage);
  }
}
