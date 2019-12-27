import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Utility } from "./utility";


interface generalObject {
  name: string;
  value: any;
  keys: any;
  from?: any;
  to?: any;
}

interface subjectkeyval {
  subkey: string;
  subjectObj?: Subject<any>;
  behaviorSubjectObj?: BehaviorSubject<any>;
}

export interface Action {
  type: string;
  payload?: any;
}
export const UIAction = {
  TabActived: 'Tap Actived',
  TabVisited: 'Tap Visited',
  AddTrans: 'Add Trans',
  AddAndStepTrans: 'Add And Step Trans',
  CommitTrans: 'Commit Trans',
  RollbackTrans: 'Rollback Trans',
  TransStepped: 'Trans Stepped',
  OpenNewLink: 'Open New Link',

  GetTransData: 'Get Transaction data',

}
export const UISessionKeys = {
  Transactions: 'Transactions',
  ActivatedAppCodes: 'ActivatedApplicationCodes'

}
export const NoChangeReducer = (state = [], action) => {
  return state;
}
@Injectable()
export class UserSessionService {


  private userSessionKeys: any = {};
  // private userSessionKeys$ = new Subject<any>();
  private subjectsarr: subjectkeyval[];

  private modalKeys: any = {};
  private modalKeys$ = new Subject<any>();
  private modalClose$ = new Subject<any>();
  private btnCtrlViewChild: any = {};
  private UIState: any = {};
  private dispatcher: any;


  constructor() {
    this.subjectsarr = [];
    this.dispatcher = NoChangeReducer;
  }

  /***********************************************************************************************
  * used to add key to user session object 
  * @param key
  * @param value
  */
  setSessionKey(key: string, value: any, propagateChanges?: boolean) {
    if (propagateChanges == undefined) propagateChanges = true;
    let x$ = (this.subjectsarr.find(a => a.subkey == key));
    if (x$ == undefined) {
      this.subjectsarr.push({ subkey: key, subjectObj: new Subject<any>(), behaviorSubjectObj: new BehaviorSubject<any>({}) });
    }

    this.userSessionKeys[key] = { name: key, value: value, keys: {}, propagateChanges: propagateChanges } as generalObject;
    if (propagateChanges) {
      let dd$ = (this.subjectsarr.find(a => a.subkey == key));
      if (dd$.subjectObj) dd$.subjectObj.next(this.userSessionKeys[key]);
      if (dd$.behaviorSubjectObj) dd$.behaviorSubjectObj.next(this.userSessionKeys[key]);
    }
  }
  eventEmit(key: string, value: any) {
    this.setSessionKey(key, value, true);
    delete this.userSessionKeys[key];
  }
  /***********************************************************************************************
  * used to update key property to user session object 
  * @param key
  * @param property
  * @param value
  */
  updateSessionKey(key: string, updateObject: any, propagateChanges?: boolean) {
    if (propagateChanges == undefined) propagateChanges = true;
    if (this.userSessionKeys[key]) {
      this.userSessionKeys[key].value = Object.assign({}, this.userSessionKeys[key].value, updateObject);
    }
    if (propagateChanges) {
      let dd$ = (this.subjectsarr.find(a => a.subkey == key));
      if (dd$ && dd$.behaviorSubjectObj)
        dd$.behaviorSubjectObj.next(this.userSessionKeys[key]);
    }
  }


