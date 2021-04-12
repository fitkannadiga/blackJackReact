import React, { Component } from 'react'
import './home.scss';
import { withRouter} from 'react-router-dom'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { GiCard10Hearts, GiCardAceHearts } from "react-icons/gi";


class home extends Component {
    constructor(props) {
      super(props)
      this.state = {
         
      };
    };

    handleClick = () => {
        this.props.history.push('/game');
    }

    render() {
        return (
            <div id="home-wrapper">
              <Container className="play-wrapper">
                <Row>
                  <Col>
                    <h3 className="title">
                      Black Jack 
                      <img src="/static/img/logo.png" class="logo-image"/>
                    </h3>
                    <Button variant="danger" onClick={this.handleClick}>Play</Button>    
                  </Col>
                </Row>
              </Container>
            </div>
        )
    }
}

export default withRouter(home);
