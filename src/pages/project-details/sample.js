// Needed packages import section

import Head from "next/head";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "../../styles/details.module.css";
import { Carousel, Modal, Table } from "react-bootstrap";
import { Image, OverlayTrigger, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { db } from "<cgch-ch>/config/firebaseConfig";
import { Formik } from "formik";
import * as Yup from "yup";
import YouTube from "react-youtube";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import MapMarker from "../../../public/google_maps.svg";
import ElasticCarosuel from "react-elastic-carousel";
import style from "../../styles/Home.module.css";
import { CardContent, CardMedia, Typography } from "@material-ui/core";

//breakpoints for related projects to show similar projects

const relatedbreakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2 },
  { width: 768, itemsToShow: 3 },
  { width: 1200, itemsToShow: 3 },
];

//breakpoints for house floor plans

const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 1 },
  { width: 768, itemsToShow: 1 },
  { width: 1200, itemsToShow: 1 },
];

//break points for amenities

const amenities = [];
const amenitiesBreakPoint = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 3 },
  { width: 768, itemsToShow: 3 },
  { width: 1200, itemsToShow: 4 },
];

//function creation
function Detail() {
  //creating setstate

  const [lastPathSegments, setLastPathSegments] = useState([]);
  const [projectDetails, setProjectDetails] = useState([]);
  const [builderArea, setBuilderArea] = useState([]);
  const onSubmit = (data) => console.log(data);

  //its used to get last path value in router

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const lastPathSegment = pathSegments[pathSegments.length - 1];
    db.collection("Project_Details")
      .where("project_name_keyword", "==", lastPathSegment)
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        console.log(data);
        setProjectDetails(data);

        //get data from firebase to show similiar projects

        db.collection("Project_Details")
          .where("city", "==", "Chennai")
          .where("builder_area", "==", data[0].builder_area)
          .get()
          .then((querySnapshot) => {
            const builderArea = querySnapshot.docs.map((doc) => doc.data());
            console.log(builderArea);
            setBuilderArea(builderArea);
          });
      });
  }, []);

  //creting setstate for form

  const [showModal1, setShowModal1] = useState(false);
  const [unitTypeName, setUnitTypeName] = useState("");
  // const [showModal3, setShowModal3] = useState(false);
  // const [showModal4, setShowModal4] = useState(false);

  const handleClose1 = () => setShowModal1(false);
  const handleShow1 = (unit_type) => {
    setUnitTypeName(unit_type);
    setShowModal1(true);
  };

  // constant data for youtube video

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      // autoplay: 1,
    },
  };

  // constant data for google map

  const containerStyle = {
    height: "450px",
    width: "100%",
  };

  // function for form validation

  function storeData(values) {
    console.log(values);
    let storeDetail = {
      customer_name: values.name,
      customer_email: values.email,
      customer_mobile_number: values.mobile_number,
      customer_message: values.message,
    };
    console.log(storeDetail);

    db.collection("storeData")
      .add(storeDetail)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }

  // project details main function

  return (
    <>
      {/* import header component */}
      <Header />
      {/* container starts */}
      <Container>
        <Row>
          <Col xs={12} md={8}>
            {/* mapping and getting dynamic values for project overview */}
            {projectDetails &&
              projectDetails.map((detail) => (
                <>
                  <div key={detail.id} className="mt-5">
                    <h2 className="proj-details-head">
                      {detail.project_name}{" "}
                      <span style={{ color: "red" }}>Overview</span>
                    </h2>
                    <p className={styles.b}>{detail.project_overview}</p>
                  </div>
                  {/* getting dynamic values for project highlights */}
                  <div key={detail.id} className="mt-5">
                    <Row>
                      <Col md={4}>
                        <h5 className="proj-details-sub-head">Total units</h5>
                        <p>{detail.project_highlights.Number_of_units}</p>
                      </Col>
                      <Col md={4}>
                        <h5 className="proj-details-sub-head">Bedrooms</h5>
                        <p>{detail.project_highlights.Bedrooms}</p>
                      </Col>
                      <Col md={4}>
                        <h5 className="proj-details-sub-head">Possesion Date</h5>
                        <p>{detail.project_highlights.Possesion_date}</p>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col md={4}>
                        <h5 className="proj-details-sub-head">Area</h5>
                        <p>{detail.project_highlights.Development_size}</p>
                      </Col>
                      <Col md={4}>
                        <h5 className="proj-details-sub-head">RERA No</h5>
                        <p>{detail.project_highlights.RERA_No}</p>
                      </Col>
                    </Row>
                  </div>
                </>
              ))}

            {/* img tag using  line break in html */}

            <img className={styles.img} src="/Line 1.svg" />

            {/* img tag using  line break in html */}
            <h2 className={styles.d}>
              Purva Somerset House{" "}
              <span className={styles.demo2}>Unit Type and Size</span>
            </h2>

            {/* table starts */}
            {/* mapping and getting dynamic values for project unit types and size */}
            {projectDetails && projectDetails[0] && (
              <table className={styles.demo}>
                <tr className={styles.demo}>
                  <th className={styles.demo}>Unit Type</th>
                  <th className={styles.demo}>Size</th>
                  <th className={styles.demo}>Price</th>
                </tr>

                {projectDetails &&
                  projectDetails[0] &&
                  projectDetails[0].unit_details &&
                  projectDetails[0].unit_details.map((table) => (
                    <tr>
                      <td className={styles.demo}>{table.unit_type}</td>
                      <td className={styles.demo}>{table.size}</td>
                      <td className={styles.demo}>
                        <button
                          onClick={() => handleShow1(table.unit_type)}
                          className={styles.demo1}
                        >
                          click here
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* table ends */}
              </table>
            )}

            {/* img tag using  line break in html */}
            <img className={styles.img} src="/Line 1.svg" />
            {/* img tag using  line break in html */}

           {/* project floor plans starts */}
            <h2 className={styles.e}>
              Purva Somerset House{" "}
              <span className={styles.demo2}>Floor Plans</span>
            </h2>

            {/*  creating carousel with image using bootstrap */}
            {/* mapping and get dynamic values for floor plans */}

            <Carousel breakPoints={breakPoints} pagination={false}>
              {projectDetails.length > 0 ? (
                <Container>
                  <Row>
                    {projectDetails[0].Project_Images.map((floor) => (
                      <Col>
                        <div>
                          <img
                            src={floor.img}
                            alt={"floor.img"}
                            height={"100px"}
                            className={styles.images}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Container>
              ) : null}
            </Carousel>

            {/* img tag using  line break in html */}

            <img className={styles.img} src="/Line 1.svg" />

            {/* heading tag using html  */}
            
            {/* youtube video */}
            <h2 className={styles.e}>
              Purva Somerset House{" "}
              <span className={styles.demo2}>Location</span>
            </h2>
            <Container>
              <Row>
                <Col>
                  {projectDetails &&
                    projectDetails.map((detail) => (
                      <>
                        <YouTube
                          videoId={detail.walkthrough_video}
                          opts={opts}
                        />
                      </>
                    ))}
                </Col>
              </Row>
            </Container>
            {/* youtube video ends */}

            {/* img tag using  line break in html */}

            <img className={styles.img} src="/Line 1.svg" />

            {/* heading tag using html  */}

            <h2 className={styles.e}>
              Purva Somerset House{" "}
              <span className={styles.demo2}>Location</span>
            </h2>

            {/* image mapping  */}
             {/* use mapping and get dynamic values for location */}
            <div>
              {projectDetails.length > 0 ? (
                <LoadScript googleMapsApiKey="AIzaSyAtoMk_jYkNxaLfmxCCMm3lkmTtCOqGl5M">
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{
                      lat: projectDetails[0].location.latitude,
                      lng: projectDetails[0].location.longitude,
                    }}
                    zoom={17}
                  >
                    <Marker
                      position={{
                        lat: projectDetails[0].location.latitude,
                        lng: projectDetails[0].location.longitude,
                      }}
                      icon={MapMarker}
                      // icon={{
                      //   url:"https://png.pngtree.com/png-clipart/20220521/ourmid/pngtree-red-location-icon-sign-png-image_4644037.png",
                      // }}
                    ></Marker>
                  </GoogleMap>
                </LoadScript>
              ) : null}
            </div>

            {/* img tag using  line break in html */}

            <img className={styles.img} src="/Line 1.svg" />

            {/* heading tag using html  */}
            {/* mapping and get dynamic values for project amenities */}
            {projectDetails.length > 0 && projectDetails.amenities ? (
              <div>
                {projectDetails.amenities.length > 0 ? (
                  <div>
                    <h2 className={styles.e}>
                      Exclusive{" "}
                      <span className={styles.demo2}>
                        {" "}
                        Amenities in Purva Somerest House
                      </span>
                    </h2>

                    {/* creating carousel with image */}
                    <ElasticCarosuel
                      breakPoints={amenitiesBreakPoint}
                      pagination={false}
                      enableMouseSwipe={false}
                    >
                      {projectDetails[0].amenities.map((amenity) => (
                        <React.Fragment>
                          <CardContent>
                            <CardMedia
                              component="img"
                              image={amenity.img}
                              height={"100px"}
                            />
                            <Typography style={{ textAlign: "center" }}>
                              {" "}
                              {amenity.content}
                            </Typography>
                          </CardContent>
                        </React.Fragment>
                      ))}
                    </ElasticCarosuel>
                    {/* amenities ends */}
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* img tag using  line break in html */}
            <img className={styles.img} src="/Line 1.svg" />

            {/* heading tag using html  */}

            {/* paragraph tag */}
            {/* mapping and getting dynamic values for know about projects */}
            <p className={styles.b}>
              {projectDetails &&
                projectDetails.map((p) => (
                  <div key={p.id}>
                    <h2 className={styles.e}>
                      Know About{" "}
                      <span style={{ color: "red" }}>{p.project_name}</span>
                    </h2>
                    {p.about}
                  </div>
                ))}
            </p>

            {/* img tag using  line break in html */}

            <img className={styles.img} src="/Line 1.svg" />

            {/* heading tag using html  */}
             {/* similar projects starts */}
            <h2 className={styles.e}>
              Similar <span className={styles.demo2}>Projects</span>
            </h2>

            {/* carousel create in image */}
            <ElasticCarosuel
              breakPoints={relatedbreakPoints}
              pagination={false}
            >
              {builderArea &&
                builderArea.map((data, Project_Details) => (
                  <Container>
                    <a
                      style={{ textDecoration: "none" }}
                      href={`/project-details/${data.project_name_keyword}`}
                    >
                      <Row>
                        <Col>
                          <div>
                            <img
                              src={data.project_img}
                              alt={data.project_img}
                              className={style.images}
                              width={300}
                              height={300}
                            />
                            <p className={style.price}>
                              {data.project_highlights.Price_range}
                            </p>
                          </div>
                        </Col>
                        <Col>
                          <h3 className={style.title}>{data.project_name}</h3>
                          <p className={style.subtitle}>{data.Address}</p>
                        </Col>
                      </Row>
                    </a>
                  </Container>
                ))}
            </ElasticCarosuel>
            {/* similar project ends */}
          </Col>
          {/* form starts */}

          <Col xs={6} md={4}>
            <Formik
              initialValues={{
                name: "",
                mobile_number: "",
                email: "",
                message: "",
              }}
              validationSchema={Yup.object({
                name: Yup.string().required("Please enter your name"),
                mobile_number: Yup.string().required(
                  "Please enter your mobile number"
                ),
                email: Yup.string()
                  .email("Invalid email address")
                  .required("please enter your email"),
                message: Yup.string().required("Please enter your message"),
              })}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  storeData(values);
                  setSubmitting(false);
                }, 400);
              }}
            >
              {(formik) => (
                <form className={styles.form} onSubmit={formik.handleSubmit}>
                  <h5>
                    Want to know more aboutCode <br></br>
                    Name Million Carrots?
                  </h5>
                  <div className={styles.input_group}>
                    <label htmlFor="name" className={styles.input_group1}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      {...formik.getFieldProps("name")}
                    ></input>
                    {/* {errors.your_name && <span>This field is required</span>} */}
                    {formik.touched.name && formik.errors.name ? (
                      <div className={styles.errorcontent}>
                        {formik.errors.name}
                      </div>
                    ) : null}
                    <label
                      htmlFor="mobile_number"
                      className={styles.input_group1}
                    >
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      id="mobile_number"
                      name="mobile_number"
                      {...formik.getFieldProps("mobile_number")}
                    ></input>
                    {/* {errors.num && <span>This field is required</span>} */}
                    {formik.touched.mobile_number &&
                    formik.errors.mobile_number ? (
                      <div className={styles.errorcontent}>
                        {formik.errors.mobile_number}
                      </div>
                    ) : null}
                    <label htmlFor="email" className={styles.input_group1}>
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      {...formik.getFieldProps("email")}
                    ></input>
                    {/* {errors.mail && <span>This field is required</span>} */}
                    {formik.touched.email && formik.errors.email ? (
                      <div className={styles.errorcontent}>
                        {formik.errors.email}
                      </div>
                    ) : null}
                    <label htmlFor="message" className={styles.input_group1}>
                      Interested
                    </label>
                    <input
                      type="text"
                      id="message"
                      name="message"
                      {...formik.getFieldProps("message")}
                    ></input>
                    {/* {errors.interested && <span>This field is required</span>} */}
                    {formik.touched.message && formik.errors.message ? (
                      <div className={styles.errorcontent}>
                        {formik.errors.message}
                      </div>
                    ) : null}
                    <br></br>
                    <button className={styles.button} type="submit">
                      submit
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </Col>
          {/* form ends */}
        </Row>
        {/*  get details for which size of project customer wants */}
        {/* models pops */}
        <Modal show={showModal1} onHide={handleClose1}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{
                name: "",
                mobile_number: "",
                email: "",
                message: "",
              }}
              validationSchema={Yup.object({
                name: Yup.string().required("Please enter your name"),
                mobile_number: Yup.string().required(
                  "Please enter your mobile number"
                ),
                email: Yup.string()
                  .email("Invalid email address")
                  .required("please enter your email"),
                message: Yup.string().required("Please enter your message"),
              })}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  storeData(values);
                  setSubmitting(false);
                }, 400);
              }}
            >
              {(formik) => (
                <form className={styles.form} onSubmit={formik.handleSubmit}>
                  <h5>
                    If you want this {unitTypeName} project, please enter your
                    details.
                  </h5>
                  <div className={styles.input_group}>
                    <label htmlFor="name" className={styles.input_group1}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      {...formik.getFieldProps("name")}
                    ></input>
                    {/* {errors.your_name && <span>This field is required</span>} */}
                    {formik.touched.name && formik.errors.name ? (
                      <div className={styles.errorcontent}>
                        {formik.errors.name}
                      </div>
                    ) : null}
                    <label
                      htmlFor="mobile_number"
                      className={styles.input_group1}
                    >
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      id="mobile_number"
                      name="mobile_number"
                      {...formik.getFieldProps("mobile_number")}
                    ></input>
                    {/* {errors.num && <span>This field is required</span>} */}
                    {formik.touched.mobile_number &&
                    formik.errors.mobile_number ? (
                      <div className={styles.errorcontent}>
                        {formik.errors.mobile_number}
                      </div>
                    ) : null}
                    <label htmlFor="email" className={styles.input_group1}>
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      {...formik.getFieldProps("email")}
                    ></input>
                    {/* {errors.mail && <span>This field is required</span>} */}
                    {formik.touched.email && formik.errors.email ? (
                      <div className={styles.errorcontent}>
                        {formik.errors.email}
                      </div>
                    ) : null}
                    <label htmlFor="message" className={styles.input_group1}>
                      Interested
                    </label>
                    <input
                      type="text"
                      id="message"
                      name="message"
                      {...formik.getFieldProps("message")}
                    ></input>
                    {/* {errors.interested && <span>This field is required</span>} */}
                    {formik.touched.message && formik.errors.message ? (
                      <div className={styles.errorcontent}>
                        {formik.errors.message}
                      </div>
                    ) : null}
                    <br></br>
                    <button className={styles.button} type="submit">
                      submit
                    </button>
                  </div>
                </form>
              )}
            </Formik>
            {/* forms ends */}
          </Modal.Body>
        </Modal>
      </Container>
      {/* container ends */}
      {/* impoprt footer component */}
      <Footer />
    </>
  );
}

export default Detail;
