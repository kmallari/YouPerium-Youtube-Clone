import { Subscription } from "./subscribe";

export interface LoginUser {
    "username" : string | null;
    "email" : string | null;
    "userPassword" :  string | null;
}

export interface RegisterUser{
    "username" : string | null; 
    "email" : string | null;
    "userPassword" : string | null; 
    "firstName" : string | null; 
    "lastName" : string | null; 
    "age" : number | null;
}

export interface User {
    "userId" : string;
    "username" : string;
    "userProfilePicture" : string;
    "email" : string;
    "firstName" : string;
    "lastName" : string;
    "age" : number;
    "channelName" : string;
    "channelDescription" : string;
    "channelBanner" : string;
    "subscribersCount" : number;
    "totalViews" : number;
    "createdAt" : number;
}

export interface ReceivedUser {
    "message" : string;
    "data" : {
        "userId" : string;
        "username" : string;
        "userProfilePicture" : string;
        "email" : string;
        "firstName" : string;
        "lastName" : string;
        "age" : number;
        "channelName" : string;
        "channelDescription" : string;
        "channelBanner" : string;
        "subscribersCount" : number;
        "totalViews" : number;
        "createdAt" : number;
    }
}

export interface ConfirmIdentity{
    "user" : string | undefined;
    "userPassword" : string;
}

export interface ChangePassword {
    "oldPassword" : string | undefined;
    "newPassword" : string | undefined;
}

export interface ReceivedImageUrl {
    "message" : string | undefined;
    "data" : {
        "userProfilePicture" : string | undefined
    }
}

export interface ReceivedBannerUrl {
    "message" : string | undefined;
    "data" : {
        "channelBanner" : string | undefined
    }
}

export interface PatchUser {
    "userProfilePicture" : string | null;
    "username" : string | null;
    "email" : string | null;
    "userPassword" : string | null;
    "firstName" : string | null;
    "lastName" : string | null;
    "age" : number | null;
    "channelName" : string | null;
    "channelDescription" : string | null;
    "channelBanner" : string | null;
}

export interface ReceivedPatchUser {
    "message" : string;
    "data" : object;
}

export interface ReceivedSubscriptions {
    "message" : string;
    "data" : Subscription[]
}