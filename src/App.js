import React, {Component} from 'react';
import Particles from 'react-particles-js';


import Navigation from './components/navigation/navigation';
import Logo from './components/logo/logo'
import FaceRecognition from './components/faceRecognition/faceRecognition'
import ImageLinkForm from './components/imageLinkForm/imageLinkForm';
import Rank from './components/rank/rank';

import Signin from './components/signin/signin';
import Register from './components/register/register';

import './App.css';



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

const intialState = {
   input: '',
        imageUrl: '',
        box: {},
        route: 'signin',
        isSignedIn: false,
        user: {
            id: '',
            name: '',
            email: '',
            password: '',
            enteries: 0,
            joined: ''
}
}

class App extends Component {
  
    constructor() {
      super();
    this.state= intialState;
      }
    
    
    loadUser= (data ) => {
        this.setState({user: {
            id: data.id,
            name: data.name,
            email:data.email,
            password: data.password,
            enteries: data.enteries,
            joined: data.joined
                     }})
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
    this.setState({ box: box});
}
    
    
onInputChange = (event)=> {
    this.setState({input: event.target.value});
}

onButtonSubmit= () => {
    this.setState({imageUrl: this.state.input});
    
           fetch('http://localhost:3001/imageurl ', {
                method: 'post', //another parameter because by default fetch is GET 
               headers: {'Content-Type':  'application/json'},
               body: JSON.stringify({
                   input: this.state.input,
               })
           })
        .then(response => response.json())
        .then(response => {
        if(response){
            fetch('http://localhost:3001/image ', {
                method: 'put', //another parameter because by default fetch is GET 
               headers: {'Content-Type':  'application/json'},
               body: JSON.stringify({
                   id: this.state.user.id,
               })
           })
            .then(response => response.json())
            .then(count => {
                this.setState(Object.assign(this.state.user, {enteries: count}))
            })
            .catch(console.log)
        }

        this.displayFaceBox(this.calculateFaceLocation(response))})
    .catch(err => console.log(err));
}

onRouteChange = (route) => {
    if(route==='home') {
        this.setState({isSignedIn: true})
    }
    else if(route=== 'signin') {
        this.setState(intialState)
    }

    this.setState({route: route});
}

    render () {
        
       const {isSignedIn, imageUrl, route, box} =this.state;
    return (
      
    <div className="App">
        <Particles className='particles' params={particleOptions}/>
          
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
          {
          
              route==='home' 
              ? <div>
                  <Logo />
                  <Rank
                    name={this.state.user.name}
                    enteries={this.state.user.enteries}
                    />
                  <ImageLinkForm 
                    onInputChange= {this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                  <FaceRecognition box={box} imageUrl={imageUrl}/> 
              </div>
              : ( 
             route=== 'signin'
              ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register 
          loadUser={this.loadUser}    onRouteChange={this.onRouteChange} />
          )
          
        }
    </div>
  );
        
    }
}

export default App;
