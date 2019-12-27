import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SettingService } from './shared/setting.service';

// declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // title = 'ADs Blog';

  constructor(private _title: Title, private _settingServ: SettingService) { }
  ngOnInit() {
    // let head = JSON.parse(this.readTextFile('../assets/settings/header.txt'));
    // if (head) {
    //   let title = head[0].main_data.site_title;
    //   this._title.setTitle(title);
    // }
    this.getTitle();
  }
  getTitle() {
    this._settingServ.getSettingData().subscribe(res => {
      if (res) {
        this._title.setTitle(res.settings[0].website_title);
      }
    })
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
}
