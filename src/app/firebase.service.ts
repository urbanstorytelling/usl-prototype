import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class FirebaseService {

  constructor(private db: AngularFireDatabase) { }

  getValueChanges(key: string) {
    return this.db.list(key).valueChanges();
  }

  getSnapshotChanges(key: string) {
    return this.db.list(key).snapshotChanges();
  }

  getDBRef(child: string) {
    return this.db.app.database().ref(child);
  }

  pushNewKey(child: string) {
    return this.db.app.database().ref().child(child).push().key;
  }


  addBulkData(child: string, data: any[]) {

  }

}


// ggf. für geoFire https://stackoverflow.com/questions/39054386/using-geofire-in-an-angular2-app

/**
 * news kommen als json.
 * dafür muss ich eine query schreiben, die sie nur alle an meiner position holt.
 * wo sind die news gespeichert? wie kann ich darauf abfragen machen?
 * news in fb -> functions erstellt geoFire 'news' eintrag
 * client fragt geoFire 'news' anhand eigener pos, bekommt liste von keys, holt value dieser keys?
 */
