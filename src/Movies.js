import React, { Component } from 'react';
import { Rating, Label } from 'semantic-ui-react'
// import 'semantic-ui-css/semantic.min.css'
// Partial import to prevent conflict with Bootstrap
import 'semantic-ui-css/components/label.css'
import 'semantic-ui-css/components/rating.css'
import axios from 'axios';
import loadingImg from './imgs/iphone-spinner-2.gif'
import MOVIEIDS from './MovieIds'
import './Movies.css';


const APIKEY = '9adc9a37'
// https://www.omdbapi.com/?i=tt3896198&apikey=9adc9a37

export default class Movies extends Component {

    constructor(props) {
        super(props);
        this.state = { loading: true, overlay: "hidden", overlayData:{}, ratingStar:2 };
        this.movieData = {}
    }

    async componentDidMount() {
        // control scrolling
        window.addEventListener('wheel', this.scrollLock, { passive: false }); // modern desktop
        window.addEventListener('mousewheel', this.scrollLock, { passive: false }); // modern desktop
        window.addEventListener('touchmove', this.scrollLock, { passive: false }); // mobile
        // window.addEventListener('keydown', this.scrollLock, false);

        for (let id of MOVIEIDS) {
            var response = await axios.get(`https://www.omdbapi.com/?i=${id}&apikey=${APIKEY}`);
            this.movieData[id] = response.data;   
        }
        this.setState({ loading: false });
    }
    
    scrollLock = function (e) {
        if(this.state.overlay === 'visible'){
            e.preventDefault();
        }
        return false;
    }.bind(this)


 // Overlay
    showOverlay = function (data) {
        data.ratingStar = Math.round(parseFloat(data.imdbRating)/2)
        this.setState({overlay: 'visible', overlayData: data})
    }.bind(this)

    hideOverlay = function () {
        this.setState({overlay: 'hidden'})
    }.bind(this)


    render = function () {
        if(this.state.loading) {
            var posterDivs = 
            <div className="w-100 p-5 d-flex flex-column align-items-center">
                <img src={loadingImg} alt="loading"></img>
            </div>
        }
        else {
            var posterDivs = Object.values(this.movieData).map((data, index) => 
                <div className="m-2 -shadow poster-container">
                    <img src={data.Poster} className="poster" key={index}
                    onClick={()=>this.showOverlay(data)}></img>
                </div>
            )
        }

        let oData = this.state.overlayData
        var labelDivs = oData.Genre?.replace(' ', '').split(',').map(genre => 
            <Label as='a' color='grey' key={genre}>{genre}</Label>
        )
        var overlayDiv = 
        <div id="movie-overlay" className={ this.state.overlay + " d-flex justify-content-center align-items-center"}
        onClick={this.hideOverlay}>
            <div className="overlay-center">
                <h2 className="mb-2"><i>{oData.Title}</i></h2>
                <p className="mb-2">Director: {oData.Director}</p>
                <div className="mb-2 d-flex flex-row justify-content-start align-items-baseline" style={{'font-weight':400}}>
                    <p class="m-0 mr-2">Rating: {oData.imdbRating}</p>
                    <Rating icon='star' rating={oData.ratingStar} maxRating={5} disabled/>
                </div>
                <div className="mb-2 d-flex flex-row justify-content-start align-items-baseline flex-wrap-around">
                    {labelDivs}
                </div>
                <img src={oData.Poster} className="overlay-poster"></img>
            </div>
        </div>

        return (
        <div className="row main">
            <div className="w-100 h-100 d-flex flex-wrap justify-content-center align-items-center">
                {posterDivs}
            </div>
            {overlayDiv}
        </div>
        )
    }
}