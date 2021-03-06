import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Vibration } from '@ionic-native/vibration';
import { IBeacon } from '@ionic-native/ibeacon';

import { TextToSpeech } from '@ionic-native/text-to-speech';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { File } from '@ionic-native/file';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { BeaconProvider } from '../providers/beacon-provider';
import { RouteProvider } from '../providers/route-provider';
import { LoggerProvider } from '../providers/logger-provider';


@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Vibration,
    IBeacon, 
    BeaconProvider,
    RouteProvider,
    TextToSpeech,
    MobileAccessibility,
    File,
    LoggerProvider
  ]
})
export class AppModule {}
