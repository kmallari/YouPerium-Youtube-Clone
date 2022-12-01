import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ServerResponse } from 'src/app/Interfaces/server-response';
import { User } from 'src/app/Interfaces/user';
import { VideoListing } from 'src/app/Interfaces/video';
import { AuthService } from 'src/app/services/auth.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
})
export class SearchResultComponent implements OnInit {
  showFilters = false;
  listType: string = 'search';

  // Search parameters
  searchQuery!: string;
  type!: 'videos' | 'channels';
  sortBy!:
    | 'relevance'
    | 'videoCreatedAt'
    | 'videoTotalViews'
    | 'createdAt'
    | 'subscribersCount';
  asc!: boolean;
  offset!: number;
  limit!: number;

  // Search result
  videos: VideoListing[] = [];
  channels: User[] = [];
  relevanceVideoIds: string[] = [];

  emptySearch = false;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.getUserIdFromToken() === undefined) {
      this.isLoggedIn = false;
    } else {
      this.isLoggedIn = true;
    }

    this.route.queryParamMap.subscribe((qparams) => {
      this._initSearchParameters(qparams);
      this._getSearchItems();
    });
    if (window.innerWidth < 660) this.listType = 'mini';
  }

  onScroll() {
    this.offset += this.limit;
    this._getSearchItems();
  }

  toggleFiltersDisplay() {
    this.showFilters = !this.showFilters;
  }

  _initSearchParameters(qparams: ParamMap) {
    this.searchQuery = qparams.get('searchQuery') as string;

    let searchType = qparams.get('type');
    if (searchType === null) {
      this.type = 'videos';
    } else if (searchType === 'videos' || searchType === 'channels') {
      this.type = searchType;
    } else {
      console.log('Invalid searchType');
      return;
    }

    let sortBy = qparams.get('sortBy');
    if (this.type === 'videos') {
      if (sortBy === null) {
        this.sortBy = 'relevance';
      } else if (
        sortBy === 'relevance' ||
        sortBy === 'videoTotalViews' ||
        sortBy === 'videoCreatedAt'
      ) {
        this.sortBy = sortBy;
      } else {
        console.log('Invalid sortBy');
        return;
      }
    } else {
      if (sortBy === null) {
        this.sortBy = 'subscribersCount';
      } else if (sortBy === 'createdAt' || sortBy === 'subscribersCount') {
        this.sortBy = sortBy;
      } else {
        console.log('Invalid sortBy');
        return;
      }
    }

    this.asc = false;
    this.offset = 0;
    this.limit = 100;
  }

  _getSearchItems() {
    if (this.type === 'videos') {
      this.searchService
        .searchVideos(
          this.searchQuery,
          this.sortBy as 'relevance' | 'videoCreatedAt' | 'videoTotalViews',
          this.asc,
          this.offset,
          this.limit
        )
        .subscribe({
          next: (serverResponse: ServerResponse<VideoListing[]>) => {
            if (this.sortBy === 'relevance') {
              
              serverResponse.data.forEach((video) => {
                if (!this.relevanceVideoIds.includes(video.videoId)) {
                  this.videos.push(video);
                  this.relevanceVideoIds.push(video.videoId);
                }
              });
            } else {
              this.videos = this.videos.concat(serverResponse.data);
            }

            if (!this.videos.length) {
              this.emptySearch = true;
            } else {
              this.emptySearch = false;
            }
          },

          error: (err: HttpErrorResponse) => {
            console.log(err);
            return;
          },
        });
    } else {
      this.searchService
        .searchChannels(
          this.searchQuery,
          this.sortBy as 'createdAt' | 'subscribersCount',
          this.asc,
          this.offset,
          this.limit
        )
        .subscribe({
          next: (serverResponse: ServerResponse<User[]>) => {
            this.channels = this.channels.concat(serverResponse.data);
            if (!this.channels.length) {
              this.emptySearch = true;
            } else {
              this.emptySearch = false;
            }
          },

          error: (err: HttpErrorResponse) => {
            console.log(err);
            return;
          },
        });
    }
  }

  _changedFilter() {
    this.offset = 0;
    this.videos = [];
    this.channels = [];
    this.relevanceVideoIds = [];
    this.showFilters = false;
    this._getSearchItems();
  }

  @HostListener('window:resize', []) updateCollpased() {
    if (window.innerWidth < 660) this.listType = 'mini';
    else this.listType = 'search';
  }
}
