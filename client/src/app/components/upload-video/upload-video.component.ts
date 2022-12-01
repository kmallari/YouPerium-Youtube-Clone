import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { User } from 'src/app/Interfaces/user';
import { ReceivedVideo } from 'src/app/Interfaces/video';

import { catchError } from 'rxjs/operators';
import { throwError, of, tap } from 'rxjs';

import videojs  from 'video.js';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.css']
})
export class UploadVideoComponent implements OnInit {

  @ViewChild('uploadBtn') uploadBtn!: ElementRef;
  @ViewChild('patchBtn') patchBtn!: ElementRef;
  @ViewChild('errorBtn') errorBtn!: ElementRef;
  @ViewChild("spaceDirective") spaceDirective!: NgForm;

  @Input() user?: User;

  form: FormGroup = this.formBuilder.group({
    video: new FormControl(''),
  })

  constructor(
    private formBuilder: FormBuilder,
    private videoService: VideoService,
  ) { }

  ngOnInit(): void {
  }

  title = "Video Title";
  desc = "Tell viewers about your video.";
  category = "Select a category"

  onVideoUpload($event: Event){
    const file = ($event.target as HTMLInputElement).files![0];
    this.form.get('video')!.patchValue( file );
    ($event.target as HTMLInputElement)!.value = '';

    const allowedMimeTypes = ["video/mp4"]
    if (file && allowedMimeTypes.includes(file.type) && this.user) {
      const value = this.form.get('video')!.value;
      let formData = new FormData();
      formData.append("videoFile",value,value.name);
      formData.append("userId",this.user.userId);
      formData.append("channelName",this.user.channelName);
      formData.append("userProfilePicture",this.user.userProfilePicture);
      formData.append("subscribersCount",this.user.subscribersCount.toString());

      this.uploadBtn.nativeElement.click();

      this.videoService.uploadVideo(formData)
      .pipe(
        catchError((error: HttpErrorResponse)=>{
          return throwError(error);})
      )
      .subscribe( out => {
          if (!out) this.errorBtn.nativeElement.click();
          else {
            this.videoService.editEmit(out);
            setTimeout( () => {
              this.patchBtn.nativeElement.click();
            }, 2000)
          }
        }, error => {
          setTimeout( () => {
            this.errorBtn.nativeElement.click();
          }, 2000)
        }
      );
    }
  }

}
