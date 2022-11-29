import React,{Component} from 'react';
import SignIn from './components/SignIn/SignIn';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ParticlesBg from 'particles-bg';

import './App.css';
import Register from './components/Register/Register';



const defaultState = {
  userInput: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user : {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = defaultState;
    
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {

    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputImage')
    const width = Number(image.width);
    const height = Number(image.height)
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height- (clarifaiFace.bottom_row * height)
    }
  }

  displayBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({userInput:event.target.value});
  }
  

  onPictureSubmit = () => {
    this.setState({imageUrl: this.state.userInput})
    fetch('http://localhost:3000/imageurl',{
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.userInput
          })
       })
    .then(response => response.json())
    .then(response => {
      if(response){
        fetch('http://localhost:3000/image',{
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries:count}))
          })
          .catch(console.log)
      }
      this.displayBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err))    
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(defaultState)
    }else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render(){
    const { imageUrl, box, route, isSignedIn} = this.state;
    const { name, entries} = this.state.user;
    return (
      <div className="App">
        <ParticlesBg type='cobweb' bg={true}/>
        <Navigation isSignedIn ={isSignedIn} onRouteChange={this.onRouteChange}/>
        {route === 'home' 
          ?<div>
            <Logo/>
            <Rank name={name} entries={entries}/>
            <ImageLinkForm onInputChange= {this.onInputChange} onPictureSubmit= {this.onPictureSubmit}/>
            <FaceRecognition box ={box} imageUrl={imageUrl}/>          
          </div>
          :(route === 'signin'
            ?<div>
            <Logo/>
            <SignIn loadUser={this.loadUser} onRouteChange= {this.onRouteChange}/>            
            </div>
            :(route === 'signout'
                ?<div>
                  <Logo/>
                  <SignIn loadUser={this.loadUser} onRouteChange= {this.onRouteChange}/>
                </div>
                :<div>
                  <Logo/>
                  <Register loadUser={this.loadUser} onRouteChange= {this.onRouteChange}/>
                </div>
            )
         
          )
        }
      </div>
    );
  }
}

export default App;
