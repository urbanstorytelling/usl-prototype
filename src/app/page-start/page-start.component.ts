import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, Directive, ViewChild, Renderer2 } from '@angular/core';
import { GeolocationService } from './../geolocation.service';
import { AgmCoreModule, AgmMap, AgmCircle } from '@agm/core';
import { FirebaseService } from './../firebase.service';
import { Observable } from 'rxjs/Observable';
import * as GeoFire from 'geofire';
import * as geolib from 'geolib';
import { NewsCardDirective } from './../news-card.directive';
import { Router} from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Location } from '@angular/common';
import { DataDummy, DataDummyNonLocal } from './../../assets/data-dummy';
import 'rxjs/add/operator/throttleTime';

@Component({
  selector: 'app-page-start',
  templateUrl: './page-start.component.html',
  styleUrls: ['./page-start.component.scss']
})
export class PageStartComponent implements OnInit, AfterViewInit {

  lat = 53.54;
  lng = 10.01;
  zoom = 11;

  mapReady = new BehaviorSubject(false);
  showUserPos = false;
  notificationVisible = false;
  notificationText = '';
  data$ = new BehaviorSubject(null);
  normalData;
  archivedData = [];
  activeView = "normalData";
  data;
  geoQuery;

  isIOs = false;

  map;
  mainScrollTop;
  mainIsTop;
  mainIsBottom;
  externalUrl = null;
  extTransX = 0;
  innerWidth;
  noTransition;
  querySteps = [200, 500, 1000, 5000, 10000, 100000, 400000]; // in M
  currentQueryStep = 0;
  get queryRadius() {
    return this.querySteps[this.currentQueryStep];
  }
  myPosIconFix = {
    url: './../../assets/img/myPos.png',
    anchor: {
      x: 7.5,
      y: 7.5
    }
  };
  nearDataPoints = []; // keys of data within queryRadius
  loaded = false;

  @ViewChildren(NewsCardDirective, { read: ElementRef }) newsEleList: QueryList<ElementRef>;
  @ViewChild('ext', { read: ElementRef }) extEle: ElementRef;
  @ViewChild(AgmCircle) queryCircleEle: AgmCircle;

  dataDummy = DataDummy;
  dataDummyNonLocal = DataDummyNonLocal;

  activeCardEle = null;
  cardTransX = 0;

  constructor(
    private geoloc: GeolocationService,
    private db: FirebaseService,
    private router: Router,
    private location: Location,
    private renderer: Renderer2
  ) {
    // this.newsList = this.db.getSnapshotChanges('news');
    this.location.subscribe((loc) => {
      if (loc.pop) {
        this.closeExternal();
      }
    });

    this.innerWidth = (window.screen.width);
  }

  ngOnInit() {
    this.isIOs = navigator.platform.match(/(iPhone|iPod|iPad)/i) ? !(localStorage.getItem('iosNotificationDismissed') === 'true') : false;

    this.data$.subscribe(val => {
      if (val) {
        console.log('new data: ', val);
        this.normalData = val;
        this.data = this.normalData;
      }
    });

    this.showNotification('fetching your position ');
    this.geoloc.getLocation()
    .throttleTime(15000)  // max alle 15 Sek
    .subscribe(pos => {
      console.log(pos);
      this.showUserPos = true;
      this.hideNotification();
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
      this.zoom = 16;
      const center = { latitude: this.lat, longitude: this.lng };

      let queriedData = this.fakeGeoQuery(this.dataDummy, center, this.queryRadius);
      queriedData = this.addDistToPoints(queriedData, center);

      this.loaded = true;

      // this.dataDummyNonLocal.forEach(nonLocal => {
      //   queriedData.push(nonLocal);
      // });

      const ctaFakeItem = {
        title: 'CTA von Redaktion',
        source: 'Hamburger Abendblatt',
        label: 'CTA',
        content: 'Crowd wo seid ihr?',
        url: '/page-cta-dummy',
        imgUrl: './../../assets/img/chatIcon.png',
        latLng: { lat: 53.556441, lng: 9.970151 },
        id: 10,
        linkCta: 'mitmachen',
        reverse: true
      };

      queriedData.splice(2, 0, ctaFakeItem);

      const cta2FakeItem = {
        title: "News gesichtet?",
        label: 'mitmachen!',
        content: 'Hast du etwas interessantes gesehen? Dann schicke hier eine Nachricht direkt in die Redaktionen.',
        url: '/page-cta2-dummy',
        imgUrl: './../../assets/img/chatIcon.png',
        latLng: { lat: 53.556441, lng: 9.970151 },
        id: 10,
        linkCta: 'zum Formular',
        reverse: true
      };

      queriedData.splice(4, 0, cta2FakeItem);

      this.data$.next(queriedData);


      // this.geoQuery = this.newGeoFire().query({
      //   center: [this.lat, this.lng],
      //   radius: this.queryRadius / 1000 // in km
      // });

      // const onReadyRegistration = this.geoQuery.on('ready', () => {
      //   console.log('GeoQuery has loaded and fired all other events for initial data');
      //   if (this.nearDataPoints.length < 1) {
      //     this.currentQueryStep += 1;
      //     console.log('expanding query. Next query step ' + this.currentQueryStep + ': ' + this.queryRadius);
      //     const notifText = 'Nothing found within ' + this.queryRadius + 'M. Expanding search radius ';
      //     setTimeout(() => {
      //       this.fitQueryCircleBound();
      //     }, 50);
      //     this.showNotification(notifText, 1000, () => {
      //       this.updateQuery(this.lat, this.lng, this.queryRadius);
      //     });
      //   } else {
      //     console.log('we got nearDataPoints, count: ', this.nearDataPoints.length);
      //     // check for location doubles
      //   }
      // });

      // const onKeyEnteredRegistration = this.geoQuery.on('key_entered', (key, location, distance) => {
      //   console.log(key + ' entered query at ' + location + ' (' + distance + ' km from center)');
      //   this.nearDataPoints.push({ key: key, center: location, distance: distance });
      // });

      // const onKeyExitedRegistration = this.geoQuery.on('key_exited', (key, location, distance) => {
      //   console.log(key + ' exited query to ' + location + ' (' + distance + ' km from center)');
      // });

      // const onKeyMovedRegistration = this.geoQuery.on('key_moved', (key, location, distance) => {
      //   console.log(key + ' moved within query to ' + location + ' (' + distance + ' km from center)');
      // });
    });
  }

