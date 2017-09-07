const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

const Food = require('./food');
const server = require('./server');

const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');

chai.use(chaiHTTP);

describe('/food', () => {
  let foodId;

  beforeEach((done) => {
    new Food({
      name: 'Rib Steak'
    }).save((err, savedFood) => {
      if (err) {
        console.log(err);
        return done();
      }
      foodId = savedFood.id;
      done();
    });
  });

  afterEach((done) => {
    Food.remove({}, (err) => {
      if (err) console.log(err);
      done();
    });
  });

  describe('[GET] /food', () => {
    it('should get all of the food', (done) => {
      chai.request(server)
        .get('/food')
        .end((err, res) => {
          if (err) return console.log(err);
          expect(res.status).to.equal(200);
          expect(Array.isArray(res.body)).to.equal(true);
          expect(res.body.length).to.equal(1);
          done();
        });
    });
  });

  describe('[PUT] /food', () => {
    it('should update the food document', (done) => {
      const update = {
        id: foodId,
        name: 'Tomahawk Steak'
      };
      chai.request(server)
        .put('/food')
        .send(update)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.name).to.equal('Tomahawk Steak');
          done();
        });
    });
  });

  describe('[DELETE] /food/:id', () => {
    it('should remove the specified document', (done) => {
      chai.request(server)
        .delete(`/food/${foodId}`)
        .end((err, res) => {
          if (err) {
            console.log(err);
            return done();
          }
          expect(res.text).to.equal('success');
          Food.findById(foodId, (err, deletedFood) => {
            if (err) {
              console.log(err);
              return done();
            }
            expect(deletedFood).to.equal(null);
            done();
          });
        });
    });
  });

  describe('[POST] /food', () => {
    it('should add a new food', (done) => {
      const food = {
        name: 'Hot Dog'
      };

      chai.request(server)
        .post('/food')
        .send(food)
        .end((err, res) => {
          if (err) return console.log(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('Hot Dog');
          done();
        });
    });
  });
});
