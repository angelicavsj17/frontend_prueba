import React, { useState, useEffect } from "react";
import "../home/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { endOfTheDay, startOfTheDay } from "../../../utils/dateUtils";

let workingHours = {
  0: 0,
  1: 16,
  2: 16,
  3: 16,
  4: 16,
  5: 16,
  6: 4
}

const Home = () => {
  const baseUrl = "http://localhost:8080/api/cars";
  const [data, setData] = useState([]);
  const [carSelec, setCarSelec] = useState({
    carsId: '',
    mark: '',
    hours_manufacturing: '',
    quantity: 0,
    date_creation: new Date()
  });

  const [modalInsert, setModalInsert] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarSelec({
      ...carSelec,
      [name]: value,
    });
  };

  const abrirCerrarModal = () => {
    setModalInsert(!modalInsert);
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalDelete = () => {
    setModalDelete(!modalDelete);
  };


  const getCars = async () => {
    await axios
      .get(baseUrl)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const postCars = async () => {
    delete carSelec.id;
    let date = new Date(carSelec.date_creation);
    let hours = 0;
    data.map((car) => {
      let start = new Date(startOfTheDay(date));
      let end = new Date(endOfTheDay(date));
      if (new Date(car.date_creation) > start && new Date(car.date_creation) < end) {
        hours += (car.hours_manufacturing * car.quantity)
      }
    })
    let maxHours = workingHours[date.getDay()];
    if (hours + (carSelec.hours_manufacturing * carSelec.quantity) > maxHours) {
      setError('Este dia ya esta lleno');
    }
    else {
      await axios.post('http://localhost:8080/api/car', carSelec)
        .then((response) => {
          // setData(data.concat, response.data);
          window.location.reload();
          abrirCerrarModal();
        }).catch((error) => {
          console.log(error);
        });
    }
  };

  const putcars = async () => {
    carSelec.hours_manufacturing = parseInt(carSelec.hours_manufacturing)
    await axios.put('http://localhost:8080/api/car/' + carSelec.carsId, carSelec)
      .then((response) => {
        var respuesta = response.data
        var dataAuxiliar = data
        dataAuxiliar = data.map(cars => {
          cars = Object(cars)
          if (cars.carsId === carSelec.carsId) {
            cars = respuesta[0];
          }
          return cars;
        })
        setData(dataAuxiliar);
        abrirCerrarModalEditar();
      }).catch((error) => {
        console.log(error);
      });
  };

  const deleteCars = async () => {
    await axios.delete('http://localhost:8080/api/car/' + carSelec.carsId)
      .then(response => {
        setData(data.filter(cars => cars.carsId !== carSelec.carsId))
        abrirCerrarModalDelete()
      }).catch((error) => {
        console.log(error);
      });
  };

  const seleccionarCar = (cars, caso) => {
    setCarSelec(cars, "editar");
    (caso === "editar") ?
      abrirCerrarModalEditar() : abrirCerrarModalDelete()
  }

  useEffect(() => {
    getCars();
  }, []);

  return (
    <div>
      <br />
      <div className="container--header">
        <h1>sistema de gestion</h1>
      </div>
      <button className="btn btn-primary" onClick={() => abrirCerrarModal()}>
        crear nueva orden
      </button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>id vehiculo</th>
            <th>vehiculo</th>
            <th>tiempo de fabricacion</th>
            <th>unidades</th>
            <th>total horas acumuladas</th>
            <th>Fecha</th>
            <th>acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((cars) => {
              return (
                <tr>
                  <td>{cars.carsId}</td>
                  <td>{cars.mark}</td>
                  <td>{cars.hours_manufacturing}</td>
                  <td>{cars.quantity}</td>
                  <td>{cars.quantity * cars.hours_manufacturing}</td>
                  <td>{new Date(cars.date_creation).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => seleccionarCar(cars, "editar")}>editar</button>{" "}
                    <button className="btn btn-primary" onClick={() => seleccionarCar(cars, "eliminar")}>  eliminar</button>{" "}
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>

      <Modal isOpen={modalInsert}>
        <ModalHeader>CREAR NUEVA ORDEN</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <form onSubmit={(e) => { e.preventDefault() }}>
              <label>Marca</label>
              <br />
              <input
                type="text"
                className="form-control"
                name="mark"
                onChange={handleChange}
              />
              <br />
              <label>tiempo de fabricacion</label>
              <br />
              <input
                type="number"
                className="form-control"
                name="hours_manufacturing"
                onChange={handleChange}
                value={carSelec.hours_manufacturing}
              />
              <br />
              <label>Unidades</label>
              <br />
              <input
                type="number"
                className="form-control"
                name="quantity"
                onChange={handleChange}
                value={carSelec.quantity}
              />
              <br />

              <label>Fecha</label>
              <br />
              <div className='date-picker-container'>
                <DatePicker
                  className='date-picker'
                  selected={new Date(carSelec.date_creation)}
                  onChange={(value) => setCarSelec({ ...carSelec, date_creation: value })}
                />
              </div>
              <br />
              <span className='error'>{error}</span>
              <br />
              <br />
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => postCars()}
              >
                crear
              </button>
            </form>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-primary"
            onClick={() => abrirCerrarModal()}
          >
            cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>EDITAR ORDEN</ModalHeader>
        <ModalBody>
          <label>ID</label>
          <br />
          <input
            type="number"
            className="form-control"
            value={carSelec && carSelec.carsId}
            readOnly
          /><br />

          <label>marca</label>
          <br />
          <input
            type="text"
            className="form-control"
            onChange={handleChange}
            name="mark"
            value={carSelec && carSelec.mark}
          />
          <br />

          <label>tiempo de fabricacion</label>
          <br />
          <input
            type="number"
            className="form-control"
            onChange={handleChange}
            name="hours_manufacturing"
            value={carSelec && carSelec.hours_manufacturing}
          />
          <br />
          <br />
          <label>Unidades</label>
          <br />
          <input
            type="number"
            className="form-control"
            name="quantity"
            onChange={handleChange}
            value={carSelec.quantity}
          />
          <br />

          <label>Fecha</label>
          <br />
          <div className='date-picker-container'>
            <DatePicker
              className='date-picker'
              selected={new Date(carSelec.date_creation)}
              onChange={(value) => setCarSelec({ ...carSelec, date_creation: value })}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => putcars()}>editar</button>{" "}
          <button className="btn btn-primary" onClick={() => abrirCerrarModalEditar()}>cancelar</button>{" "}
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalDelete}>
        <ModalHeader></ModalHeader>
        <ModalBody>
          ¿estas seguro que deseas eliminar esta orden de vehiculos? {carSelec && carSelec.carsId}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => deleteCars()}>Si</button>
          <button className="btn btn-secundary" onClick={() => abrirCerrarModalDelete()}>No</button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Home;