  /***********************************************************************************************
  * return observable for user session object  
  * @param key
  */
  getSessionKey$(key: string) {
    let dd$ = (this.subjectsarr.find(a => a.subkey == key));
    if (dd$) {
      return dd$.subjectObj.asObservable();
    } else {
      dd$ = { subkey: key, subjectObj: new Subject<any>() }
      this.subjectsarr.push(dd$);
      return dd$.subjectObj.asObservable();
    }

  }
  subscribeToKey$(key: string) {
    let dd$ = (this.subjectsarr.find(a => a.subkey == key));
    if (dd$ && dd$.behaviorSubjectObj) {
      return dd$.behaviorSubjectObj.asObservable();
    } else {
      dd$ = { subkey: key, behaviorSubjectObj: new BehaviorSubject<any>({}), subjectObj: new Subject<any>() }
      this.subjectsarr.push(dd$);
      return dd$.behaviorSubjectObj.asObservable();
    }
  }
  /***********************************************************************************************
  * return key from user session object generic type
  * @param key
  */
  getSessionKey<T>(key: string): T {

    const temp = key.split('.');
    let elem = null;
    if (temp.length > 1) {
      if (this.userSessionKeys[temp[0]]) {
        const temp0 = this.userSessionKeys[temp[0]].keys;
        if (temp0[temp[1]]) {
          elem = temp0[temp[1]].value;
        }

      }
    } else {
      if (this.userSessionKeys[temp[0]]) {
        elem = this.userSessionKeys[temp[0]].value;
      }
    }
    return elem;
  }
  /***********************************************************************************************
   * return obervable for only key in data object
   * @param key
   */

  removeSessionKey<T>(key: string, parent?: string) {

    if (parent && this.userSessionKeys[parent]) {
      delete this.userSessionKeys[parent][key];
    } else {
      delete this.userSessionKeys[key];
      let indx = (this.subjectsarr.findIndex(a => a.subkey == key));
      this.subjectsarr.splice(indx, 1);

    }

  }
  deleteSubjectarr() {
    this.subjectsarr.forEach((item, index) => {
      if (this.deleteableKey(item.subkey)) {
        this.subjectsarr.splice(index, 1);
      }
    })
  }
  /**********************************************************************************************
   * used to listen in all object data
   * return observable for data object
   * @param key
   */


  /*************************************************************************************************
   * return data object
   */
  setModalKeys(modalName: string, parentName?: string, inputsObj?: any) {
    this.modalKeys[modalName] = { name: modalName, parent: parentName, isClose: null, inputs: inputsObj, output: null };
    this.modalKeys$.next(this.modalKeys[modalName]);
  }

  /*************************************************************************************************
  *
  */
  getModalKey<T>(modalName: string): T {
    return this.modalKeys[modalName];
  }
  /*************************************************************************************************
  *
  */
  getAllModalKeys() {
    return this.modalKeys;
  }
  /*************************************************************************************************
  *
  */
  getModalKey$(): Observable<any> {
    return this.modalKeys$.asObservable();

  }

  /*************************************************************************************************
  * 
  */
  closeModalKey(modalName: string, outputObj) {
    if (this.modalKeys[modalName]) {
      this.modalKeys[modalName].isClose = true;
      this.modalKeys[modalName].output = outputObj;
      this.modalClose$.next(this.modalKeys[modalName]);
      this.removeModalKeys(modalName);
    }
  }
  /*************************************************************************************************
  * 
  */
  onModalClose$() {
    return this.modalClose$.asObservable();
  }
  /*************************************************************************************************
 * 
 */
  removeLinkKeys(newLink) {

    const oldLinkProp = Object.getOwnPropertyNames(this.userSessionKeys).find(name => name == 'link');
    if (!oldLinkProp) {
      return;
    }
    const oldLinkValue = this.userSessionKeys[oldLinkProp];
    if (!oldLinkValue && !oldLinkValue.value) {
      return;
    }
    if (newLink.code != oldLinkValue.value.code) {
      let keys = Object.getOwnPropertyNames(this.userSessionKeys);
      keys.forEach((value, index, array) => {
        if (this.deleteableKey(value)) {
          this.removeSessionKey(value);
          this.UIState = {};
        }
      }
      );
    }

    //--
    this.deleteSubjectarr();
  }
  deleteableKey(key: string) {
    if (key != 'DashBoardParms' &&
      key != 'SecLoginPrivileges' &&
      !key.endsWith('RouterParms') &&
      !key.endsWith('TRANSSERIAL') &&
      !key.endsWith('PermisionType') &&
      !key.endsWith('ExaminationType') &&
      !key.endsWith('link') &&
      !key.endsWith('toggleFavArea') &&
      !key.endsWith('tabType') &&
      !key.endsWith('cashierParms') &&
      !key.endsWith('receiptSerial') &&
      !key.endsWith('parentServiceObj') &&
      !key.endsWith('extractedClaim') &&
      !key.endsWith('GetItemsTemplate') &&
      !key.endsWith('ObtCashDue') &&
      !key.endsWith('EmployeesPanner')
    ) {

      return true;
    }
    return false;
  }
  /*************************************************************************************************
* 
*/
  removeModalKeys(value: string) {
    delete this.modalKeys[value];

  }

