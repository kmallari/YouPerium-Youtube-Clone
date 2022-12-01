import { Component, OnInit, HostListener } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { Playlist, videosInPlaylist } from 'src/app/Interfaces/playlist';
import { User } from 'src/app/Interfaces/user';
import { Subject, forkJoin, switchMap } from 'rxjs';
import { PlaylistService } from 'src/app/services/playlist.service';
import { Route,ActivatedRoute } from '@angular/router';
import { VideoService } from 'src/app/services/video.service';
import { Moment } from 'moment';
import * as moment from 'moment';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import * as e from 'express';

@Component({
  selector: 'app-playlist-page',
  templateUrl: './playlist-page.component.html',
  styleUrls: ['./playlist-page.component.css']
})
export class PlaylistPageComponent implements OnInit {

  constructor(
    private playlistService: PlaylistService, 
    private route: ActivatedRoute, 
    private videoService: VideoService,
    private userService: UserService,
    private _authService: AuthService
  ) { }

  editTitle:boolean= false;
  editDescription: boolean = false;
  videoLen = 0
  sampleImgURL = ''
  userBool = false;
  videoBool = true;
  loggedInUserId = this._authService._userId;
  page = 2;
  endOfList: boolean = false;
  typeOfSort = 'custom'
  playlistTitle = '';

  lastEdited="";
  sortBy='custom';

  tempThumbnail='https://i.ytimg.com/vi/RlOB3UALvrQ/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBrGWn3lbfsP7CmXWotsRP3BPg1dQ'
  videoList: videosInPlaylist[] = []
  //firstVidIndex= this.videoList[0]

  selectedVideo:videosInPlaylist = {
    id: '',
    playlistId: '',
    videoId: '',
    videoTitle: '',
    videoChannelName: '',
    videoCreatedAt: 0,
    videoDuration: 0,
    videoThumbnailUrl: '',
    videoTotalViews: 0,
    videoIndex: 0,
    addedAt: 0
  }
  userData:User = {
    userId: '',
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    age: 0,
    channelName: '',
    channelDescription: '',
    userProfilePicture: '',
    channelBanner: '',
    subscribersCount: 0,
    totalViews: 0,
    createdAt: 0
  }
  playlistId=String(this.route.snapshot.queryParamMap.get('list'));

