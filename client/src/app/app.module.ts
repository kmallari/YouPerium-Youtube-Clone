import { ErrorHandlerService } from './services/error-handler.service';
import { MaterialModule } from './modules/material/material.module';
import { AuthService } from './services/auth.service';
import { AppRoutingModule } from './modules/app-routing/app-routing.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AppComponent } from './app.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { PlaylistPageComponent } from './components/playlist-page/playlist-page.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { VideoPageComponent } from './components/video-page/video-page.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SignupComponent } from './components/signup/signup.component';
import { PlaylistModalComponent } from './components/playlist-modal/playlist-modal.component';
import { ChannelComponent } from './components/channel/channel.component';
import { AccountComponent } from './components/account/account.component';
import { StudioComponent } from './components/studio/studio.component';
import { ChannelHeaderComponent } from './components/channel-header/channel-header.component';
import { UploadVideoComponent } from './components/upload-video/upload-video.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SidebarContentComponent } from './components/sidebar-content/sidebar-content.component';
import { VideosGridComponent } from './components/videos-grid/videos-grid.component';
import { PlaylistSidepanelComponent } from './components/playlist-sidepanel/playlist-sidepanel.component';
import { ChannelVideosComponent } from './components/channel/channel-videos/channel-videos.component';
import { ChannelHomeComponent } from './components/channel/channel-home/channel-home.component';
import { ChannelPlaylistsComponent } from './components/channel/channel-playlists/channel-playlists.component';
import { ChannelAboutComponent } from './components/channel/channel-about/channel-about.component';
import { SubscriptionVideosComponent } from './components/subscription-videos/subscription-videos.component';
import { EditVideoComponent } from './components/edit-video/edit-video.component';
import { ErrorMessageDisplayComponent } from './components/error-message-display/error-message-display.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { InformationComponent } from './components/account/information/information.component';
import { ChangePasswordComponent } from './components/account/change-password/change-password.component';
import { VideoCommentsComponent } from './components/video-comments/video-comments.component';
import { DashboardComponent } from './components/studio/dashboard/dashboard.component';
import { AnalyticsComponent } from './components/studio/analytics/analytics.component';
import { CustomizationComponent } from './components/studio/customization/customization.component';
import { ExploreVideosComponent } from './components/explore-videos/explore-videos.component';
import { VideosListComponent } from './components/videos-list/videos-list.component';
import { ProfilePictureComponent } from './components/information/modals/profile-picture/profile-picture.component';
import { NameComponent } from './components/information/modals/name/name.component';
import { BirthdayComponent } from './components/information/modals/birthday/birthday.component';
import { EmailComponent } from './components/information/modals/email/email.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxFileDropModule } from 'ngx-file-drop';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { ChannelsListComponent } from './components/channels-list/channels-list.component';
import { SideMenubarComponent } from './components/side-menubar/side-menubar.component';
import { HomeGuard, LoginGuard } from './guards/auth.guard';


@NgModule({
  declarations: [
    AppComponent,
    LoginModalComponent,
    PlaylistPageComponent,
    HeaderComponent,
    HomeComponent,
    CategoryListComponent,
    VideoPageComponent,
    SignupComponent,
    PlaylistModalComponent,
    ChannelComponent,
    AccountComponent,
    StudioComponent,
    ChannelHeaderComponent,
    UploadVideoComponent,
    SidebarContentComponent,
    VideosGridComponent,
    PlaylistSidepanelComponent,
    ChannelVideosComponent,
    ChannelHomeComponent,
    ChannelPlaylistsComponent,
    ChannelAboutComponent,
    SubscriptionVideosComponent,
    EditVideoComponent,
    ErrorMessageDisplayComponent,
    ClickOutsideDirective,
    InformationComponent,
    ChangePasswordComponent,
    VideoCommentsComponent,
    DashboardComponent,
    AnalyticsComponent,
    CustomizationComponent,
    ExploreVideosComponent,
    VideosListComponent,
    ProfilePictureComponent,
    NameComponent,
    BirthdayComponent,
    EmailComponent,
    SearchResultComponent,
    ChannelsListComponent,
    SideMenubarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MaterialModule,
    ClipboardModule,
    InfiniteScrollModule,
    NgbModule,
    NgxFileDropModule 
  ],
  providers: [
    {provide : HTTP_INTERCEPTORS, useClass : TokenInterceptorService, multi: true}, 
    {provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerService, multi: true},
    AuthService,
    HomeGuard, 
    LoginGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
