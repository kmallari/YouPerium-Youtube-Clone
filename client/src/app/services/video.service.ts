import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ReceivedVideo } from '../Interfaces/video';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  videoRoute: string = 'http://localhost:3000/videos';

  constructor(
    private http: HttpClient    
  ) { }

  private editObserve = new Subject<ReceivedVideo>();
  editObserve$ = this.editObserve.asObservable();

  private vidInfo$ = new BehaviorSubject<any>({});
  selectedVid$ = this.vidInfo$.asObservable();

  editEmit(video: ReceivedVideo): void {
    this.editObserve.next(video);
  }

  setVideo(user: any) {
    this.vidInfo$.next(user);
  }

  getVideoInformation(videoId: string): Observable<ReceivedVideo> {
    return this.http.get<ReceivedVideo>(`${this.videoRoute}/${videoId}`);
  }

  uploadVideo(formData: FormData): Observable<ReceivedVideo> {
    return this.http.post<ReceivedVideo>(`${this.videoRoute}`, formData);
  }

  patchVideo(videoId: string, data: {videoTitle: string, videoDescription: string, videoCategory: string}): Observable<any> {
    return this.http.patch<any>(`${this.videoRoute}/${videoId}`, data)
  }

  uploadThumbnail(formData: FormData): Observable<any> {
    let url = `${this.videoRoute}/thumbnail`
    return this.http.post<any>(url, formData);
  }

  incrementVideoTotalViews(videoId: string, data : object): Observable<any> {
    return this.http.patch<any>(`${this.videoRoute}/${videoId}/videoTotalViews`, data);
  }

  getNextVideo(videoId: string, videoCategory?: string): Observable<ReceivedVideo> {
    let url = `${this.videoRoute}/nextRecommendedVideo?videoId=${videoId}&videoCategory=${videoCategory}`
    return this.http.get<ReceivedVideo>(url);
  }
  
}
