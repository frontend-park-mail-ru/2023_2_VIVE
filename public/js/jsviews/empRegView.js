import regView from './regView.js';

export default class empRegView extends regView {
  render() {
    console.log('rendering appReg');
    super.render('emp');
  }
}
