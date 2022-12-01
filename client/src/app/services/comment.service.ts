import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Comment,
  CommentInitializer,
} from '../Interfaces/comment';
import { ServerResponse } from '../Interfaces/server-response';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  commentRoute = 'http://localhost:3000/comments';

  constructor(private http: HttpClient) {}

  createComment(
    videoId: string,
    comment: CommentInitializer
  ): Observable<ServerResponse<Comment>> {
    return this.http.post<ServerResponse<Comment>>(
      this.commentRoute + '/' + videoId,
      comment
    );
  }

  createReply(
    videoId: string,
    parentCommentId: string,
    comment: CommentInitializer
  ): Observable<ServerResponse<Comment>> {
    return this.http.post<ServerResponse<Comment>>(
      this.commentRoute + '/' + videoId + '/' + parentCommentId,
      comment
    );
  }

  readComment(
    videoId: string,
    commentId: string,
    readerUserId: string
  ): Observable<ServerResponse<Comment>> {
    return this.http.get<ServerResponse<Comment>>(
      this.commentRoute +
        '/' +
        videoId +
        '/' +
        commentId +
        '?userId=' +
        readerUserId
    );
  }

  readComments(
    videoId: string,
    readerUserId: string,
    sortBy: 'commentNetLikes' | 'commentCreatedAt',
    offset: number,
    limit: number
  ): Observable<ServerResponse<Comment[]>> {
    return this.http.get<ServerResponse<Comment[]>>(
      this.commentRoute +
        '/' +
        videoId +
        '?userId=' +
        readerUserId +
        '&sortBy=' +
        sortBy +
        '&offset=' +
        offset +
        '&limit=' +
        limit
    );
  }

  readReplies(
    videoId: string,
    commentId: string,
    readerUserId: string
  ): Observable<ServerResponse<Comment[]>> {
    return this.http.get<ServerResponse<Comment[]>>(
      this.commentRoute +
        '/' +
        videoId +
        '/' +
        commentId +
        '/replies' +
        '?userId=' +
        readerUserId
    );
  }

  readVideoTotalNumberOfComments(
    videoId: string
  ): Observable<ServerResponse<{ totalNumberOfComments: number}>> {
    return this.http.get<ServerResponse<{ totalNumberOfComments: number}>>(
      this.commentRoute + '/' + videoId + '/total'
    );
  }

  updateCommentText(
    videoId: string,
    commentId: string,
    commentText: string
  ): Observable<ServerResponse<{ commentText: string }>> {
    return this.http.patch<ServerResponse<{ commentText: string }>>(
      this.commentRoute + '/' + videoId + '/' + commentId + '/commentText',
      { commentText }
    );
  }

  updateCommentNetLikes(
    videoId: string,
    commentId: string,
    likerUserId: string,
    increment: boolean
  ): Observable<ServerResponse<{ commentNetLikes: number }>> {
    return this.http.patch<ServerResponse<{ commentNetLikes: number }>>(
      this.commentRoute +
        '/' +
        videoId +
        '/' +
        commentId +
        '/commentNetLikes' +
        '?userId=' +
        likerUserId +
        '&increment=' +
        increment,
      null
    );
  }

  deleteComment(
    videoId: string,
    commentId: string,
    deleterUserId: string
  ): Observable<ServerResponse<Comment[] | Comment>> {
    return this.http.delete<ServerResponse<Comment[] | Comment>>(
      this.commentRoute +
        '/' +
        videoId +
        '/' +
        commentId +
        '?userId=' +
        deleterUserId
    );
  }
}