  storeMapReady(map) {
    this.map = map;
    this.mapReady.next(true);
  }

  newGeoFire() {
    return new GeoFire(this.db.getDBRef('news'));
  }

  ngAfterViewInit() {
  }

  fakeGeoQuery(data, radCenter, radius) {
    console.log('initial query. Query step ' + this.currentQueryStep + ': ' + this.queryRadius);
    let res = this.fakeCheckIfDataInRadius(data, radCenter, radius);

    while (res.length === 0 && (this.currentQueryStep < this.querySteps.length - 1)) {
      this.currentQueryStep += 1;
      console.log('expanding query. Next query step ' + this.currentQueryStep + ': ' + this.queryRadius);
      res = this.fakeCheckIfDataInRadius(data, { latitude: this.lat, longitude: this.lng }, this.queryRadius);
    }

    setTimeout(() => {
      this.fitQueryCircleBound();
    }, 30);

    let notifText = '';
    if (res.length === 0) {
      notifText = 'No Data within maximum query reach: ' + this.queryRadius;
    } else {
      notifText = 'Data found within query radius: ' + this.queryRadius;
    }
    this.showNotification(notifText, 2000, () => {});

    return res;
  }

  fakeCheckIfDataInRadius(data, radCenter, radius) {
    const res = [];
    data.forEach(dataP => {
      const pCenter = { latitude: dataP.latLng.lat, longitude: dataP.latLng.lng };
      if (geolib.isPointInCircle(
        pCenter,
        radCenter,
        radius
      )) {
        res.push(dataP);
      }
    });
    return res;
  }

  addDistToPoints(data, center) {
    const res = [];
    data.forEach(point => {
      const p = { latitude: point.latLng.lat, longitude: point.latLng.lng };
      const dist = Math.round(geolib.getDistance(p, center));

      point.dist = dist;
      res.push(point);
    });
    return res;
  }

  updateQuery(lat: number, lng: number, radius: number) {
    this.geoQuery.updateCriteria({
      center: [lat, lng],
      radius: radius / 1000 // in km
    });
  }

  fitQueryCircleBound() {
    this.queryCircleEle.getBounds().then((bounds) => {
      this.map.fitBounds(bounds);
    });
  }

  showNotification(text, duration?, callback?) {
    this.notificationText = text;
    this.notificationVisible = true;
    if (duration) {
      setTimeout(() => {
        this.hideNotification();
        if (callback) {
          callback.call();
        }
      }, duration);
    }
  }

  hideNotification() {
    this.notificationVisible = false;
  }

  clickedMarkerContent(marker, i) {
    // console.log(marker, ' ', i);

    // get id of clicked marker, scroll to ele
    const newsEle = this.newsEleList.find(el => {
      return el.nativeElement.id.toString() === marker.id.toString();
    });
    this.scrollIntoView(newsEle.nativeElement);
  }

  cardClicked(news) {
    // push navigation event to browser histroy to "disable" browser back
    history.pushState({ urlPath: '/' }, '', '/');
    this.externalUrl = news.url;
    this.extTransX = this.innerWidth;
  }

  scrollIntoView(ele) {
    ele.scrollIntoView();
  }

  redirectExternalUrl(url) {
    this.router.navigate(['./external', url]);
  }

  onPanExternal(e) {
    this.extTransX = this.innerWidth - e.deltaX;
    this.extTransX = Math.min(this.extTransX, this.innerWidth);
    this.extTransX = Math.max(this.extTransX, 0);
  }

  onPanExternalEnd() {
    if (this.extTransX > (this.innerWidth - (this.innerWidth / 3))) {
      this.extTransX = this.innerWidth;
    } else {
      this.closeExternal();
    }
  }

  closeExternal() {
    console.log('closing external');

    this.extTransX = 0;

    // wait for transition before killing
    setTimeout(() => {
      this.externalUrl = null;
    }, 300);
  }

  iosNotificationClicked() {
    localStorage.setItem('iosNotificationDismissed', 'true');
    this.isIOs = false;
  }

  onPanStartCard(e) {
    this.activeCardEle = this.getParent(e.target);
  }

  getParent(ele) {
    if (ele.classList[0] !== "card") {
      return this.getParent(ele.parentNode);
    } else {
      return ele;
    }
  }

  onPanCard(e) {
    console.log(e);
    
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      console.log("asd");
      
      this.activeCardEle.style.transform = "translateX(" + e.deltaX + "px)";
    }
  }
  
  onPanEndCard(e) {
    if (this.activeCardEle) {
      if (Math.abs(e.deltaX) >= (this.activeCardEle.offsetWidth / 2)) {
        const cardEleIndex = this.newsEleList.toArray().findIndex(el => {
          return el.nativeElement === this.activeCardEle;
        });
        console.log(cardEleIndex);
        this.archivedData.push(this.data[cardEleIndex]);
        this.data.splice(cardEleIndex, 1);
        console.log(this.archivedData);
      }
  
      this.activeCardEle.style.transform = "";
      this.activeCardEle = null;
    }

  }
}
