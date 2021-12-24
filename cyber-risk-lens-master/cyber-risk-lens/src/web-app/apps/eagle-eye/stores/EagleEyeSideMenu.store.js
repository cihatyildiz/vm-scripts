import { decorate, observable } from "mobx";


class EagleEyeSideMenuStore {
  constructor() {
    let showIconsOnly=null
  }
}



decorate(EagleEyeSideMenuStore, {
  showIconsOnly: observable
})

export default new EagleEyeSideMenuStore();