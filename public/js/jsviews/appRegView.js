import regView from './regView.js';

export default class appRegView extends regView {
  render() {
    console.log('rendering appReg');
    super.render('app');
  }
}
