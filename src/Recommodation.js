import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form,Card,Container,Row,Col} from 'react-bootstrap';
import React,{useState,useEffect} from 'react';
import axios from 'axios';

function Recommodation({recommodation,userId}) {


   useEffect(() => {
       console.log("rec",recommodation)
   }) 

  return (
    <div  className='cardView' style={{flexWrap:'wrap'}}>
        
        {recommodation.map((item) => (
        <Container style={{width:'10%'}}>
            <Row>
                <Col xs>
                    <Card>
                        <Card.Body>
                            <Card.Title>{item[1]}</Card.Title>
                            <Card.Text>
                            {item[0]}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>        
        ))}
      </div>
  );
}

export default Recommodation;
