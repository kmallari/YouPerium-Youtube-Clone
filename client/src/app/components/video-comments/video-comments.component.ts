import { Component, OnInit } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';
import { Comment } from 'src/app/Interfaces/comment';
import { forkJoin } from 'rxjs';
import { User } from 'src/app/Interfaces/user';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs';
@Component({
  selector: 'app-video-comments',
  templateUrl: './video-comments.component.html',
  styleUrls: ['./video-comments.component.css']
})
export class VideoCommentsComponent implements OnInit {
  listOfComments: Comment[] = []
  listOfReplies: Comment[] = []
  commentVal: string = '';
  showCommentButtons = false;
  showReplyButtons = false;
  showReplyButton:string = "";
  showRepliesOfComment:string = '';
  replyVal:string = '';
  videoId = '';
  editValue='';
  showEditButtons = false;
  editComment = '';
  numberOfComments:{totalNumberOfComments: number}={totalNumberOfComments: 0};

  offset = 10;
  sortType='commentCreatedAt'
  endOfList = false;


  userData: User = {
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
    createdAt: 0,
    totalViews: 0
  }
  constructor(private commentService: CommentService,private userService: UserService,private route: ActivatedRoute,) { }
  moment: any = moment;
  
  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.videoId = params['v'];
      //console.log(this.videoId)
      this.userService.selectedUser$.pipe(
        switchMap((response)=>  {
          this.userData = response;
          console.log(this.userData)
          return forkJoin({
            firstFewComments: this.commentService.readComments(this.videoId,this.userData.userId,'commentCreatedAt',0,10),
            numberOfComments: this.commentService.readVideoTotalNumberOfComments(this.videoId)
          })
        })).subscribe((data)=>{
          this.listOfComments = data.firstFewComments.data
          console.log(data.firstFewComments.data)
          console.log(data.numberOfComments)
          this.numberOfComments = data.numberOfComments.data
          //console.log('go',data.numberOfComments.data.totalNumberOfComments)
        })
    });
    this.userService.requestUser();
  }
  saveNewComment(commentValue:string):void{
    console.log(this.userData.userProfilePicture)
    this.commentService.createComment(this.videoId,{
      commentText: commentValue,
      userId: this.userData.userId,
      channelName: this.userData.channelName,
      userProfilePicture: this.userData.userProfilePicture
    }).subscribe(data=>{
      console.log(data)
      this.listOfComments.unshift(data.data)
      this.commentVal = "";
      this.showCommentButtons = false;
      this.numberOfComments.totalNumberOfComments+=1;
    })
  }
  textAreaClicked(){
    this.showCommentButtons = true;
  }
  textAreaReplyClicked(){
    this.showReplyButtons = true;
  }
  onCancelComment(){
    this.commentVal = "";
    this.showCommentButtons = false;
  }
  onCancelReply(){
    this.replyVal = "";
    this.showReplyButtons = false;
    this.showReplyButton = '';
    this.editComment='';
    
  }
  replyToComment(commentId:string){
    this.showReplyButton = commentId;
    this.replyVal='';

  }
  replyToReply(commentId:string,replyToChannel:string){
    this.showReplyButton = commentId;
    this.replyVal='@'+replyToChannel+' ';

  }
  saveNewReply(commentId:string,replyValue:string,parentComment:Comment):void{
    this.commentService.createReply(this.videoId,commentId,{
      commentText: replyValue,
      userId: this.userData.userId,
      channelName: this.userData.channelName,
      userProfilePicture: this.userData.userProfilePicture
    }).subscribe(data=>{
      console.log(data)
      this.listOfReplies.push(data.data)
      this.replyVal=''
      this.showReplyButton = '';

      let index = this.listOfComments.indexOf(parentComment);
      if (index !== -1) {
        this.listOfComments[index].commentRepliesCount!+=1
      }

    })
  }
  getReplies(commentId:string):void{
    console.log(commentId)
    this.commentService.readReplies(this.videoId,commentId,this.userData.userId).subscribe(data=>{
      this.listOfReplies = data.data
      this.showRepliesOfComment = commentId
      })
  }
  hideReplies(commentId:string):void{
    console.log(commentId)
    this.showRepliesOfComment = ''
  }
  sortComments(sortType:string):void{
    if(sortType==="top"){
      this.commentService.readComments(this.videoId,this.userData.userId,'commentNetLikes',0,10)
      .subscribe((data)=>{
        this.listOfComments = data.data
        console.log(data.data)
        this.sortType='commentNetLikes'
        this.endOfList = false;
        this.offset = 10;
      })
    }else{
      this.commentService.readComments(this.videoId,this.userData.userId,'commentCreatedAt',0,10)
      .subscribe((data)=>{
        this.listOfComments = data.data
        console.log(data.data)
        this.sortType='commentNetLikes'
        this.endOfList = false;
        this.offset = 10;
      })
    }

  }
  deleteComment(comment:Comment){
    this.commentService.deleteComment(this.videoId,comment.commentId,this.userData.userId).subscribe(data=>{
      console.log(data)
      let index = this.listOfComments.indexOf(comment);
      if (index !== -1) {
        this.listOfComments.splice(index, 1);
        this.numberOfComments.totalNumberOfComments-=1;
      }
    })
  }
  deleteReply(comment:Comment,parentComment: Comment){
    console.log('deleteReply')
    this.commentService.deleteComment(this.videoId,comment.commentId,this.userData.userId).subscribe(data=>{
      console.log(data)
      let index = this.listOfReplies.indexOf(comment);
      if (index !== -1) {
        this.listOfReplies.splice(index, 1);
        this.numberOfComments.totalNumberOfComments-=1;
      }
      let indexParent = this.listOfComments.indexOf(parentComment);
      if (indexParent !== -1) {
        this.listOfComments[indexParent].commentRepliesCount!-=1
      }

    })
  }
  editButtonClicked(commentId:string,commentText:string){
    this.editComment = commentId
    this.editValue = commentText
    this.replyVal = commentText
  }
  editTextAreaClicked(){
    this.showEditButtons = true;
  }
  cancelEdit(){
    this.editComment = '';
    this.showEditButtons = false;
  }
  saveEdit(textValue:string,commentId:string,comment: Comment,typeOfChange:string){
    //updateCommentText
    this.commentService.updateCommentText(this.videoId,commentId,textValue).subscribe(data=>{
      console.log(data)
      let index = this.listOfComments.indexOf(comment);
      if (index !== -1 && typeOfChange === "comment") {
        this.listOfComments[index].commentText = textValue;
      }else if(typeOfChange === "reply"){
        index = this.listOfReplies.indexOf(comment);
        if (index !== -1 && typeOfChange === "reply") {
          this.listOfReplies[index].commentText = textValue;
        }
      }

      this.editComment = '';
      this.showEditButtons = false;
    })
  }
  editLike(commentId:string,comment:Comment){
    this.commentService.updateCommentNetLikes(this.videoId,commentId,this.userData.userId,true).subscribe(data=>{
      console.log(data)
      if(comment.likedByUser == true){
        let index = this.listOfComments.indexOf(comment);
        this.listOfComments[index].likedByUser = null;
        this.listOfComments[index].commentNetLikes-=1;
      }else if(comment.likedByUser == false){
        let index = this.listOfComments.indexOf(comment);
        this.listOfComments[index].likedByUser = true;
        this.listOfComments[index].commentNetLikes+=2;
      }else{
        let index = this.listOfComments.indexOf(comment);
        this.listOfComments[index].likedByUser = true;
        this.listOfComments[index].commentNetLikes+=1;
      }
    })
  }
  editDislike(commentId:string,comment:Comment){
    this.commentService.updateCommentNetLikes(this.videoId,commentId,this.userData.userId,false).subscribe(data=>{
      console.log(data)
      if(comment.likedByUser == false){
        let index = this.listOfComments.indexOf(comment);
        this.listOfComments[index].likedByUser = null;
        this.listOfComments[index].commentNetLikes+=1;
      }else if(comment.likedByUser == true){
        let index = this.listOfComments.indexOf(comment);
        this.listOfComments[index].likedByUser = false;
        this.listOfComments[index].commentNetLikes-=2;
      }else{
        let index = this.listOfComments.indexOf(comment);
        this.listOfComments[index].likedByUser = false;
        this.listOfComments[index].commentNetLikes-=1;
      }
    })
  }
  editReplyLike(commentId:string,comment:Comment){
    this.commentService.updateCommentNetLikes(this.videoId,commentId,this.userData.userId,true).subscribe(data=>{
      console.log(data)
      if(comment.likedByUser == true){
        let index = this.listOfReplies.indexOf(comment);
        this.listOfReplies[index].likedByUser = null;
        this.listOfReplies[index].commentNetLikes-=1;
      }else if(comment.likedByUser == false){
        let index = this.listOfReplies.indexOf(comment);
        this.listOfReplies[index].likedByUser = true;
        this.listOfReplies[index].commentNetLikes+=2;
      }else{
        let index = this.listOfReplies.indexOf(comment);
        this.listOfReplies[index].likedByUser = true;
        this.listOfReplies[index].commentNetLikes+=1;
      }
    })
  }
  editReplyDislike(commentId:string,comment:Comment){
    this.commentService.updateCommentNetLikes(this.videoId,commentId,this.userData.userId,true).subscribe(data=>{
      console.log(data)
      if(comment.likedByUser == false){
        let index = this.listOfReplies.indexOf(comment);
        this.listOfReplies[index].likedByUser = null;
        this.listOfReplies[index].commentNetLikes+=1;
      }else if(comment.likedByUser == true){
        let index = this.listOfReplies.indexOf(comment);
        this.listOfReplies[index].likedByUser = false;
        this.listOfReplies[index].commentNetLikes-=2;
      }else{
        let index = this.listOfReplies.indexOf(comment);
        this.listOfReplies[index].likedByUser = false;
        this.listOfReplies[index].commentNetLikes-=1;
      }
    })
  }
  getChannelPicture(): string | undefined {
    if (this.userData?.userProfilePicture === '') {
      return 'https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png';
    } else {
      return `https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/${this.userData?.userProfilePicture}.jpg`;
    }
  }
  getPicture(id: string): string {
    if (id) return `https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/${id}.jpg`;
    else return 'https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png';
  }
  onScroll(){
    console.log(this.sortType)
    if(this.sortType=='commentCreatedAt'){
      console.log('commentCreatedAt')
      this.commentService.readComments(this.videoId,this.userData.userId,'commentCreatedAt',this.offset,10)
      .subscribe((data)=>{
        console.log(data.data)
        this.listOfComments = this.listOfComments.concat(data.data)
        this.offset+=10
        if (data.data.length == 0) this.endOfList = true;
      })
    }else{
      console.log('commentNetLikes')
      this.commentService.readComments(this.videoId,this.userData.userId,'commentNetLikes',this.offset,10)
      .subscribe((data)=>{
        console.log(data.data)
        this.listOfComments = this.listOfComments.concat(data.data)
        this.offset+=10
        if (data.data.length == 0) this.endOfList = true;
      })
    }

  }
}
