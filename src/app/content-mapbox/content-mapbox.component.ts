import { Component, OnInit, ViewChild, HostListener, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MapMouseEvent } from 'mapbox-gl';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-content-mapbox',
  templateUrl: './content-mapbox.component.html',
  styleUrls: ['./content-mapbox.component.scss']
})

/**
 * TODO
 *  - add newLayer() function
 *  - button map fullscreen
 *  - wenn point oder poly gezeichnet und erneuter klick auf jew. anderes, dialog:
 *    "das wird dein bestehendes feature löschen. sicher? ja / nein"
 *  - draw poly: "done" erst, wenn mind. zwei punkte
 *  - Kartenmaßstab während zoom ausblenden
 */

export class ContentMapboxComponent implements OnInit, OnDestroy {
  @Input() displayOverlay = false;
  @Input() set zoom(value) {
    this._zoom = value;
  }
  @Input() set center(value) {
    console.log(value);
    this._center = value;
  }
  @Input() trackResize = true;
  @Input() displayMenu = true;
  @Input() fitBoundsOnUpdate = false;
  @Input()
  set selectedFeature(feature) {
    const dataFeature = {};
    dataFeature['data'] = feature;
    feature = dataFeature;
    this.selectedFeatureProperties = feature;
    if (this.selectedFeatureProperties.data.geoJson.properties.hasOwnProperty('poly')) {
      this.selectedFeaturePoly = this.selectedFeatureProperties.data.geoJson.properties.poly.geoJson;
    }
  }
  selectedFeaturePoly = null;
  selectedFeatureProperties = null;
  @ViewChild('map') map;
  @ViewChild('popup') popup;
  @ViewChild('menuGroup') menuGroup;
  // input() data - s. setter/getter unten
  @Output() drawResult = new EventEmitter();
  mapLayerStyle;
  mapStyle = 'mapbox://styles/mapbox/streets-v9';

  private _data = new BehaviorSubject([]);
  private _drawData = new Subject();
  _zoom;
  _center;
  projectIdeas = [];
  projectIdeasObservable = new BehaviorSubject(null);
  mapLoaded = false;
  mapboxDraw = null;
  preventInteraction = false;
  preventInteractionKeyIsPressed = false;
  isDrawing = false;
  showHelp = false;

  // private stadtteilData = "./assets/data/Hamburg_Stadtteile_compressed.geojson";

  constructor() { }

  @HostListener('window:keydown', ['$event'])
  keydown(evt) {
    this.hotKeyInteraction(evt.altKey);
    this.preventInteractionKeyIsPressed = true;
  }

  @HostListener('window:keyup', ['$event'])
  keyup(evt) {
    this.hotKeyInteraction(evt.altKey);
    this.preventInteractionKeyIsPressed = false;
  }

  @HostListener('window:scroll', ['$event'])
  focusout(event) {
    // TODO: check - too expensive?
    if (!this.preventInteractionKeyIsPressed) {
      this.hotKeyInteraction(false);
    }
  }

  @HostListener('dblclick', ['$event'])
  dbclick(event) {
    this.hotKeyInteraction(true);
  }

  hotKeyInteraction(state) {
    this.preventInteraction = state;
  }

  // change data to use getter and setter
  @Input()
  set data(value) {
    // set the latest value for _data BehaviorSubject
    this._data.next(value);
  }

  @Input()
  set drawDataInput(value) {
    // set the latest value for _data BehaviorSubject
    this._drawData.next(value);
  }


  ngOnInit() {
    this.mapLayerStyle = 'basic';
    this._data
      .subscribe(res => {
        // filter data without geoJson
        this.projectIdeas.length = 0;
        res.forEach((item, index) => {
          if (Object(item.data).hasOwnProperty('geoJson')) {
            this.projectIdeas.push(item);
          }
        });
        // console.log(this.projectIdeas);
        this.projectIdeasObservable.next(this.projectIdeas);
    });
  }

  ngOnDestroy() {
    this._data.unsubscribe();
    this.projectIdeasObservable.unsubscribe();
  }

  onMapLoad() {
    console.log('map loaded');
    this.mapLoaded = true;

    this.projectIdeasObservable.subscribe(data => {
      if (data.length > 0) {
        if (this.fitBoundsOnUpdate) {
          this.zoomToFeaturesBounds();
        }
      }
    });
  }

  changeCursorToPointer() {
    this.map.mapInstance.getCanvas().style.cursor = 'pointer';
  }

  changeCursorToDefault() {
    this.map.mapInstance.getCanvas().style.cursor = '';
  }

  featureClick(evt: MapMouseEvent) {
    this.selectedFeatureProperties = null;
    this.selectedFeaturePoly = null;

    // mapbox queryRenderedFeatures return Json for properties:
    // https://github.com/mapbox/mapbox-gl-js/issues/2434
    const properties = (<any>evt).features[0].properties;
    const propertiesString = (<any>evt).features[0].properties.data;
    const propertiesObj = JSON.parse(propertiesString);
    properties.data = propertiesObj;
    this.selectedFeatureProperties = properties;

    const coords = (<any>evt).lngLat;

    this.centerMapTo(coords);

  }

  centerMapTo(coords) {
    const isZoom = this.map.mapInstance.getZoom();
    this._center = coords;
    this._zoom = isZoom;
  }

  zoomToFeaturesBounds() {
    const bounds = new mapboxgl.LngLatBounds();

    if (this.projectIdeas.length > 1) {
      // multiple ideas: fit to markers
      this.projectIdeas.forEach(idea => {
        bounds.extend(idea.data.geoJson.geometry.coordinates);
      });
    } else {
      // single idea: check if poly, fit accordingly
      if (this.projectIdeas[0].data.geoJson.properties.hasOwnProperty('poly')) {
        this.projectIdeas[0].data.geoJson.properties.poly.geoJson.geometry.coordinates[0].forEach(coords => {
          bounds.extend(coords);
        });
      } else {
        bounds.extend(this.projectIdeas[0].data.geoJson.geometry.coordinates);
      }
    }

    this.map.mapInstance.fitBounds([bounds['_sw'], bounds['_ne']], { padding: 20 });
  }
}
