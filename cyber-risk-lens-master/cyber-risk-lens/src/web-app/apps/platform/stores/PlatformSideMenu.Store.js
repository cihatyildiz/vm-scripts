import { decorate, observable } from "mobx";


class PlatformSideMenuStore {
  constructor () {
    let showIconsOnly = null
  }
}



decorate( PlatformSideMenuStore, {
  showIconsOnly: observable
} )

export default new PlatformSideMenuStore();
