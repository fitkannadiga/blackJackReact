import React, { Component } from 'react'
import './game.scss';
import { getDeckOfCards, getCard } from './../../shared/util';
import { Container, Row, Col, Button } from 'react-bootstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';


export default class game extends Component {

    constructor(props) {
      super(props)
      this.state = {
        sound: '/static/draw_card.mp3',
        gamestarted: false,
        displayActions: false,
        hidePass: false,
        winnerDeclared: false,
        winnerMsg: '',
        deckId: 0,
        cardData: [],
        cardsRemaining: 0,
        playerCards: [],
        dealerCards: [],
        playerTotal: 0,
        dealerTotal: 0,
        activeUser: 'player' // player or dealer it switches
      };
      
      this.audio = new Audio(this.state.sound);
    };

    // once component loads, get a fresh deck of cards and keep
    // ready for use
    async componentDidMount(){    
        let res = await getDeckOfCards();
        this.setState({
            deckId: res.deck_id
        });
    }
    
    // once user starts the game, start by drawing 4 cards from the pile
    // 3 open and 1 down for the dealer
    startGame () {
        this.setState({ gamestarted: true });
        this.drawCards('player');
        setTimeout(() => {
            this.drawCards('dealer');
            setTimeout(() => {
                this.drawCards('player');
                setTimeout(() => {
                    this.drawCards('dealer');
                }, 1200);
            }, 1200);
        }, 1200);
    }

    async drawCards (id){
        let cardData = await getCard(this.state.deckId, 1);
        // SET VALUES FOR THE CARDS IN THE JSON
        if(cardData.cards[0].value != 'ACE'){
            cardData.cards[0].value = (cardData.cards[0].value == "KING" || cardData.cards[0].value == "QUEEN" || cardData.cards[0].value == "JACK") ? 10 : parseInt(cardData.cards[0].value);
        }

        if(id == 'player'){
            let tempPlayerCard = [...this.state.playerCards];
            tempPlayerCard.push(cardData.cards[0])
            this.setState({
                playerCards: tempPlayerCard
            }, function(){
                this.playCardDrawSound();
                // check if someone won/lost the game
                this.checkGameStatus(id);
            })
        } else {
            let tempDealerCard = [...this.state.dealerCards];
            tempDealerCard.push(cardData.cards[0])
            this.setState({
                dealerCards: tempDealerCard
            }, function(){
                this.playCardDrawSound();
                // check if someone won/lost the game
                this.checkGameStatus(id);
                if(this.state.dealerCards.length == 2){
                    // show the next buttons
                    this.setState({
                        displayActions: true
                    })
                }
            })
        }
    }

    getExtraCard(){
        if(this.state.activeUser == 'player'){
            this.drawCards('player');
        } else {
            this.drawCards('dealer');
        }
    }

    // if the sum adds to more than 21 then the person loses
    // Also if the turn is fresh on the dealer if 16 or less then only 
    // dealer can draw a card or else comparision starts and winner is declared
    checkGameStatus(id){
        let totalCount = 0;
        let aceFlag = false;
        let itemIndex = 0;
        if(id == 'player'){
            this.checkPlayerStatus();
        } else {
            this.checkDealerStatus();
        }
    }

    checkPlayerStatus(){
        let totalCount = 0;
        let finalCount = 0;
        let aceFlag = false;
        let itemIndex = 0;
        this.state.playerCards.forEach((item, index) => {
            if(item.value == 'ACE'){
                aceFlag = true;
                itemIndex = index;
            } else {
                totalCount = totalCount + item.value;
            }
        });
        if(!aceFlag && totalCount > 21){
            this.setWinStatus('Player', 'L');
        } else if(!aceFlag && totalCount == 21){
            this.setWinStatus('Player', 'W');
            this.setState({
                
            })
        } else if(aceFlag){
            let cardsList = [...this.state.playerCards];
            if(totalCount+11 == 21){
                cardsList[itemIndex].value = 11;
                this.setState({
                    playerCards: cardsList
                });
                this.setWinStatus('Player', 'W');
            } else if(totalCount+11 < 21){
                cardsList[itemIndex].value = 11;
                this.setState({
                    playerCards: cardsList
                })
            } else if(totalCount+11 > 21){
                cardsList[itemIndex].value = 1;
                this.setState({
                    playerCards: cardsList
                });
            }
        }
        this.state.playerCards.forEach((item, index) => {
            finalCount = finalCount + item.value;
        });
        this.setState({playerTotal: finalCount});
    }

    checkDealerStatus(){
        let totalCount = 0;
        let finalCount = 0;
        let aceFlag = false;
        let itemIndex = 0;
        this.state.dealerCards.forEach((item, index) => {
            if(item.value == 'ACE'){
                aceFlag = true;
                itemIndex = index;
            } else {
                totalCount = totalCount + item.value;
            }
        });
        if(!aceFlag && totalCount > 21){
            this.setWinStatus('Dealer', 'L');
        } else if(!aceFlag && totalCount == 21){
            this.setWinStatus('Dealer', 'W');
        } else if(aceFlag){
            let cardsList = [...this.state.dealerCards];
            if(totalCount+11 == 21){
                cardsList[itemIndex].value = 11;
                this.setState({
                    dealerCards: cardsList
                });
                this.setWinStatus('Dealer', 'W');
            } else if(totalCount+11 < 21){
                cardsList[itemIndex].value = 11;
                this.setState({
                    dealerCards: cardsList
                })
            } else if(totalCount+11 > 21){
                cardsList[itemIndex].value = 1;
                this.setState({
                    dealerCards: cardsList
                });
            }
        }
        this.state.dealerCards.forEach((item, index) => {
            finalCount = finalCount + item.value;
        });
        this.setState({
            dealerTotal: finalCount
        }, function(){
            if((this.state.playerTotal > this.state.dealerTotal) && this.state.activeUser == 'dealer'){
                this.dealerTurn();
            }
        });
    }

