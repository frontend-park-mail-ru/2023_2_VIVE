import authView from './authView.js';

export default class empAuthView extends authView {
  render() {
    console.log('rendering empAuth');
    super.render('emp');
  }
}
