import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }
  links: any[] = [];
  about: any = <any>{};
  tags: any[] = [];
  footer: any[] = [];
  ngOnInit() {
    this.footer = JSON.parse(this.readTextFile('../../../assets/settings/footer.txt'));
    // console.log(this.footer);
    if (this.footer) {
      this.links = this.footer[0].links;
      this.about = this.footer[0].about;
      this.tags = this.footer[0].tags;
    }
    this.htmlstring = this.readTextFile('../../../assets/settings/copyright.html');
    // console.log(this.htmlstring);
  }
  htmlstring: string;
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
