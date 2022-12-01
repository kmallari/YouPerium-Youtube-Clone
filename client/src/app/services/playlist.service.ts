import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Playlist,
  ReceivedPlaylists,
  ReceivedPlaylist,
  ReceivedVideosInPlaylist,
  PlaylistsWithVideo,
  ReceivedVideo
} from '../Interfaces/playlist';
import { videosInPlaylist } from '../Interfaces/playlist';
@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  userRoute: string = 'http://localhost:3000/p';
  constructor(private http: HttpClient) {}

  createPlaylist(playlistData: {}) {
    return this.http.post<ReceivedPlaylist>(
      this.userRoute + '/create',
      playlistData
    );
  }

  getUserPlaylists(userId: string) {
    return this.http.get<ReceivedPlaylists>(this.userRoute + '/u/' + userId);
  }

  getVideosInPlaylist(
    playlistId: string,
    orderBy: string,
    page: number,
    limit: number
  ) {
    return this.http.get<ReceivedVideosInPlaylist>(
      `${this.userRoute}/${playlistId}?orderBy=${orderBy}&page=${page}&limit=${limit}`
    );
  }

  getPlaylistWithVideo(videoId: string){
    return this.http.get<PlaylistsWithVideo>(`${this.userRoute}/v/${videoId}`);
  }

  addVideoToPlaylist(playlistId:string, videoData: {}){
    return this.http.post<ReceivedVideo>(`${this.userRoute}/add/${playlistId}`,videoData);
  }
  removeVideoFromPlaylist(playlistId:string,videoId:string,index:number){
    return this.http.delete(`${this.userRoute}/remove/${playlistId}/${videoId}/${index}`);
  }
  getPlaylistData(playlistId: string){
    return this.http.get<ReceivedPlaylists>(`${this.userRoute}/data/${playlistId}`);
  }
  updatePlaylistData(playlistId:string,playlistComponent:string,data:string){
    switch(playlistComponent){
      case 'title':{
        return this.http.patch(`${this.userRoute}/update/${playlistId}`,{title:data})
        break;
      }
      case 'description':{
        return this.http.patch(`${this.userRoute}/update/${playlistId}`,{description:data})
        break;
      }
      default:{
        return this.http.patch(`${this.userRoute}/update/${playlistId}`,{thumbnailUrl:data})
        break;
      }
    }
    
  }
  updateOrder(playlistId:string, pId:string, pOldIndex:number, pNewIndex:number){
    return this.http.patch(`${this.userRoute}/reorder/${playlistId}`,{id: pId, oldIndex: pOldIndex, newIndex: pNewIndex})
  }

  deletePlaylist(playlistId: string){
    return this.http.delete<PlaylistsWithVideo>(`${this.userRoute}/${playlistId}`);
  }
  
  
}