  setBtnCtrl(_btnsCtrl) {
    this.btnCtrlViewChild = _btnsCtrl;
  }

  getBtnCtrl() {
    return this.btnCtrlViewChild;
  }

  UIActiveTree: { appCpdesid: number, status: boolean }[] = [];
  //-------------------
  setUIState(e: any, parentUIKey: string) {
    //--------------------------
    let tree = this.initUiTree(parentUIKey);
    this.deActivateUi(tree, parentUIKey);
    tree[parentUIKey]['childs'][e.serial] = true;


    if (!this.UIState['UIActive']) { this.UIState['UIActive'] = {} };
    this.UIState['UIActive'][e.serial] = true;
    this.setUIKeyVisited(e.serial);
    this.tellUIKeyObservers(e, parentUIKey);
    if (this.UIState['UIActiveTree'] && this.UIState['UIActiveTree']['undefined']) {
      Utility.test = this.UIState['UIActiveTree']['undefined']['childs']
      let x = [];
      x = Object.entries(Utility.test)
      let y = x.filter(s => s[1] == true)
      let indexes = [];
      for (let i = 0; i < y.length; i++) {
        indexes.push(y[i][0])
      }
      Utility.UiActive = indexes.join('-')
    }
  }

  tellUIKeyObservers(e: any, parentUIKey: string) {
    const key = e.serial + '__' + parentUIKey;
    let x$ = (this.subjectsarr.find(a => a.subkey == key));
    if (x$ == undefined)
      this.subjectsarr.push({ subkey: key, behaviorSubjectObj: new BehaviorSubject<any>({}) });

    let dd$ = (this.subjectsarr.find(a => a.subkey == key));
    dd$.behaviorSubjectObj.next({ keyValue: key, isActive: true });
  };
  private setUIKeyVisited(key: string) {
    if (!this.UIState['UIVisited']) { this.UIState['UIVisited'] = {} };
    this.UIState['UIVisited'][key] = true;
  }
  initUiTree(parentUIKey: string) {
    if (!this.UIState['UIActiveTree']) { this.UIState['UIActiveTree'] = {} };
    let tree = this.UIState['UIActiveTree'];
    tree[parentUIKey] = tree[parentUIKey] || {};
    tree[parentUIKey]['childs'] = tree[parentUIKey]['childs'] || {};
    return tree;
  }
  private deActivateUi(uitree, parentUIKey) {
    if (uitree[parentUIKey] && uitree[parentUIKey]['childs']) {
      Object.keys(uitree[parentUIKey]['childs']).forEach(key => {
        this.deActivateUi(uitree, key);
        uitree[parentUIKey]['childs'][key] = false;
        this.UIState['UIActive'][key] = false;
      });
    }
  }
  activateUiKey(key, parentUIKey) {
    this.setUiKey(key, parentUIKey, true);
    this.setUIKeyVisited(key);
  }
  deActivateUiKey(key, parentUIKey) {
    this.setUiKey(key, parentUIKey, false);
  }
  private setUiKey(key: string, parentUIKey: string, flag: boolean) {
    let tree = this.initUiTree(parentUIKey);
    tree[parentUIKey]['childs'][key] = flag;
    if (this.UIState['UIActive'])
      this.UIState['UIActive'][key] = flag;

  }

