import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-external-content',
  templateUrl: './external-content.component.html',
  styleUrls: ['./external-content.component.scss']
})
export class ExternalContentComponent implements OnInit, OnDestroy {

  _externalUrl;
  isDummyCta1 = false;
  isDummyCta2 = false;

  @ViewChild('video') videoEle;
  @ViewChild('canvas') canvasEle;
  @ViewChild('photo') photoEle;
  photoSrc = null;
  streaming = false;

  streamWidth = 320;
  streamHeight = 240;

  cameraStream = null;

  sendThankYou = false;

  @Input()
  set externalUrl(val) {
    if (val == '/page-cta-dummy') {
      this.isDummyCta1 = true;
    } else if (val == '/page-cta2-dummy') {
      this.isDummyCta2 = true;
    } else {
      this._externalUrl = val;
    }
  }

  @Output() back = new EventEmitter();

  constructor(
    // private route: ActivatedRoute,
    // private router: Router,
  ) { }

  ngOnInit() {
    // this.route.params.subscribe(params => {
    //   console.log(params);
    //   this.externalUrl = params.id;
    // });
  }

  backBtnClicked() {
    // this.router.navigate(['./']);
    this.back.emit(true);
  }

  test(e) {
    console.log(e);
  }

  startVideoStream() {
    const constraints = {
      advanced: [{
        facingMode: "environment"
      }]
    };
    navigator.mediaDevices.getUserMedia({ video: constraints, audio: false })
      .then(function (stream) {
        this.cameraStream = stream;
        

        const video = this.videoEle.nativeElement;
        const canvas = this.canvasEle.nativeElement;
        video.srcObject = stream;

        var playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise.then(_ => {
            // Automatic playback started!
            console.log("play started");
            this.streaming = true;
            // this.streamHeight = video.videoHeight / (video.videoWidth / this.streamWidth);
            video.setAttribute('width', this.streamWidth);
            video.setAttribute('height', this.streamHeight);
            canvas.setAttribute('width', this.streamWidth);
            canvas.setAttribute('height', this.streamHeight);


          }).bind(this, video, canvas)
            .catch(error => {
              // Auto-play was prevented
              // Show paused UI.
            });
        }


      }.bind(this))
      .catch(function (err) {
        console.log("An error occured! " + err);
      });

  }

  takePicture() {
    console.log("snap");
    const canvas = this.canvasEle.nativeElement;
    var context = this.canvasEle.nativeElement.getContext('2d');

    // context.fillStyle = "#AAA";
    // context.fillRect(0, 0, canvas.width, canvas.height);

    // var data = canvas.toDataURL('image/png');
    // this.photoEle.nativeElement.setAttribute('src', data);
    
    
    // const width = 400;  
    // const height = 0;
    // if (width && height) {
      canvas.width = this.streamWidth;
      canvas.height = this.streamHeight;
      context.drawImage(this.videoEle.nativeElement, 0, 0, this.streamWidth, this.streamHeight);
      
      var data = canvas.toDataURL('image/png');
      // this.photoEle.nativeElement.setAttribute('src', data);
    this.photoSrc = data;
    this.streaming = false;
    this.cameraStream.getTracks()[0].stop();
    this.cameraStream = null;
    // } else {
    //   clearphoto();
    // }
  }

  clearPhoto() {
    this.photoSrc = null;
  }

  senden() {
    this.sendThankYou = true;
  }

  ngOnDestroy() {
    if (this.cameraStream !== null) {
      this.cameraStream.getTracks()[0].stop();
      this.cameraStream = null;
    }
  }
}
