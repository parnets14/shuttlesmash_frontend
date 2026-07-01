import React, { useEffect, useState } from "react";
import "../Admin/Admin.css";
import Card from "react-bootstrap/Card";
import { Button, Form, Modal, Pagination, Table } from "react-bootstrap";
import { AiFillDelete, AiFillEye } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import axios from "axios";
// import moment from "moment";


const Dashboard = () => {


  const [show2, setShow2] = useState();
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const [show4, setShow4] = useState();
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);

    //integrating get  method
    const [Addregister, setAddregister] = useState([]);
    const getAddregister = async () => {
      try {
        let res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/user/getregistration`
        );
        if (res.status === 200) {
          setAddregister(res.data.getregistration);
        }
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      getAddregister();
    }, []);


    
  //integrating get  method
  const [Addgeneral, setAddgeneral] = useState([]);
  const getgeneral = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getgeneral`);
      if (res.status === 200) {
        setAddgeneral(res.data.getgeneral);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getgeneral();
  }, []);

  return (
    <div>
      <h2 className="header-c ">Dashboard</h2>

      <div className="cards-container">
        <Card style={{ width: "15rem", height: "120px", padding: "20px", boxShadow: "1px 0px 10px 1px black", borderRadius: "10px" }}>
          <Card.Body>
            <Card.Title>Total Registered Players</Card.Title>
            {Addregister?.length}
            <Card.Subtitle className="mb-2 text-muted">

            </Card.Subtitle>
          </Card.Body>
        </Card>

        <Card style={{ width: "15rem", height: "120px", padding: "20px", boxShadow: "1px 0px 10px 1px black", borderRadius: "10px" }}>
          <Card.Body>
            <Card.Title>Total Enquiry</Card.Title>
            <Card.Subtitle className="mb-2 text-muted"> {Addgeneral?.length}</Card.Subtitle>
          </Card.Body>
        </Card>
      </div>

      <div>
       
      </div>
    </div>
  );
};

export default Dashboard;
