import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerResponse } from '../Interfaces/server-response';
import { User } from '../Interfaces/user';
import { VideoListing } from '../Interfaces/video';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  videoRoute = 'http://localhost:3000/videos';
  userRoute = 'http://localhost:3000/u';

  constructor(private http: HttpClient, private authService: AuthService) {}

  searchVideos(
    searchQuery: string,
    sortBy: 'relevance' | 'videoCreatedAt' | 'videoTotalViews',
    asc: boolean,
    offset: number,
    limit: number
  ): Observable<ServerResponse<VideoListing[]>> {
    const userId = this.authService._userId;
    let url = this.videoRoute +
      '/search?searchQuery=' +
      searchQuery +
      '&sortBy=' +
      sortBy +
      '&asc=' +
      asc +
      '&offset=' +
      offset +
      '&limit=' +
      limit;

    url += userId ? '&userId=' + userId : '';
    return this.http.get<ServerResponse<VideoListing[]>>(url);
  }

  searchChannels(
    searchQuery: string,
    sortBy: 'createdAt' | 'subscribersCount',
    asc: boolean,
    offset: number,
    limit: number
  ): Observable<ServerResponse<User[]>> {
    return this.http.get<ServerResponse<User[]>>(
      this.userRoute +
        '/search?searchQuery=' +
        searchQuery +
        '&sortBy=' +
        sortBy +
        '&asc=' +
        asc +
        '&offset=' +
        offset +
        '&limit=' +
        limit
    );
  }
}
