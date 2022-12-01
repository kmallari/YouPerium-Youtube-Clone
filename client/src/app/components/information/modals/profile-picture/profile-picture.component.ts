import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/Interfaces/user';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { from, mergeMap, bindCallback, Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.css']
})
export class ProfilePictureComponent implements OnInit {

  @Input() user !: User;

  imgSrc : string = ''
  imgFile !: File;

  constructor(
    private activeModal : NgbActiveModal,
    private userService : UserService
  ) { }

  ngOnInit(): void {
    this.imgSrc = `https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/${this.user.userProfilePicture}.jpg`;
  }

  closeModal() : void {
    this.activeModal.close();
  }

  onSaveClicked()  : void {
    let fd = new FormData();
    fd.append('profilePicture', this.imgFile, this.imgFile.name);
    this.userService.updateProfilePicture(fd, this.user.userId).subscribe()
    this.closeModal();
    window.location.reload();
  }

  disabler () : boolean {
    return this.imgFile === undefined;
  }

  changeSource(event : any) {
    event.target.src = "https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png";
  }

  async dropped(files: NgxFileDropEntry[]) {
    let reader = new FileReader();
    from(files).pipe(
      mergeMap(selectedFile => {
        const fileEntry = selectedFile.fileEntry as FileSystemFileEntry;
        const observableFactory = bindCallback(fileEntry.file) as any;
        const file$ = observableFactory.call(fileEntry) as Observable<File>;
        return file$
      })
    ).subscribe(file => {
      this.imgFile = file;
      reader.readAsDataURL(file);
      reader.onload=(event : any) => {
        this.imgSrc = event.target.result;
      }
     })
  }

  
  
}
