import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';

import { environment } from './../environments/environment';

import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

import { GeolocationService } from './geolocation.service';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FirebaseService } from './firebase.service';
import { ScrollwatchDirective } from './scrollwatch.directive';
import { NewsCardDirective } from './news-card.directive';
import { ExternalContentComponent } from './external-content/external-content.component';
import { SafeUrlPipe } from './safe-url.pipe';
import { PageStartComponent } from './page-start/page-start.component';
import { ImgSpinnerComponent } from './img-spinner/img-spinner.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { ContentMapboxComponent } from './content-mapbox/content-mapbox.component';

import { RouteReuseStrategy } from '@angular/router';
import { RoutingReuseStrategy } from './routing-reuse-strategy';

const appRoutes: Routes = [
  // { path: 'external', component: ExternalContentComponent },
  { path: '', component: PageStartComponent },
  // { path: '**', component: PageStartComponent }
];

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
declare var Hammer: any;
export class MyHammerConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    let mc = new Hammer(element, {
      touchAction: "pan-y",
    });
    return mc;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ScrollwatchDirective,
    NewsCardDirective,
    ExternalContentComponent,
    SafeUrlPipe,
    PageStartComponent,
    ImgSpinnerComponent,
    ContentMapboxComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMaps.api
    }),
    AgmJsMarkerClustererModule,
    AgmSnazzyInfoWindowModule,
    NgxMapboxGLModule.forRoot({
      accessToken: environment.mapbox.accessToken
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  providers: [
    GeolocationService,
    FirebaseService,
    { provide: RouteReuseStrategy, useClass: RoutingReuseStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
