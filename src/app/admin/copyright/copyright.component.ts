import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'admin-copyright',
  templateUrl: './copyright.component.html',
  styleUrls: ['./copyright.component.css']
})
export class CopyrightComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.readTextFile('../../../assets/settings/copyright.html');
    console.log(this.htmlcontent);
  }
  htmlcontent: any;
  readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = () => {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          this.htmlcontent = rawFile.responseText;
        }
      }
    }
    rawFile.send(null);
  }

}
