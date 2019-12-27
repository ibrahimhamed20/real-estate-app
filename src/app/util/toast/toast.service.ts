import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class ToastService {
  constructor(
    private toastr: ToastrService
  ) {}
  public activate(
    message?: string,
    title?: string,
    messageType?: number
  ): void {}
  // ****************************************************************
  public activateMsg(message?: string) {
    this.toastr.error('', message, { closeButton: true });
    // this.translate.get(message).subscribe(msg => {
    //   // this.activate(msg);
    // });
  }
  public activateRequestError(message?: string, error?: { error: string, title: string,stackTrace:string, data: any}) {
      if (error && error.error) {
        this.toastr.error(`${error.error}`, error.title, {
            closeButton: true,
            timeOut: 10000,
            tapToDismiss: false,
            easeTime: 700,
            positionClass: 'toast-top-full-width'
          });
          this.toastr.error(`${error.stackTrace}`, 'stackTrace', {
            closeButton: true,
            timeOut: 10000,
            tapToDismiss: false,
            easeTime: 700,
            positionClass: 'toast-top-full-width'
          });
      }else {
          this.toastr.error(message, '', {
              closeButton: true,
              timeOut: 10000,
              tapToDismiss: false,
              easeTime: 700,
            });
     }
  }
  /** *********************************************************
   * return true if msgId = 5
   * else return continue flag {true , false}
   */
  public HandelDbMessages(messages?: Message[]): boolean {
    if (messages && messages.length > 0) {
      const messageType = messages[0].msgID == 5 ? 1 : 2;
      if (messageType == 1) {
        this.toastr.success(messages[0].msgBodyAr, messages[0].msgHeaderAr, {
          closeButton: true,
          positionClass: 'toast-top-left'
        });
      } else {
        if (messages[0].msgID !== 5) {
          messages.forEach(element => {
            this.toastr.error(element.msgBodyAr,element.msgHeaderAr,
              {
                closeButton: true,
                //extendedTimeOut: 6000,
                positionClass: 'toast-top-center'
              }
            );
          });
          // this.toastr.error(
          //   this.translate.currentLang == 'ar'
          //     ? messages[0].msgBodyAr
          //     : messages[0].msgBodyEn,
          //   this.translate.currentLang == 'ar'
          //     ? messages[0].msgHeaderAr
          //     : messages[0].msgHeaderEn,
          //   {
          //     closeButton: true,
          //     extendedTimeOut: 1000,
          //     positionClass: 'toast-top-center'
          //   }
          // );
        }
      }
      return messages[0].msgID == 5 ? true : false;
    } else {
        return true;
    }
  }
}

export class Message {
  msgID: number;
  msgHeaderAr: string;
  msgHeaderEn: string;
  msgBodyAr: string;
  msgBodyEn: string;
}
