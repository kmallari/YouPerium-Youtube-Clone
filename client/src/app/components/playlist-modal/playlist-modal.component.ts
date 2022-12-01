import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/Interfaces/user';
import { PlaylistService } from 'src/app/services/playlist.service';
import { UserService } from 'src/app/services/user.service';
import { Playlist, videosInPlaylist } from 'src/app/Interfaces/playlist';
import { EMPTY, switchMap } from 'rxjs';
import { response } from 'express';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-playlist-modal',
  templateUrl: './playlist-modal.component.html',
  styleUrls: ['./playlist-modal.component.css']
})
export class PlaylistModalComponent implements OnInit {
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  videoIn:string[] = []


  createPlaylist = false

  constructor(private authservice: AuthService, private playlistService: PlaylistService, private userService: UserService, private videoService: VideoService) { }
  listOfPlaylists:string[] = ['Sample Playlist','Other Playlist']

  @Input() userData:User = {
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
  userPlaylists:Playlist[] = []

  selectedVideo:videosInPlaylist={
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
  playlistWithIndex: {playlistId:string,videoIndex:number}[] = []
  
  ngOnInit(): void {
    
    this.userService.selectedUser$.pipe(
      switchMap((response)=>  {
        this.userData = response;
        return this.playlistService.getUserPlaylists(response.userId)
      })).subscribe((data)=>{
        console.log('userPlaylists',data.data)
        this.userPlaylists = data.data;
      })
    
    
    this.videoService.selectedVid$.pipe(
      switchMap((response)=>{
        if(Object.keys(response).length != 0){
          this.selectedVideo = response
          return this.playlistService.getPlaylistWithVideo(response.videoId)
        }else{
          return EMPTY
        }
      })).subscribe(data=>{
        this.videoIn = []
        data.data.forEach(element => {
          console.log(element.playlistId)
          this.videoIn.push(element.playlistId)
        });
        console.log('??',data)
        this.playlistWithIndex = data.data
      })
      
    this.userService.requestUser();
    /*
    if(this.userData.userId){

    }*/

  }
  clickCreatePlaylist(){
    this.createPlaylist = true;
    
  }
  clickCancel(){
    this.createPlaylist = false;
  }
  clickSave(playlistTitle:string){
    this.playlistService.createPlaylist({
      title: playlistTitle,
      description: '',
      thumbnailUrl: '', //to follow after fixing videos
      creatorId: this.userData.userId,
      creatorChannelName: this.userData.channelName,
      creatorIconUrl: 'NULL',   //no path to update this yet
    }).subscribe(data=>{
      console.log(data)
      
      let newPlaylist:Playlist={
        playlistId: data.data.id!,
        title: data.data.title,
        description: data.data.description,
        numberOfVideos: data.data.numberOfVideos,
        thumbnailUrl: data.data.thumbnailUrl,
        creatorId: data.data.creatorId,
        creatorChannelName: data.data.creatorChannelName,
        creatorIconUrl: data.data.creatorIconUrl,
        createdAt: data.data.createdAt,
        updatedAt: data.data.updatedAt
      }
      console.log('new userPlaylists:',this.userPlaylists)
      //this.userPlaylists.push(data.data)
      this.userPlaylists.push(newPlaylist)
    })

    //clear data
    this.createPlaylist = false;
  }
  addDeleteToPlaylist(playlistId:string){
    console.log(this.selectedVideo)
    console.log(this.videoIn.includes(playlistId))
    if(this.videoIn.includes(playlistId)){
      //remove from playlist removeVideoFromPlaylist
      console.log('to delete',this.selectedVideo)
      let customVideoIndex = 0;
      this.playlistWithIndex.forEach(function (item){
        if (item.playlistId === playlistId){
          console.log('match')
          customVideoIndex = item.videoIndex
        }
      })
      this.playlistService.removeVideoFromPlaylist(playlistId,this.selectedVideo.videoId,customVideoIndex).subscribe(data=>{
        console.log(data)
        console.log('remove',this.videoIn)
        let index = this.videoIn.indexOf(playlistId);
        if (index !== -1) {
          this.videoIn.splice(index, 1);
        }
      })

    }else{
      //add to playlist addVideoToPlaylist
      
      this.playlistService.addVideoToPlaylist(playlistId,this.selectedVideo).subscribe(data=>{
        console.log(data)
        console.log('add',this.videoIn)
        this.videoIn.push(playlistId)
      })
      
      
    }
  }
  

}
