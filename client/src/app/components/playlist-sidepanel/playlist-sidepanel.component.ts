import { query } from '@angular/animations';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { videosInPlaylist, Playlist } from 'src/app/Interfaces/playlist';
import { AuthService } from 'src/app/services/auth.service';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-playlist-sidepanel',
  templateUrl: './playlist-sidepanel.component.html',
  styleUrls: ['./playlist-sidepanel.component.css'],
})
export class PlaylistSidepanelComponent implements OnInit {
  constructor(
    private _playlistService: PlaylistService,
    private _route: ActivatedRoute,
    private _authService: AuthService
  ) {}

  playlistData!: Playlist;
  loggedInUserId = this._authService._userId;
  @Input() playlistId!: string;
  @Input() currentVideoId!: string;
  videos: videosInPlaylist[] = [];
  ngOnInit(): void {
    this.getVideosInPlaylist(this.playlistId);
    this.getPlaylistInfo(this.playlistId);

    this._route.queryParams.subscribe((queryParams) => {
      this.currentVideoId = queryParams['v'];
    });
  }

  preventRedirect = (event: Event) => {
    event.stopPropagation();
  };

  getVideosInPlaylist(playlistId: string) {
    this._playlistService
      .getVideosInPlaylist(playlistId, 'custom', 1, 10)
      .subscribe(
        (data) => {
          console.log({ data });
          this.videos = data.data;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getPlaylistInfo(playlistId: string) {
    this._playlistService.getPlaylistData(playlistId).subscribe(
      (data) => {
        this.playlistData = data.data[0];
      },
      (error) => {
        console.error('ERROR!!', error);
      }
    );
  }

  reload() {
    window.location.reload();
  }

  // addVideoToPlaylist(videoId: string) {
  //   const video = this.videos.filter((video) => video.videoId === videoId)[0];
  //   this._playlistService.addVideoToPlaylist(video.playlistId, video).subscribe(
  //     (data) => {
  //       console.log({ data });
  //       this.getVideosInPlaylist(this.playlistId);
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }

  removeVideoFromPlaylist(videoId: string) {
    const video = this.videos.filter((video) => video.videoId === videoId)[0];
    this._playlistService
      .removeVideoFromPlaylist(
        video.playlistId,
        video.videoId,
        video.videoIndex
      )
      .subscribe(
        (data: any) => {
          console.log({ data });
          this.getVideosInPlaylist(this.playlistId);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  formatDuration(duration: number) {
    let d = (duration / 8.64e4) | 0;
    let H = ((duration % 8.64e4) / 3.6e3) | 0;
    let m = ((duration % 3.6e3) / 60) | 0;
    let s = duration % 60;
    let z = (n: number) => (n < 10 ? '0' : '') + n;

    if (d > 0) {
      return `${d}:${z(H)}:${z(m)}:${z(s)}`;
    } else if (H > 0) {
      return `${H}:${z(m)}:${z(s)}`;
    } else {
      return `${m}:${z(s)}`;
    }
  }
}
