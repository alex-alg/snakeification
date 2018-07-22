import _ from 'lodash';
import './style.css';
import Ta from './ta.jpg';
import Data from './data.csv';
import Data2 from './data2.csv';

  function component() {
    var element = document.createElement('div');

    // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

    // Add the image to our existing div.
    var myIcon = new Image();
    myIcon.src = Ta;
    element.appendChild(myIcon);

    var data = JSON.parse(Data);
    console.log(data.firstName);
    console.log(Data2);

    return element;
  }

  document.body.appendChild(component());