  queryUIKey(key: string, parentUIKey: string): boolean {
    let tree = this.initUiTree(parentUIKey);
    let keyVal = tree[parentUIKey]['childs'][key];
    if (keyVal == undefined) keyVal = false;
    return keyVal;
  };
  queryParentUIKey(parentUIKey: string) {
    let tree = this.initUiTree(parentUIKey);
    return tree[parentUIKey] ? true : false;
  }
  queryVisitedUI(key: string, parentUIKey: string) {
    let keyVal = this.UIState['UIVisited'] ? this.UIState['UIVisited'][key] : false;
    if (keyVal == undefined) keyVal = false;
    return keyVal;
  };

  //---------------------------
  getUIState$(key: string) {
    let dd$ = (this.subjectsarr.find(a => a.subkey == key));
    if (dd$ == undefined) {
      dd$ = { subkey: key, behaviorSubjectObj: new BehaviorSubject<any>({}) }
      this.subjectsarr.push(dd$);
    }
    return dd$.behaviorSubjectObj.asObservable();
  }
  setUIStateAction(_action: Action): boolean {
    let key = UISessionKeys.Transactions;
    //---------------------------------
    switch (_action.type) {
      case UIAction.TabActived:
        key = UISessionKeys.ActivatedAppCodes;
        this.UIState[key] = Object.assign({}, this.UIState[key], _action.payload);
        break;
      case UIAction.AddTrans:
      case UIAction.CommitTrans:
      case UIAction.RollbackTrans:
      case UIAction.TransStepped:
      case UIAction.AddAndStepTrans:
        this.UIState[key] = Object.assign({}, this.UIState[key], { 'name': _action.payload, 'status': _action.type });
        break;
      default:
        break;

    }
    this.propagateUIState(key);
    return true;
  }
  checkTransStatus(_action: Action): boolean {

    const key = UISessionKeys.Transactions;
    const status = this.UIState[key] ? this.UIState[key]['status'] : '';
    const transName = this.UIState[key] ? this.UIState[key]['name'] : '';
    let msg = '';
    switch (_action.type) {
      case UIAction.OpenNewLink:
        if (status == UIAction.TransStepped) {
          console.log('previous transaction not completed. ');
          return false;
        }
        break;
      case UIAction.AddTrans:
      case UIAction.AddAndStepTrans:
        if ((status == UIAction.TransStepped || status == UIAction.AddAndStepTrans) && transName != _action.payload) {
          console.log('previous transaction not completed ');
          return false;
        }
        break;
      case UIAction.CommitTrans:
        if (status == UIAction.RollbackTrans || status == UIAction.CommitTrans) {
          alert('previous trans allready ended ');
          return false;
        }
        break;
      case UIAction.RollbackTrans:
        if (status == UIAction.RollbackTrans || status == UIAction.CommitTrans) {
          alert('previous trans  ended ');

          return false;
        }
        break;
    }
    return true;
  }
  propagateUIState(key: string) {
    let x$ = (this.subjectsarr.find(a => a.subkey == key));
    if (x$ == undefined)
      this.subjectsarr.push({ subkey: key, behaviorSubjectObj: new BehaviorSubject<any>({}) });

    let dd$ = (this.subjectsarr.find(a => a.subkey == key));
    dd$.behaviorSubjectObj.next(this.UIState[key]);

  }
  resetUIState(_action: Action): boolean {
    if (!this.checkTransStatus(_action)) {
      return false;
    }
    this.UIState = {};
    return true;
  }
  dispatch(_action: Action) {
    if (this.dispatcher)
      this.UIState['TransData'] = this.dispatcher(this.UIState['TransData'], _action);
  }
  queryStor(_action: Action) {
    if (this.dispatcher)
      return this.dispatcher(this.UIState['TransData'], _action);
  }
  getStore(_action: Action) {
    switch (_action.type) {
      case UIAction.GetTransData:
        return this.UIState['TransData'];
    }
  }

  beginTransaction(transName: string) {
    this.setUIStateAction({ type: UIAction.AddTrans, payload: transName });
  };
  /**
   * 
   * @param reducer (reducer function ) pure function use
   */
  setdispatcher(reducer: any) {
    this.dispatcher = reducer;
  };
  getTransactionData(): any {
    return this.getStore({ type: UIAction.GetTransData });
  };
}
