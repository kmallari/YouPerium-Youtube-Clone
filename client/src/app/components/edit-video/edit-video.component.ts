import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReceivedVideo } from 'src/app/Interfaces/video';
import { VideoService } from 'src/app/services/video.service';
import videojs from 'video.js';

@Component({
  selector: 'app-edit-video',
  templateUrl: './edit-video.component.html',
  styleUrls: ['./edit-video.component.css']
})
export class EditVideoComponent implements OnInit {

  @ViewChild('target', {static: true}) target!: ElementRef;
  player!: videojs.Player;

  spaceform: FormGroup = this.createSpaceForm();

  title: string = "Video Title"
  desc: string = "Tell viewers about your video."
  selectReset: boolean = false;
  receivedVideo?: ReceivedVideo;

  //change values depending on video video 
  pagelink: string = "http://localhost:4200/watch?v=";
  categories: string[] = ["Music", "Cooking", "Gaming", "Sports", "Documentary", "Miscellaneous"];
  selected: string = "Miscellaneous"; 
  otherCategories: string[] = this.categories.filter((elem)=> elem!=this.selected)

  options = { 
    autoplay:false, 
    muted:false, 
    controls:true,
    playsinline:true,
    poster: "http://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/video-thumbnails/defaultThumbnail.jpg", 
    sources: [{ src: "", type: "" }],
    controlBar: {
      pictureInPictureToggle: false
    },
  };

  constructor(
    private videoService: VideoService
  ) { }

  ngOnInit(): void {

    this.videoService.editObserve$.subscribe((video) => {
      this.receivedVideo = video;
      this.selectReset = true;

      if(this.player) {
        if(this.receivedVideo!.data.videoThumbnailPath) this.player.poster(<string>  this.receivedVideo!.data.videoThumbnailPath);
        else this.player.poster("http://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/video-thumbnails/defaultThumbnail.jpg");

        this.player.src({ type: 'video/mp4', src: video.data.videoFilePath });
      } else {
        if (this.receivedVideo!.data.videoThumbnailPath) this.options.poster = this.receivedVideo!.data.videoThumbnailPath;
        else this.options.poster = "http://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/video-thumbnails/defaultThumbnail.jpg";

        this.options.sources = [{
          src: video.data.videoFilePath, 
          type: 'video/mp4' 
        }];
        this.player = videojs(this.target.nativeElement, this.options);
      }
      
      this.pagelink = this.pagelink + this.receivedVideo.data.videoId;
      this.selected = this.receivedVideo.data.videoCategory;
      this.otherCategories = this.categories.filter((elem)=> elem!=this.selected)

      this.title = this.receivedVideo.data.videoTitle;
      this.desc = this.receivedVideo.data.videoDescription;
    })
    
  }
 
  createSpaceForm(): FormGroup {
    // do not allow strings to contain only white spaces
    return new FormGroup({
      title: new FormControl("",[Validators.maxLength(100), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
      description: new FormControl("",[Validators.maxLength(1000)]),
      thumbnail: new FormControl(""),
      category: new FormControl(""),
    });
  }

  destroyPlayer() {
    if (this.player) {
      this.player.dispose();
    }
  }

  copyText(): void {
    navigator.clipboard.writeText(this.pagelink).catch(() => {
      console.error("Unable to copy text");
    });
  }

  onThumbnailUpload($event: Event): void {
    const file = ($event.target as HTMLInputElement).files![0];
    ($event.target as HTMLInputElement)!.value = '';

    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (file && allowedMimeTypes.includes(file.type)) {
      this.spaceform.get('thumbnail')!.patchValue( file );

      let reader = new FileReader();
      reader.onload = e => {
        this.player.poster(<string> reader.result);
        this.player.pause();
        this.player.hasStarted(false);
      }
      reader.readAsDataURL(file);

    }
  }

  onSelect(value: string): void {
    this.spaceform.get('category')!.patchValue( value );
  }

  onSubmit(): void {
    // set previous values if null 
    if(!this.spaceform.get('title')!.value) this.spaceform.get('title')!.patchValue(this.title);
    if(!this.spaceform.get('category')!.value) this.spaceform.get('category')!.patchValue(this.selected);
    if(!this.spaceform.get('description')!.value) this.spaceform.get('description')!.patchValue(this.desc);

    // form values
    let title = this.spaceform.get('title')!.value;
    let description = this.spaceform.get('description')!.value;
    let category = this.spaceform.get('category')!.value;

    let file = this.spaceform.get('thumbnail')?.value;
    if (file) {
      let formData = new FormData();
      formData.append("thumbnail", file, file.name);
      formData.append("videoId", this.receivedVideo!.data.videoId)

      this.videoService.uploadThumbnail( formData).subscribe();
    }

    this.videoService.patchVideo(this.receivedVideo!.data.videoId, {videoTitle: title, videoDescription: description, videoCategory: category}).subscribe();

    this.spaceform.get('title')!.patchValue('')
    this.spaceform.get('description')!.patchValue('');
    this.player.pause();
    this.player.hasStarted(false);
    this.selectReset = false;
  }

}



