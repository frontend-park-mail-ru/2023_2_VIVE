import authView from './authView.js';

export default class appAuthView extends authView {
  render() {
    console.log('rendering appAuth');
    super.render('app');
  }
}
