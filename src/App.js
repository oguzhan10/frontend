import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form,Card,Toast} from 'react-bootstrap';
import React,{useState,useEffect} from 'react';
import axios from 'axios';
import Recommodation from './Recommodation';

function App() {

  const [userId,setUserId] = useState('');
  const [productId,setProductId] = useState('');

  const [id,setId] = useState('');
  const [products,setProducts] = useState([]);
  const [type,setType] = useState('');
  const [recommodation,setRecommodation] = useState([]);

  const [sentToKafkaResult, setSendToKafkaResult] = useState('');
  const [show, setShow] = useState(false);
  
  function handleChange(event) {
    setUserId(event.target.value);

  }

  function handleChangeForProductId(event) {
    setProductId(event.target.value);
  }

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/recommendation_by_user_id/'+userId)
      .then(function (response) {
        let result = response.data?.products;
        console.log("recommodation",result)
        setRecommodation(result)
      })
      .catch(function (error) {
        console.log(error);
      })
  },[userId])


  function handleSubmit(e) {
    e.preventDefault();
    axios.get('http://127.0.0.1:8000/user_history/'+ userId)
      .then(function (response) {
        let result = response.data;
        setId(result['user-id'])
        let product = result['products']
        setProducts(product)
        setType(result['type'])
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  function handleSubmitForDelete(e) {
    e.preventDefault();
    axios.delete('http://127.0.0.1:8000/delete_user_history_by_product_id/'+ userId + '/' + productId)
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  function sendToKafka(e){
    e.preventDefault();
    axios.get('http://127.0.0.1:8000/send_to_kafka')
      .then(function (response) {
        console.log(response)
        let sendToKafka = response.status
        if(sendToKafka === 200){
          setSendToKafkaResult(sendToKafka);
          setShow(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  function consumeFromKafka(e){
    e.preventDefault();
    axios.get('http://127.0.0.1:8000/run_kafka_consumer')
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  return (
    <div className="App">
      <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Kafka</strong>
        </Toast.Header>
        <Toast.Body>History sended to Kafka Topic Succesfully</Toast.Body>
      </Toast>
      <Form>
        <div style={{display:'flex',justifyContent:'space-evenly',marginTop:'20px',marginBottom:'20px'}}>
          <Button variant="primary" onClick={sendToKafka} type="submit">
            Send to Kafka
          </Button>
          <Button variant="primary" onClick={consumeFromKafka} type="submit">
            Consume From Kafka
          </Button>
        </div>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control type="text" onChange={handleChange} placeholder="UserId" />
          <Form.Text className="text-muted">
            Get User history by User Id.
          </Form.Text>
        </Form.Group>
        <Button variant="primary" onClick={handleSubmit} type="submit">
          Send
        </Button>
      </Form>
        <label>Kullanıcı Id</label>
        <div>{id}</div>
        <label>Ürün Idleri</label>
        <div>{products}</div>
        <label>Türü</label>
        <div>{type}</div>
        <hr style={{margin:'4%'}}/>
        <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>User Id</Form.Label>
          <Form.Control type="text" onChange={handleChange} placeholder="UserId" />
          <Form.Label>Product Id</Form.Label>
          <Form.Control type="text" onChange={handleChangeForProductId} placeholder="ProductId" />
          <Form.Text className="text-muted">
            Delete a product from history with userid and productid
          </Form.Text>
        </Form.Group>
        <Button variant="primary" onClick={handleSubmitForDelete} type="submit" style={{marginBottom:'10px'}}>
          Delete
        </Button>
      </Form>
      {userId &&<label>Recommodation for {userId}</label>}

      <div className='cardView'>
      {userId &&  <Recommodation recommodation={recommodation} userId={userId} /> } 
      </div>


    </div>
  );
}

export default App;
