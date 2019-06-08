import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

import Navigation from './components/navigation/navigation';
import Logo from './components/logo/logo'
import FaceRecognition from './components/faceRecognition/faceRecognition'
import ImageLinkForm from './components/imageLinkForm/imageLinkForm';
import Rank from './components/rank/rank';

import './App.css';


const app = new Clarifai.App({
    apiKey: '636faf6222004476b96b13b0b4c9a90f'
});

const particleOptions ={
    
	    "particles": {
	        "number": {
	            "value": 50
	        },
	        "size": {
	            "value": 3
	        }
	    },
	    "interactivity": {
	        "events": {
	            "onhover": {
	                "enable": true,
	                "mode": "repulse"
	            }
	        }
	    }


}

class App extends Component {
  
    constructor() {
      super();
    this.state= {
        input: '',
        imageUrl: '',
        box: {},
    }
      }
 
calculateFaceLocation= (res) => {
    
    const clarifaiFace=res.outputs[0].data.regions[0].region_info.bounding_box;
    const image =document.getElementById('inputimage');
    const width=Number(image.width);
    const height=Number(image.height); 
    
    return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row*height,
        rightCol: width - (clarifaiFace.right_col*width),
        bottomRow: height - (clarifaiFace.bottom_row*height),
    }
}

displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box});
}
    
    
onInputChange = (event)=> {
    this.setState({input: event.target.value});
}

onButtonSubmit= () => {
    this.setState({imageUrl: this.state.input});
    
    app.models.predict(
        Clarifai.FACE_DETECT_MODEL, this.state.input)
        .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
}

    render () {
    return (
      
    <div className="App">
          <Particles className='particles' params={particleOptions}/>
      <Navigation />
      <Logo />
      <Rank/>
      <ImageLinkForm 
        onInputChange= {this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
      <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/> 
    </div>
  );
        
    }
}

export default App;