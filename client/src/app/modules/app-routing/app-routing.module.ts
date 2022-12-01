import { ChangePasswordComponent } from './../../components/account/change-password/change-password.component';
import { ChannelHomeComponent } from './../../components/channel/channel-home/channel-home.component';
import { AccountComponent } from './../../components/account/account.component';
import { StudioComponent } from './../../components/studio/studio.component';
import { ChannelComponent } from './../../components/channel/channel.component';
import { SignupComponent } from 'src/app/components/signup/signup.component';
import { LoginModalComponent } from './../../components/login-modal/login-modal.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/components/home/home.component';
import { VideoPageComponent } from 'src/app/components/video-page/video-page.component';
import { PlaylistPageComponent } from 'src/app/components/playlist-page/playlist-page.component';
import { ChannelVideosComponent } from 'src/app/components/channel/channel-videos/channel-videos.component';
import { ChannelPlaylistsComponent } from 'src/app/components/channel/channel-playlists/channel-playlists.component';
import { ChannelAboutComponent } from 'src/app/components/channel/channel-about/channel-about.component';
import { SubscriptionVideosComponent } from 'src/app/components/subscription-videos/subscription-videos.component';
import { InformationComponent } from 'src/app/components/account/information/information.component';
import { DashboardComponent } from 'src/app/components/studio/dashboard/dashboard.component';
import { AnalyticsComponent } from 'src/app/components/studio/analytics/analytics.component';
import { CustomizationComponent } from 'src/app/components/studio/customization/customization.component';
import { ExploreVideosComponent } from 'src/app/components/explore-videos/explore-videos.component';
import { SearchResultComponent } from 'src/app/components/search-result/search-result.component';
import { HomeGuard, LoginGuard } from 'src/app/guards/auth.guard';

const routes : Routes = [
  { path: 'login', component: LoginModalComponent, canActivate : [LoginGuard]},
  { path: 'signup', component: SignupComponent, canActivate : [LoginGuard]},
  { path: 'watch', component: VideoPageComponent},
  { path: 'playlist', component: PlaylistPageComponent},
  { path: 'search', component: SearchResultComponent },
  { path: '', component: HomeComponent},
  { path: 'c/:username', component: ChannelComponent, children : [
    { path: '', component : ChannelVideosComponent},
    { path: 'playlists', component : ChannelPlaylistsComponent},
    { path: 'about', component : ChannelAboutComponent }
  ]},
  { path: 'account', component: AccountComponent, children : [
    { path: 'info', component : InformationComponent},
    { path: 'change_password', component : ChangePasswordComponent}
  ]},
  { path: 'c/:userId', component: ChannelComponent},
  { path: 'studio/channel/:userId', component: StudioComponent, children : [
    { path: '', component : DashboardComponent},
    { path: 'analytics', component : AnalyticsComponent},
    { path : 'customization', component : CustomizationComponent}
  ], canActivate : [HomeGuard]},
  { path: 'account', component: AccountComponent},
  { path: 'feed/subscriptions', component: SubscriptionVideosComponent},
  { path: 'feed/explore', component: ExploreVideosComponent},
  { path: 'studio/channel/:username', component: StudioComponent},
  { path: 'account', component: AccountComponent}
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports : [RouterModule]
})
export class AppRoutingModule { }