    setWinStatus(id, status){
        let msg = '';
        this.setState({ 
            winnerDeclared: true,
            displayActions: false 
        });
        if(id == 'Dealer' && status == 'W'){
            msg = 'Dealer Won!'
        } else if(id == 'Dealer' && status == 'L'){
            msg = 'You Won!'
        } else if(id == 'Player' && status == 'W'){
            msg = 'You Won!'
        } else if(id == 'Player' && status == 'L'){
            msg = 'Dealer Won!'
        }
        this.createNotification((((id == 'Player' && status == 'W') || (id == 'Dealer' && status == 'L')) ? 'success' : 'error'), msg);
        this.setState({
            winnerMsg : msg
        });        
    }

    dealerTurn(){
        this.setState({
            activeUser: 'dealer',
            hidePass: true
        }, function(){
            // check if dealer won based on the total points,
            // or else start the draw process till he win/lose
            this.pickDealerCards();
        });
    }

    pickDealerCards(){
        // if the total of the dealer is less than user, pick
        if(this.state.dealerTotal > this.state.playerTotal){
            this.setWinStatus('Dealer', 'W');
        } else {
            this.createNotification('info', 'Dealer will draw card now!');
            setTimeout(() => {
                this.drawCards('dealer');
            }, 1200);
        }
    }

    playCardDrawSound(){
        this.audio.play();
    }

    reset (){
        this.setState({
            gamestarted: false,
            displayActions: false,
            hidePass: false,
            winnerDeclared: false,
            winnerMsg: '',
            deckId: 0,
            cardData: [],
            cardsRemaining: 0,
            playerCards: [],
            dealerCards: [],
            activeUser: 'player' // player or dealer it switches
        }, function(){
            this.componentDidMount();
        })
    }

    createNotification = (type, message) => {
        switch (type) {
        case 'info':
            NotificationManager.info('', message, 5000);
            break;
        case 'success':
            NotificationManager.success('Oh Yeah!!!', message, 5000);
            break;
        case 'warning':
            NotificationManager.warning('', message, 5000);
            break;
        case 'error':
            NotificationManager.error('', message, 5000);
            break;
        }
      };

    render() {
        return (
            <div id="game-wrapper">
              <Container className="play-wrapper">
                <Row>
                  <Col>
                    <h3 className="title">
                        Black Jack 
                        <img src="/static/img/logo.png" class="logo-image"/>
                    </h3>
                    <div className="game-board" style={{ backgroundImage: `url('${'/static/img/poker-table.jpeg'}')` }}>
                        <div className="dealer-section">
                            <img src="/static/img/dealer.png" class="dealder-hand"/>
                            <img src="/static/img/dealer-profile.png" class="dealer-profile-pic"/>
                        </div>
                        {
                            (this.state.gamestarted && this.state.dealerCards.length > 0) ?
                            <div className="dealer-card-holder">
                                {
                                    this.state.dealerCards.map((item, index) => {
                                        return (
                                            <div className="card-display-wrapper">
                                                <img className="dwarn-card-image" src={(this.state.activeUser == 'player' && index == 1) ? '/static/img/facedown-card.png' : item.image}/>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            : ''
                        }
                        {
                            this.state.gamestarted ?
                            <>
                                {
                                    (this.state.displayActions & !this.state.winnerDeclared) ?
                                    <div id="action-buttons">
                                        <h4>{this.state.activeUser == 'player' ? 'YOUR TURN' : 'DEALERS TURN'}</h4>
                                        {
                                            !this.state.hidePass ?
                                            <>
                                                <Button className="action-btn" variant="danger" onClick={() => this.getExtraCard()}>HIT</Button>
                                                <Button className="action-btn" variant="success" onClick={() => this.dealerTurn()}>STICK</Button>
                                            </>
                                            : ''
                                        }
                                    </div>
                                    : ''
                                }
                                {
                                    this.state.winnerDeclared ?
                                    <div id="winner-wrapper">
                                        <h4>{this.state.winnerMsg}</h4>
                                        <Button className="action-btn" variant="success" onClick={() => this.reset()}>Play Again!</Button>
                                    </div>
                                    : ''
                                }
                            </>
                            :
                            <div className="deal-btn">
                                <Button variant="danger" onClick={() => this.startGame()}>Start + Draw Cards</Button>    
                            </div>
                        }
                        {
                            (this.state.gamestarted && this.state.playerCards.length > 0) ?
                            <div className="player-card-holder">
                                {
                                    this.state.playerCards.map(item => {
                                        return (
                                            <div className="card-display-wrapper">
                                                <img className="dwarn-card-image" src={item.image}/>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            : ''
                        }
                        <div className="player-section">
                            <img src="/static/img/player.png" class="player-hand"/>
                            <img src="/static/img/user-profile.png" class="player-profile-pic"/>
                        </div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
        )
    }
}
