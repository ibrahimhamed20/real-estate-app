import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  aboutData: any = <any>{};
  constructor() { }
  info: any[] = [];
  infoObj: any = <any>{};
  ngOnInit() {
    this.info = JSON.parse(this.readTextFile('../../../assets/settings/info.txt'));
    if(this.info){
      this.infoObj = this.info[0].data;
    }
    this.htmlcontent = this.readTextFile('../../../assets/settings/about.html');
    
  }
  htmlcontent: any;
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