  //samplePlaylist = {playlistId:'zxcvbnmnb',playlistTitle:'Purple Sun!',playlistDescription:'Some songs that I like',lastUpdate:'Monday',noOfVideos:'2', coverPhoto:'image here', createdAt:'Friday'}
  playlistData:Playlist = {
    playlistId: '',
    title: '',
    description: '',
    numberOfVideos: 0,
    thumbnailUrl: '',
    creatorId: '',
    creatorChannelName: '',
    creatorIconUrl: '',
    createdAt: 0,
    updatedAt: 0
  }
  videosFromDb: videosInPlaylist[]=[]
  ngOnInit(): void {
    this.userService.currentUser$.subscribe((user)=> {
      this.userData = user;
      if(this.userData.userId!=''){
        forkJoin({
          playlistVideos: this.playlistService.getVideosInPlaylist(this.playlistId,'custom',1,25),
          playlistInfo: this.playlistService.getPlaylistData(this.playlistId)
        }).subscribe(data=>{
          this.videoList = data.playlistVideos.data;
          this.playlistData = data.playlistInfo.data[0]
          //console.log(this.videoList)
          this.videoLen = this.playlistData.numberOfVideos;
          //console.log('!',this.playlistData.thumbnailUrl)
          if(this.playlistData.thumbnailUrl===""){
            this.playlistData.thumbnailUrl = "https://i.ytimg.com/img/no_thumbnail.jpg";
          }
          this.playlistTitle = this.playlistData.title
          this.lastEdited = moment(this.playlistData.updatedAt).calendar({
            sameDay: '[Today]',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: 'DD/MM/YYYY'
        })
        }
        )
      }
    })
    //this.userService.requestUser();


    
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.videoList, event.previousIndex, event.currentIndex);
    console.log(event)
    console.log(this.videoList[event.currentIndex])
    this.playlistService.updateOrder(this.playlistId,this.videoList[event.currentIndex].id,event.previousIndex, event.currentIndex).subscribe(data=>{console.log(data)})
  }

  getVideoData(video:videosInPlaylist){
    this.videoService.setVideo(video);
    console.log(video)
    //get which playlists they are a part of

  }

  saveNewPlaylistData(playlistComponent:string,data:string){
    if(playlistComponent == 'title'){
      this.editTitle = false;
      this.playlistData.title = data;
      this.playlistService.updatePlaylistData(this.playlistId,'title',data).subscribe(data=>{console.log(data)});
    }else{
      this.editDescription= false;
      this.playlistData.description = data;
      console.log(data)
      this.playlistService.updatePlaylistData(this.playlistId,'description',data).subscribe(data=>{console.log(data)});
    }
  }
  cancelNewPlaylistData(playlistComponent:string){
    if(playlistComponent == 'title'){
      this.editTitle = false
    }else{
      this.editDescription= false
    }
  }
  editPlaylistData(playlistComponent:string){
    if(playlistComponent == 'title'){
      this.editTitle = true
    }else{
      this.editDescription= true
    }

  }
  uniqByFilter(array: number[]) {
    return array.filter((value, index) => array.indexOf(value) === index);
  }
  setPlayListThumbnail(url:string){
    this.sampleImgURL = url;
    this.playlistData.thumbnailUrl = url;
    this.playlistService.updatePlaylistData(this.playlistId,'thumbnailUrl',url).subscribe(data=>{console.log(data)});

  }
  removeVideo(video:videosInPlaylist){
    /*this.playlistService.removeVideoFromPlaylist(this.playlistData.playlistId,video.videoId,video.videoIndex).subscribe(data=>{
      console.log(data)
      let index = this.videoList.indexOf(video);
      if (index !== -1) {
        this.videoList.splice(index, 1);
        this.playlistService.getVideosInPlaylist(this.playlistId,'custom',1,25).subscribe(data=>{
          this.videoList = data.data;
          console.log(this.videoList)
          this.videoLen = this.videoList.length;
        })
      }
    })*/
    this.playlistService.removeVideoFromPlaylist(this.playlistData.playlistId,video.videoId,video.videoIndex).pipe(
      switchMap((data)=>{
        console.log(data)
        let index = this.videoList.indexOf(video);
        if (index !== -1) {
          this.videoList.splice(index, 1);
          
        }
        return this.playlistService.getVideosInPlaylist(this.playlistId,'custom',1,25)
      })
    ).subscribe((data)=>{
        this.videoList = data.data;
        console.log(this.videoList)
        this.videoLen = this.videoList.length;
      
    })
    
    /**
     *     this.userService.selectedUser$.pipe(
      switchMap((response)=>  {
        this.userData = response;
        return this.playlistService.getUserPlaylists(response.userId)
      })).subscribe((data)=>{
        console.log('userPlaylists',data.data)
        this.userPlaylists = data.data;
      })
     */

  }
  sortVideos(sortType:string){
    console.log('sort type:',sortType)
    //API call to sort
    this.typeOfSort = sortType
    this.playlistService.getVideosInPlaylist(this.playlistId,sortType,1,25).subscribe(data=>{
      this.videoList = data.data
      console.log(this.videoList)
      this.sortBy = sortType
      this.page=2
      this.endOfList = false
    })
  }
  /*saveToPlaylist(video:videosInPlaylist){
    this.selectedVideo = video
  }*/
  
  deletePlaylist():void{
    this.playlistService.deletePlaylist(this.playlistData.playlistId).subscribe(data=>
      //window.location.reload()
      window.location.href = 'http://localhost:4200'
    )
  }
  goToVideo(videoId:string,playlistId:string):void{
    console.log(videoId)
    console.log(playlistId)
    if(videoId==="playButton"){
      window.location.href = 'http://localhost:4200/watch?v='+this.videoList[0].videoId+'&list='+this.playlistId
    }else{
      window.location.href = 'http://localhost:4200/watch?v='+videoId+'&list='+playlistId
    }
    
  }
  onScroll() {
    console.log('onScroll')

    if(!this.endOfList){
      this.playlistService.getVideosInPlaylist(this.playlistId,this.typeOfSort,this.page,25)
        .subscribe(out=> {       
          console.log(out.data)
          this.videoList = this.videoList.concat(out.data);
          this.page+=1
          if (out.data.length == 0) this.endOfList = true;
        })
    }

  }


}

