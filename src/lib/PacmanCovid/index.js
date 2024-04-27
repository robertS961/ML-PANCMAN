import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Dialog, DialogContentText, DialogContent, DialogActions, Button} from '@mui/material';

import { KEY_COMMANDS } from './constants';
import getInitialState from './state';
import { animate, changeDirection } from './game';
import Stage from './Stage';
import TopBar from './TopBar';
import AllFood from './Food/All';
import Monster from './Monster';
import Player from './Player';

//const covid19Banner = require('./assets/images/covid19-banner.min.jpg');
//const logo = require('./assets/images/covid3.svg');

let $t = require('./locales/pt.json');
//let $t = require('./locales/en.json');


export default class PacmanCovid extends Component {
  constructor(props) {
    super(props);

    this.props = props
    this.state = {
      ...getInitialState(),
      isShowDialog: false,
      // isRunning: props.isRunning
    };

    // Aqui utilizo o `bind` para que o `this` funcione dentro d0 callback
    this.handleTheEnd = this.handleTheEnd.bind(this);

    // teclas de controle
    this.onKey = (evt) => {
      if (KEY_COMMANDS[evt.key] !== undefined) {
        return this.changeDirection(KEY_COMMANDS[evt.key]);
      }
      return -1;
    };
  }

  componentDidMount() {
    /**
     * É invocado imediatamente após um componente ser montado (inserido na árvore).
     * Inicializações que exijam nós do DOM devem vir aqui.
     * Se precisar carregar data de um endpoint remoto, este é um bom lugar para instanciar sua requisição.
     * Este método é um bom lugar para colocar qualquer subscrição.
     * Se fizer isto, não esqueça de desinscrever no componentWillUnmount().
     */
    this.timers = {
      start: null,
      animate: null
    };

    if (!this.props.isRunning) {
      return
    }
  }

  componentDidUpdate(prevProps) {
    window.addEventListener('keydown', this.onKey);
    if (prevProps.isRunning !== this.props.isRunning) {
      if (this.props.isRunning) {
        this.timers.start = setTimeout(() => {

          this.setState({ stepTime: Date.now() });

          this.step();

        }, 3000);
      } 
    }
   
  }

  componentWillUnmount() {
    /**
     * Estes métodos são chamados quando um componente está sendo removido do DOM:
     */
    document.body.style.overflow = 'unset';
    window.removeEventListener('keydown', this.onKey);

    clearTimeout(this.timers.start);
    clearTimeout(this.timers.animate);
  }

  step() {
    const result = animate(this.state);

    this.setState({
      ...result
    })

    clearTimeout(this.timers.animate);
    this.timers.animate = setTimeout(() => this.step(), 20);
  }

  changeDirection(direction) {
    this.setState(changeDirection(this.state, { direction }));
  }

  componentWillReceiveProps() {
    console.log('App - componentWillReceiveProps')
  }

  handleTheEnd() {
    // this.setState({
    //   isRunning: false
    // })
    this.props.setIsRuning(false)
    this.setState({ isShowDialog: true });

    if (this.state.lost ) {
      // show lose dialog
      this.setState({ isShowDialog: true });
        if (result.value){
          // Play Again
          this.componentWillUnmount()
          this.setState(getInitialState())
          this.componentDidMount()
        }
     ;

    } else {
    //  show win 
          if (result.value){
            // Play Again
            // this.setState({
            //   isRunning: true
            // })
            this.props.setIsRuning(true)
            this.componentWillUnmount()
            this.setState(getInitialState())
            this.componentDidMount()
          }
   
    }

    if (this.state.onEnd) {
      this.state.onEnd()
    }
  }

  render() {
    if (this.state.hasError) {
      // renderizar qualquer UI como fallback
      return <h1>Something went wrong.</h1>;
    }

    const props = { gridSize: 12, ...this.props };

    const monsters = this.state.monsters.map(({ id, ...monster }) => (
      <Monster key={id} {...props} {...monster} />
    ));

    return (
      <div className="wrapper-container">
        <Stage {...props} />
        <TopBar $t={$t} score={this.state.score} lost={this.state.lost} />
        <AllFood {...props} food={this.state.food} />
        {monsters}
        <Player {...props} {...this.state.player} lost={this.state.lost} isRunning={this.props.isRunning} onEnd={this.handleTheEnd} />
        <Dialog
          open={this.state.isShowDialog}
          // open={true}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You have been infected! Do you want to play again?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>{}}>Yes, Play Again</Button>
            <Button onClick={()=>this.setState({isShowDialog:false})} > Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

PacmanCovid.propTypes = {
  isRunning: PropTypes.bool.isRequired,
  setIsRuning: PropTypes.func.isRequired,
  gridSize: PropTypes.number.isRequired,
  onEnd: PropTypes.func
};
