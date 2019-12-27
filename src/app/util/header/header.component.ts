import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SettingService } from '../../shared/setting.service';
import { Settings } from '../../types.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  settingData: Settings = <Settings>{};
  pageTitle: string = '';
  @Input() hideSlider: number = 0;

  main_data: any = <any>{};
  header_links: any = <any>{};
  htmlcontent: string = '';
  header: any[] = [];
  info: any[] = [];
  infoObj: any = <any>{};
  constructor(private _router: Router, private setting: SettingService) { }

  ngOnInit() {
    this.header = JSON.parse(this.readTextFile('../../../assets/settings/header.txt'));
    this.info = JSON.parse(this.readTextFile('../../../assets/settings/info.txt'));
    if (this.header) {
      this.main_data = this.header[0].main_data;
      if (this.main_data) {
        this.htmlcontent = this.main_data.phone;
      }
      this.header_links = this.header[0].header_links;
    }
    if(this.info){
      this.infoObj = this.info[0].data;
    }
    this.getSettingData();
    let url = this._router.url;
    if (url === '/home') {
      this.pageTitle = this.infoObj.home_page_title;
    } else if (url === '/products') {
      this.pageTitle = this.infoObj.products_page_title;
    } else if (url === '/articles') {
      this.pageTitle = this.infoObj.articles_page_title;
    } else if (url === '/about') {
      this.pageTitle = 'من نحن';
    } else if (url === '/contact') {
      this.pageTitle = 'اتصل بنا'
    } else {
      this.pageTitle = 'آخري';
    }
  }

  readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    var fileData = '';
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = () => {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          fileData = rawFile.responseText;
        }
      }
    }
    rawFile.send(null);
    return fileData;
  }


  getSettingData() {
    this.setting.getSettingData()
      .subscribe(
        res => {
          if (res) {
            this.settingData = res.settings[0];
          }
        },
        err => console.error(err));
  }
}
