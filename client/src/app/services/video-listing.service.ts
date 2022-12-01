import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ReceivedVideo, ReceivedVideoListing, Video } from '../Interfaces/video';

@Injectable({
  providedIn: 'root'
})
export class VideoListingService {

  videoRoute: string = "http://localhost:3000/videos";

  private menuReady = new Subject<null>();
  menuReady$ = this.menuReady.asObservable();

  constructor(
    private http: HttpClient
  ) { }


  onReady(): void {
    this.menuReady.next(null);
  }

  getHomeVideos(category: string, offset:number, userId?: string): Observable<ReceivedVideoListing> {
    return this.http.get<ReceivedVideoListing>(`${this.videoRoute}/home?videoCategory=${category}&offset=${offset}&limit=${offset+60}` + (userId ? `&userId=${userId}` : ''));
  }

  getSubscriptionVideos(userId: string, time: string, offset:number): Observable<ReceivedVideoListing> {
    return this.http.get<ReceivedVideoListing>(`${this.videoRoute}/user/${userId}/subscriptions?timeRange=${time}&offset=${offset}&&limit=${offset+60}`);
  }

  getChannelVideos(userId : string | undefined, offset : number, ascending : boolean, limit : number, sort : string) : Observable<ReceivedVideoListing> {
    return this.http.get<ReceivedVideoListing>(`${this.videoRoute}/user/${userId}/videos?offset=${offset}&limit=${limit}&sortBy=${sort}&asc=${ascending}`)
  }
  
  getExploreVideos(userId:string): Observable<ReceivedVideoListing> {
    return this.http.get<ReceivedVideoListing>(`${this.videoRoute}/explore?userId=${userId}`);
  }

  getRecommendedVideos(videoId: string, offset: number, videoCategory?: string): Observable<ReceivedVideoListing> {
    let url = `${this.videoRoute}/recommendedVideos?videoId=${videoId}&videoCategory=${videoCategory}&offset=${offset}&limit=30`
    return this.http.get<ReceivedVideoListing>(url);
  }

}