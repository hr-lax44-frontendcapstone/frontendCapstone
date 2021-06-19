import React from 'react';
import axios from 'axios';
import Reviews from './RatingsAndReviews/Reviews'
import keys from '../../../server/config/config.js'
import StarRender from './productDetails/StarRender.jsx';
import MainProduct from './productDetails/MainProduct.jsx';
import QAMain from './Q&A/QAMain.jsx';
import AboutUsModal from './productDetails/AboutUsModal.jsx';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import '/client/dist/style.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      products: [],
      selectedProductIndex: 0,
      aboutUsOpen: false
    }
    this.selectProduct = this.selectProduct.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.aboutUsClickHandle = this.aboutUsClickHandle.bind(this);
    this.closeAboutUs = this.closeAboutUs.bind(this);
  }

  componentDidMount() {
    this.getProducts();
  }

  aboutUsClickHandle () {
    this.setState({
      aboutUsOpen: true
    });
  }

  closeAboutUs () {
    this.setState({
      aboutUsOpen: false
    })
  }

  getProducts () {
    axios.get('/api/products')
    .then(response => {
      this.setState({
        products: response.data
      })
    })
    .catch(err => console.log(err))
  }

  selectProduct (e) {
    this.setState({
      selectedProductIndex: e.target.id
    })
  }

  render () {
    if (this.state.products.length === 0) {
      return (
        <div>loading</div>
      )
    }
    return (
      <div>
        <Navbar bg='dark' variant='dark' expand='lg'>
          <Container>
            <Nav>
              <Nav.Link>Home</Nav.Link>
              <Nav.Link onClick={e => this.aboutUsClickHandle(e)}>Our Story</Nav.Link>
              <AboutUsModal show={this.state.AboutUsOpen} handleClose={e => this.closeAboutUs(e)}>
                <h2>Hello!</h2>
              </AboutUsModal>
              <NavDropdown title='Products' >
                {this.state.products.map((item, index) => <NavDropdown.Item onClick={e => this.selectProduct(e)} id={index} key={item.id}>{item.name}</NavDropdown.Item>)}
              </NavDropdown>
            </Nav>
          </Container>
        </Navbar>
        <MainProduct className='product_details' item={this.state.products[this.state.selectedProductIndex]} />
        <StarRender item={this.state.products[this.state.selectedProductIndex]} />
        <QAMain product={this.state.products[this.state.selectedProductIndex]} />
        <Reviews product={this.state.products[this.state.selectedProductIndex]} />
      </div>
    )
  }
}

export default App;