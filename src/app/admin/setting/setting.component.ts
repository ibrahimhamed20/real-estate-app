import { Component, OnInit } from '@angular/core';
import { SettingService } from '../../shared/setting.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Settings } from '../../types.interface';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './../../shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  editSetting: Settings = <Settings>{};
  settingForm = new FormGroup({
    id: new FormControl(),
    website_title: new FormControl(),
    slide1_img: new FormControl(),
    slide1_title: new FormControl(),
    slide1_desc: new FormControl(),
    slide2_img: new FormControl(),
    slide2_title: new FormControl(),
    slide2_desc: new FormControl(),
    slide3_img: new FormControl(),
    slide3_title: new FormControl(),
    slide3_desc: new FormControl()
  });
  data: Settings = <Settings>{};
  userForm = new FormGroup({
    userId: new FormControl(),
    username: new FormControl(),
    password: new FormControl()
  });
  userData: any;
  userId: number;
  constructor(
    private settingServ: SettingService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private _toustr: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('userData'));
    this.userId = user.id;
    if (user && user.id) {
      this.getUserById(user.id);
    }
    this.getSettingData();
  }
  fileData1: File = null;
  fileData2: File = null;
  fileData3: File = null;
  handleFileInput(files: FileList, Flag: number) {
    debugger;
    if (Flag == 1) {
      this.fileData1 = files.item(0);
      this.settingForm.get('slide1_img').setValue(this.fileData1.name);
    } else if (Flag == 2) {
      this.fileData2 = files.item(0);
      this.settingForm.get('slide2_img').setValue(this.fileData2.name);
    } else if (Flag == 3) {
      this.fileData3 = files.item(0);
      this.settingForm.get('slide3_img').setValue(this.fileData3.name);
    }
  }

  getUserById(id: number) {
    if (id) {
      this.authService.getUserData(id).subscribe(
        res => {
          if (res) {
            this.userData = res.user;
          }
        },
        err => {
          console.error(err);
        },
        () => {
          console.log(this.userData);
        })
    }
  }

  onSubmit() {
    debugger;
    this.editSetting = this.settingForm.value;

    const formData: FormData = new FormData();

    formData.append('website_title', this.editSetting.website_title);
    formData.append('slide1_title', this.editSetting.slide1_title);
    formData.append('slide2_title', this.editSetting.slide2_title);
    formData.append('slide3_title', this.editSetting.slide3_title);

    formData.append('slide1_desc', this.editSetting.slide1_desc);
    formData.append('slide2_desc', this.editSetting.slide2_desc);
    formData.append('slide3_desc', this.editSetting.slide3_desc);

    if (this.fileData1 && this.fileData1 != null) {
      formData.append('slide1_img', this.fileData1, this.fileData1.name);
    } else {
      this.editSetting.slide1_img = null;
    }

    if (this.fileData2 && this.fileData2 != null) {
      formData.append('slide2_img', this.fileData2, this.fileData2.name);
    } else {
      this.editSetting.slide2_img = null;
    }

    if (this.fileData2 && this.fileData2 != null) {
      formData.append('slide3_img', this.fileData3, this.fileData3.name);
    } else {
      this.editSetting.slide3_img = null;
    }

    if (this.editSetting.id > 0) {
      this.spinner.show();
      formData.append('id', this.editSetting.id.toString())
      this.settingServ.updateSettingData(formData)
        .subscribe(
          next => {
            console.log('next: ', next);
            this.spinner.hide();
            this._toustr.success('تم تحديث اعداداتك بنجاح', 'نجاح');
          },
          err => {
            this.spinner.hide();
            this._toustr.error(err, 'فشل');
          });
    } else {
      this.settingServ.setSettingData(formData)
        .subscribe(
          next => {
            console.log('next: ', next);
            this.spinner.hide();
            this._toustr.success('تم حفظ اعداداتك بنجاح', 'نجاح');
          },
          err => {
            this.spinner.hide();
            this._toustr.error(err, 'فشل');
          });
    }
  }

  // popup functions  --> open --> dismiss
  openModal(content) {
    if (this.userData) {
      this.userForm.patchValue(this.userData);
    } else {
      this.userForm.reset();
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-user-data', size: 'sm' }).result.then((result) => {
      this.updateUserData();
    }, (reason) => {
      console.log(`Dismissed => ${reason}`);
    });
  }

  updateUserData() {
    let data = this.userForm.value;
    const user = new FormData();
    user.append('username', data.username);
    user.append('userid', this.userId.toString());
    if (data.password) {
      user.append('password', data.password);
    }
    this.authService.updateUserData(user)
      .subscribe(
        msg => {
          console.log('user updated', msg.user);
          localStorage.removeItem('userData');
          this.userData = msg.user;
          localStorage.setItem('userData', JSON.stringify(this.userData));
          this._toustr.success('تم الحفظ بنجاح!', 'نجاح');
        },
        err => this._toustr.error(err, 'خطأ'));
  }

  getSettingData() {
    this.settingServ.getSettingData()
      .subscribe(
        res => {
          if (res) {
            this.settingForm.patchValue(res.settings[0]);
          } else {
            this.settingForm.reset();
          }
        },
        err => this._toustr.error(err, 'خطأ'));
  }
}
