import React, { Component } from 'react'
import './game.scss';
import { getDeckOfCards, getCard } from './../../shared/util';
import { withRouter } from 'react-router-dom'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { GiCard10Hearts, GiCardAceHearts, GiBlackHandShield } from "react-icons/gi";

export default class game extends Component {

    constructor(props) {
      super(props)
      this.state = {
         gamestarted: false,
         deckId: 0,
         cardData: {},
         cardsRemaining: 0
      };
    };

    async componentDidMount(){
        let res = await getDeckOfCards();
        let drawCard = await getCard(res.deck_id, 1);
        console.log({res});
        console.log({drawCard});
        this.setState({

        })
    }
    
    startGame = () => {
        this.setState({ gamestarted: true });
    }

    render() {
        return (
            <div id="game-wrapper">
              <Container className="play-wrapper">
                <Row>
                  <Col>
                    <div className="game-board">
                        <h3 className="title">
                        Black Jack 
                        <img src="/static/img/logo.png" class="logo-image"/>
                        </h3>
                        <div className="dealer-section">
                            <GiBlackHandShield className="dealer-hand"/>
                            {
                                this.state.gamestarted ?
                                <div className="dealer-card-holder">
                                    d cards
                                </div>
                                : ''
                            }
                        </div>
                        {
                            this.state.gamestarted ?
                            ''
                            :
                            <div className="deal-btn">
                                <Button variant="danger" onClick={this.startGame}>Start</Button>    
                            </div>
                        }
                        <div className="player-section">
                            {
                                this.state.gamestarted ?
                                <div className="player-card-holder">
                                    d cards
                                </div>
                                : ''
                            }
                            <GiBlackHandShield className="player-hand"/>
                        </div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
        )
    }
}
