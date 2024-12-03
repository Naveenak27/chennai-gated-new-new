// Needed packages import section
import Head from "next/head";
import { useRouter } from "next/router";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "../../styles/details.module.css";
import { Accordion, Modal, Table } from "react-bootstrap";
import { Image, OverlayTrigger, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Projectheader from "../components/projectheader";
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
import Link from "next/link";
import $, { data, event } from "jquery";
import firebaseApp from "firebase/app";
import { Rating } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Gallery, Item } from "react-photoswipe-gallery";
import axios from "axios";

//breakpoints for related projects to show similar projects

const relatedbreakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2 },
  { width: 768, itemsToShow: 3 },
  { width: 1200, itemsToShow: 3 },
];

//breakpoints for house floor plans

const floorplanbreakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 3 },
  { width: 768, itemsToShow: 3 },
  { width: 1200, itemsToShow: 3 },
];

//break points for amenities

const amenities = [];
const amenitiesBreakPoint = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 3 },
  { width: 768, itemsToShow: 3 },
  { width: 1200, itemsToShow: 4 },
];
const starReview = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 1 },
  { width: 768, itemsToShow: 1 },
  { width: 1200, itemsToShow: 1 },
];
//function creation
function Detail() {
  const router = useRouter();

  //creating setstate
  const [projectDetails, setProjectDetails] = useState([]);
  const [builderArea, setBuilderArea] = useState([]);
  const [builderStarReview, setBuilderStarReview] = useState([]);
  const [similarBuilderArea, setAimilarBuilderArea] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const onSubmit = (data) => console.log(data);

  //its used to get last path value in router

  useEffect(() => {
    firebaseApp
      .auth()
      .signInAnonymously()
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        firebaseApp
          .auth()
          .signInAnonymously()
          .then(() => {
            fetchData();
          })
          .catch((error) => {
            if (error.code === "auth/operation-not-allowed") {
            }
          });
        if (error.code === "auth/operation-not-allowed") {
        }
      });
  }, [router, router.query.paramName]);

  const handleOpenModal = (image) => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // specific one project details fetch based on the selected project
  function fetchData() {
    const pathSegments = window.location.pathname.split("/");
    const lastPathSegment = pathSegments[pathSegments.length - 1];
    console.log(lastPathSegment);
    db.collection("Project_Details")
      .where("project_name_keyword", "==", lastPathSegment)
      // .where("property_category", "==", lastPathSegment)
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        console.log(data);
        setProjectDetails(data);

        //get data from firebase to show similiar projects
        if (data.length > 0) {
          db.collection("Project_Details")
            .where("city", "==", "Chennai")
            .where("builder_area", "==", data[0].builder_area)
            .get()
            .then((querySnapshot) => {
              const builderArea = querySnapshot.docs.map((doc) => doc.data());
              console.log(builderArea);
              setBuilderArea(builderArea);
            });
        }
        if (data.length > 0) {
          console.log(data);
          console.log(data[0].builder_details.builder_name);
          db.collection("Project_Details")
            .where("city", "==", "Chennai")
            .get()
            .then((querySnapshot) => {
              const builderArea = querySnapshot.docs.map((doc) => doc.data());
              let filterbuildername = [];
              builderArea.forEach((obj) => {
                if (
                  obj.builder_details.builder_name ===
                  data[0].builder_details.builder_name &&
                  obj.project_name !== data[0].project_name
                ) {
                  filterbuildername.push(obj);
                }
              });
              setAimilarBuilderArea(filterbuildername);
              console.log(filterbuildername);
            });
        }
      });
    if (lastPathSegment) {
      console.log(lastPathSegment);
      db.collection("review_cgch_chennai")
        .where("keyword", "==", lastPathSegment)
        .where("accept", "==", "true")
        .get()
        .then((querySnapshot) => {
          const builderStarReviews = querySnapshot.docs.map((doc) =>
            doc.data()
          );
          console.log(builderStarReviews);
          setBuilderStarReview(builderStarReviews);
        })
        .catch((error) => {
          // Handle the error appropriately
          console.error("Error fetching data from Firebase:", error);
        });
    } else {
      // Handle the case when lastPathSegment is undefined or empty
      console.error("Invalid lastPathSegment:", lastPathSegment);
    }
  }

  //creting setstate for form

  const [showModal1, setShowModal1] = useState(false);
  const [unitTypeName, setUnitTypeName] = useState("");
  const [value, setValue] = React.useState(0);
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewComments, setReviewComments] = useState("");

  const handleUnitTypeCloseForm = () => setShowModal1(false);
  const handleToShowUnitTypeForm = (unit_type) => {
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

  function storeUsersData(values) {
    console.log(values, projectDetails);
    let storeDetail = {
      builder_details: {
        builder_contact: projectDetails[0].contact_detaills,
        builder_name: projectDetails[0].builder_details.builder_name,
      },
      date: new Date().getDate(),
      email: values.email,
      mobile_number: values.mobile_number,
      month: new Date().getMonth() + 1,
      name: values.name,
      project_name: projectDetails[0].project_name,
      property_address: projectDetails[0].project_location,
      timestamp: projectDetails[0].timestamp,
      type: "project-page",
      year: new Date().getFullYear(),
    };
    console.log(storeDetail);

    db.collection("project-lead-chennai")
      .add(storeDetail)
      .then(async (docRef) => {
        try {
          var settings = {
            async: true,
            crossDomain: true,
            //   // url: `https://www.fast2sms.com/dev/bulkV2?authorization=3BEbN1cOt9RMzkhd0leHCgLnPJ4IqD8YsuAF7fKSywxrm5GWajAMatnTQv6cFmeyZO04I5DBjfXgk3LK&route=dlt&sender_id=TXTIND&message=
            //   // Lead alert cgch.in. Name:${values.name},Number:${values.mobile_number},
            //   // project: ${projectDetails[0].project_name}, ${projectDetails[0].builder_details.builder_name}=&variables_values=&flash=0&numbers=9750593005`,

            url: `https://www.fast2sms.com/dev/bulkV2?authorization=3BEbN1cOt9RMzkhd0leHCgLnPJ4IqD8YsuAF7fKSywxrm5GWajAMatnTQv6cFmeyZO04I5DBjfXgk3LK&sender_id=TXTIND&
            message=Lead alert cgch.in. Name:${values.name},Number:${values.mobile_number},
                project: ${projectDetails[0].project_name}, ${projectDetails[0].builder_details.builder_name},
                  route: "v3"&route=v3&numbers=+919750593005`,
            method: "GET",
          };

          $.ajax(settings).done(function (response) {
            console.log(response);
          });

          // const response = await axios.post(
          //   "https://www.fast2sms.com/dev/bulkV2",
          //   {
          //     route: "q",
          //     message,
          //     language: "english",
          //     flash: 0,
          //     numbers: "9750593005",
          //   },
          //   {
          //     headers: {
          //       authorization:
          //         "3BEbN1cOt9RMzkhd0leHCgLnPJ4IqD8YsuAF7fKSywxrm5GWajAMatnTQv6cFmeyZO04I5DBjfXgk3LK",
          //       "Content-Type": "application/json",
          //     },
          //   }
          // );

          // if (response.data.return == true) {
          //   console.log("Message sent successfully");
          //   // You can set success message or perform any other action
          // } else {
          //   // setError('Failed to send message');
          // }
        } catch (error) {
          let nosmssend = "";
          console.log("message not send");
        }
        try {
          const now = new Date();

          const year = now.getFullYear();
          const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
          const day = now.getDate().toString().padStart(2, '0');

          const hours = now.getHours().toString().padStart(2, '0');
          const minutes = now.getMinutes().toString().padStart(2, '0');
          const seconds = now.getSeconds().toString().padStart(2, '0');

          const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          console.log(values);
          fetch(
            `https://us-central1-chennaigatedcommunity-ed001.cloudfunctions.net/apiSocialShare/mail-send/${projectDetails[0].project_name + " " + timestamp
            }/${values.name}/${values.mobile_number}/${values.email}/${projectDetails[0].builder_details.builder_name
            }/${projectDetails[0].contact_detaills}/${projectDetails[0].city + projectDetails[0].builder_area
            }/${"Feedback"}`
          ).finally(() => { });
        } catch (error) {
          let emailMsgError = "";
        }

        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
    toast.success("Succefully Submited", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  function storeFormData(inputs) {
    console.log(inputs);
    let storeFormDetail = {
      builder_details: {
        builder_contact: projectDetails[0].contact_detaills,
        builder_name: projectDetails[0].builder_details.builder_name,
      },
      date: new Date().getDate(),
      email: inputs.email,
      mobile_number: inputs.mobile_number,
      month: new Date().getMonth() + 1,
      name: inputs.name,
      project_name: projectDetails[0].project_name,
      property_address: projectDetails[0].project_location,
      timestamp: projectDetails[0].timestamp,
      type: "unit-detail",
      year: new Date().getFullYear(),
    };
    console.log(storeFormDetail);

    db.collection("project-lead-chennai")
      .add(storeFormDetail)
      .then((docRef) => {
        try {
          var settings = {
            async: true,
            crossDomain: true,
            url: `https://www.fast2sms.com/dev/bulkV2?authorization=3BEbN1cOt9RMzkhd0leHCgLnPJ4IqD8YsuAF7fKSywxrm5GWajAMatnTQv6cFmeyZO04I5DBjfXgk3LK&sender_id=TXTIND&
          message=Lead alert cgch.in. Name:${values.name},Number:${values.mobile_number},
              project: ${projectDetails[0].project_name}, ${projectDetails[0].builder_details.builder_name},
                route: "v3"&route=v3&numbers=9677051111`,
            method: "GET",
          };

          $.ajax(settings).done(function (response) {
            console.log(response);
          });
        } catch (error) {

        }

        const now = new Date();

        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const day = now.getDate().toString().padStart(2, '0');

        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        console.log(values);

        fetch(
          `https://us-central1-chennaigatedcommunity-ed001.cloudfunctions.net/apiSocialShare/mail-send/${projectDetails[0].project_name + " " + timestamp
          }/${values.name}/${values.mobile_number}/${values.email}/${projectDetails[0].builder_details.builder_name
          }/${projectDetails[0].contact_detaills}/${projectDetails[0].city + projectDetails[0].builder_area
          }/${"Feedback"}`
        ).finally(() => { });
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
    toast.success("Succefully Submited", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  // project details main function

  function storeReviewdata(review) {
    console.log(review);
    let storeReviewData = {
      accept: "false",
      date: new Date().getDate(),
      email: review.email,
      keyword: projectDetails[0].project_name_keyword,
      month: new Date().toLocaleString("en-US", { month: "long" }),
      name: review.name,
      review: review.comments,
      starCount: value,
      starValue: value,
      timestamp: new Date(),
      year: new Date().getFullYear(),
    };
    console.log(storeReviewData);

    db.collection("review_cgch_chennai")
      .add(storeReviewData)
      .then((docRef) => {
        toast.success("Succefully Submited", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }
  const handleViewLargeMap = () => {
    const latitude = projectDetails[0].location.latitude; // Replace with your variable or state holding the latitude value
    const longitude = projectDetails[0].location.longitude; // Replace with your variable or state holding the longitude value

    // Generate the URL based on the latitude and longitude
    const url = `https://www.google.com/maps/place/${latitude},${longitude}`;

    // Open the URL in a new tab
    window.open(url, "_blank");
  };

  const handleDirections = () => {
    // console.log("Direction Click");
    // window.open('https://www.google.com/maps/dir/12.9323017,80.2321167/QVB/@13.0422743,80.1307098,12z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x3a526530c0e6cd99:0xf2b71cb91401b065!2m2!1d80.2046961!2d13.1451368?entry=ttu')
    const latitude = projectDetails[0].location.latitude; // Replace with your variable or state holding the latitude value
    const longitude = projectDetails[0].location.longitude; // Replace with your variable or state holding the longitude value

    // Generate the URL based on the latitude and longitude
    const url = `https://www.google.com/maps/dir/${latitude},${longitude}`;

    // Open the URL in a new tab
    window.open(url, "_blank");
  };
  let projectTitle = "";
  const AddressOverlay = ({ projectName, projectLocation, onViewLargeMap, onDirections }) => (
    <div className="address-overlay">
      <h3>{projectName}</h3>
      <p>{projectLocation}</p>
      <div className="address-overlay-buttons">
        <button className="view-large-map" onClick={handleViewLargeMap}
        >
          View larger map
        </button>
        <button
          className="btn-direction"
          onClick={handleDirections}
          style={{
            padding: '5px 10px',
            backgroundColor: '#033',
            color: 'white',
            border: '1px solid #033',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src="/fork_right.png" alt="Directions" style={{ marginRight: '8px', width: '20px', height: '20px' }} />
          <span>Directions</span>
        </button>
      </div>
    </div>
  ); return (
    <>
      <div class="main-container">
        <Head>
          {projectDetails &&
            projectDetails.map(
              (detail, index) => (projectTitle = detail.project_name)
            )}
          <title>{projectTitle}</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="og:title" content="cgc-og-title" />
          <meta
            name="og:description"
            content="Cgc homes best property portal is the fastest growing real estate portal, you can buy flat, new flats, resale flats and sell residential property for best price"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* /  <link rel="icon" href="/favicon.ico" /> */}
          {/* <link rel="stylesheet" href="/style.css" /> */}
        </Head>

        {/* import header component */}
        {projectDetails && (
          <Projectheader

            title={
              projectDetails.length > 0
                ? projectDetails[0].project_name === undefined
                  ? ""
                  : projectDetails[0].project_name
                : ""
            }
            address={
              projectDetails.length > 0
                ? projectDetails[0].Address === undefined
                  ? ""
                  : projectDetails[0].Address
                : ""
            }
            priceRange={
              projectDetails.length > 0
                ? projectDetails[0].project_highlights.Price_range === undefined
                  ? ""
                  : projectDetails[0].project_highlights.Price_range
                : ""
            }
            bedRooms={
              projectDetails.length > 0
                ? projectDetails[0].project_highlights.Bedrooms === undefined
                  ? ""
                  : projectDetails[0].project_highlights.Bedrooms
                : ""
            }
            developmentSize={
              projectDetails.length > 0
                ? projectDetails[0].project_highlights.Development_size ===
                  undefined
                  ? ""
                  : projectDetails[0].project_highlights.Development_size
                : ""
            }
            possesion={
              projectDetails.length > 0
                ? projectDetails[0].project_highlights.Possesion_date ===
                  undefined
                  ? ""
                  : projectDetails[0].project_highlights.Possesion_date
                : ""
            }
          />
        )}

        <Container>
          <Row>
            <Col md={8} xs={12} className="content">
              <Row>
                {projectDetails &&
                  projectDetails.map((detail) => (
                    <>
                      {detail.project_overview != "" ? (
                        <div key={detail.id} className="mt-5">
                          <h2 className="proj-details-head">
                            {detail.project_name}{" "}
                            <span className={styles.demo2}>Overview</span>
                          </h2>
                          <p className="overview-content">
                            {detail.project_overview}
                          </p>
                        </div>
                      ) : null}
                      {projectDetails &&
                        projectDetails.map((hname) => (
                          <div key={detail.id} className="my-5">
                            <h2 className="proj-details-head mb-3">
                              {hname.project_name}{" "}
                              <span style={{ color: "#033" }}>Configuration</span>
                            </h2>
                            <Row>
                              {detail.project_highlights?.RERA_No && (
                                <Col md={6}>
                                  <h5>RERA No</h5>
                                  <p>{detail.project_highlights.RERA_No}</p>
                                </Col>
                              )}

                              {detail.project_highlights?.Development_size && (
                                <Col md={6}>
                                  <h5>Development Size</h5>
                                  <p>{detail.project_highlights.Development_size}</p>
                                </Col>
                              )}

                              {detail.project_highlights?.Number_of_units && (
                                <Col md={6}>
                                  <h5>Number of Units</h5>
                                  <p>{detail.project_highlights.Number_of_units}</p>
                                </Col>
                              )}

                              {detail.project_highlights?.Bedrooms && (
                                <Col md={6}>
                                  <h5>Bedrooms</h5>
                                  <p>{detail.project_highlights.Bedrooms}</p>
                                </Col>
                              )}

                              {detail.project_highlights?.Possesion_date && (
                                <Col md={6}>
                                  <h5>Possesion Date</h5>
                                  <p>{detail.project_highlights.Possesion_date}</p>
                                </Col>
                              )}

                              {detail.project_highlights?.Price_range && (
                                <Col md={6}>
                                  <h5>Price Range</h5>
                                  <p>{detail.project_highlights.Price_range}</p>
                                </Col>
                              )}
                            </Row>
                          </div>
                        ))}
                    </>
                  ))}

                {/* {projectDetails?.[0]?.unit_details?.some(table => table.unit_type || table.size) && (
                  <>
                    <h2 className="proj-details-head">
                      {projectDetails[0].project_name}{" "}
                      <span className={styles.demo2}>Units Type and Size</span>
                    </h2>
                    <table>
                      <tr>
                        <th className={styles.demo}>Unit Type</th>
                        <th className={styles.demo}>Size</th>
                        <th className={styles.demo}>Price</th>
                      </tr>
                      {projectDetails[0].unit_details.map((table) => (
                        <tr key={table.unit_type}>
                          <td className={styles.unitdetails}>{table.unit_type}</td>
                          <td className={styles.unitdetails}>{table.size}</td>
                          <td className={styles.unitdetails}>
                            <button
                              onClick={() => handleToShowUnitTypeForm(table.unit_type)}
                              className={styles.demo1}
                            >
                              Click here
                            </button>
                          </td>
                        </tr>
                      ))}
                    </table>
                  </>
                )} */}
                {projectDetails?.[0]?.unit_details?.every(table => 
    table.unit_type && 
    table.size && 
    typeof table.unit_type === 'string' && 
    typeof table.size === 'string' && 
    table.unit_type.trim() !== '' && 
    table.size.trim() !== ''
  ) && (
  <>
    <h2 className="proj-details-head">
      {projectDetails[0].project_name}{" "}
      <span className={styles.demo2}>Units Type and Size</span>
    </h2>
    <table>
      <tr>
        <th className={styles.demo}>Unit Type</th>
        <th className={styles.demo}>Size</th>
        <th className={styles.demo}>Price</th>
      </tr>
      {projectDetails[0].unit_details.map((table) => (
        <tr key={table.unit_type}>
          <td className={styles.unitdetails}>{table.unit_type}</td>
          <td className={styles.unitdetails}>{table.size}</td>
          <td className={styles.unitdetails}>
            <button
              onClick={() => handleToShowUnitTypeForm(table.unit_type)}
              className={styles.demo1}
            >
              Click here
            </button>
          </td>
        </tr>
      ))}
    </table>
  </>
)}
                <Row>
                  {projectDetails.length &&
                    projectDetails[0].Project_Images.length > 0 ? (
                    <>
                      <Col>
                        <h2 className="proj-details-head mt-5">
                          {projectDetails[0].project_name}{" "}
                          <span className={styles.demo2}>Floor Plans</span>
                        </h2>
                        {/* <ElasticCarosuel
                        breakPoints={floorplanbreakPoints}
                        pagination={false}
                      >
                        {projectDetails[0].Project_Images.map((floor) => (
                          <React.Fragment key={floor.id}>
                            <CardContent>
                              <CardMedia
                                component="img"
                                image={floor.img}
                                
                              />
                            </CardContent>
                          </React.Fragment>
                        ))}
                      </ElasticCarosuel> */}
                        <div>
                          <Gallery>
                            <ElasticCarosuel
                              breakPoints={floorplanbreakPoints}
                              pagination={false}
                              enableMouseSwipe={false}
                            >
                              {projectDetails[0].Project_Images.map((floor) => (
                                <React.Fragment key={floor.id}>
                                  <CardContent
                                    style={{ width: "100%" }}
                                    className="Pointer"
                                  >
                                    <div className="relative">
                                      <Item
                                        original={floor.img}
                                        thumbnail={floor.img}
                                        width="500"
                                        height="360"
                                      >
                                        {({ ref, open }) => (
                                          <div className="image-hover">
                                            <CardMedia
                                              component="img"
                                              className="cardListImg"
                                              image={floor.img}
                                              ref={ref}
                                              onClick={handleOpenModal}
                                            />
                                          </div>
                                        )}
                                      </Item>
                                    </div>
                                  </CardContent>
                                </React.Fragment>
                              ))}
                            </ElasticCarosuel>
                          </Gallery>
                        </div>
                      </Col>
                    </>
                  ) : null}
                </Row>
                {projectDetails &&
                  projectDetails.map((detail) => (
                    <Col>
                      {detail.walkthrough_video !== "" ? (
                        <>
                          <h2 className="proj-details-head mt-5">
                            {detail.project_name}{" "}
                            <span className={styles.demo2}>
                              Walkthrough Video
                            </span>
                          </h2>
                          <YouTube
                            videoId={detail.walkthrough_video}
                            opts={opts}
                            className={styles.youtubeVideo}
                          />
                        </>
                      ) : null}
                    </Col>
                  ))}
                <Row>
                  {projectDetails.length > 0 ? (
                    <>
                      <h2 className="proj-details-head mt-5">
                        {projectDetails[0].project_name}{" "}
                        <span className={styles.demo2}>Location</span>
                      </h2>
                      <div className="map-relative">
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
                            />
                            <AddressOverlay
                              projectName={projectDetails[0].project_name}
                              projectLocation={projectDetails[0].project_location}
                            />
                          </GoogleMap>
                        </LoadScript>
                        {/* <div className="map-absolute">
          <div className="d-flex">
            <div>
              <p className="map-title-text">
                {projectDetails[0].project_name}
              </p>
              <p className="map-text">
                {projectDetails[0].project_location}
              </p>
              <button
                className="view-large-map"
                onClick={handleViewLargeMap}
              >
                View larger map
              </button>
            </div>
            <div className="pl-10">
              <button
                className="btn-direction"
                onClick={handleDirections}
              >
                <img src="/fork_right.png" alt="Directions" />
                <p className="directions-text m-0">Directions</p>
              </button>
            </div>
          </div>
        </div> */}
                      </div>
                    </>
                  ) : null}
                </Row>              <Row>
                  {projectDetails.length > 0 && projectDetails[0].amenities ? (
                    <Col>
                      {projectDetails[0].amenities.length > 0 ? (
                        <>
                          <h2 className="proj-details-head mt-5">
                            Exclusive Amenities in{" "}
                            <span className={styles.demo2}>
                              {projectDetails[0].project_name}
                            </span>
                          </h2>
                          <ElasticCarosuel
                            breakPoints={amenitiesBreakPoint}
                            pagination={false}
                            enableMouseSwipe={false}
                          >
                            {projectDetails[0].amenities.map((amenity) => (
                              <React.Fragment key={amenity.id}>
                                <CardContent>
                                  <CardMedia
                                    component="img"
                                    image={amenity.img}
                                    height={"100px"}
                                  />
                                  <Typography style={{ textAlign: "center" }}>
                                    {amenity.content}
                                  </Typography>
                                </CardContent>
                              </React.Fragment>
                            ))}
                          </ElasticCarosuel>
                        </>
                      ) : null}
                    </Col>
                  ) : null}
                </Row>
                {projectDetails.length !== 0 &&
                  projectDetails[0].Specifications.length > 0 &&
                  projectDetails[0].Specifications[0].title !== "" ? (
                  <Row>
                    {projectDetails[0] &&
                      projectDetails.map((pname) => (
                        <>
                          <Col>
                            <h2 className="proj-details-head mt-5">
                              {pname.project_name}{" "}
                              <span className={styles.demo2}>Specification</span>
                            </h2>
                            {pname.Specifications &&
                              pname.Specifications.map((item) => (
                                <Accordion>
                                  <Accordion.Header>
                                    {" "}
                                    {item.title}
                                  </Accordion.Header>
                                  <Accordion.Body>{item.value}</Accordion.Body>
                                </Accordion>
                              ))}
                          </Col>
                        </>
                      ))}
                  </Row>
                ) : null}
                <Row>
                  {projectDetails &&
                    projectDetails.map((contents) => (
                      <Col>
                        {contents.knowabout != "" ? (
                          <div key={contents.id}>
                            <h2 className="proj-details-head mt-5">
                              Know About{" "}
                              <span
                                className="text-capitalize"
                                style={{ color: "#033" }}
                              >
                                {contents.builder_details.builder_name}
                              </span>
                            </h2>
                            <p className="overview-content">{contents.about}</p>
                          </div>
                        ) : null}
                      </Col>
                    ))}
                </Row>
                {similarBuilderArea.length !== 0 ? (
                  <Row>
                    {projectDetails &&
                      projectDetails.map((input) => (
                        <Col>
                          <h2 className="proj-details-head mt-5">
                            Other Project form{" "}
                            <span className={styles.demo2}>
                              {input.builder_details.builder_name} Developers
                            </span>
                          </h2>
                          {similarBuilderArea.length > 0 && (
                            <ElasticCarosuel
                              breakPoints={relatedbreakPoints}
                              pagination={false}
                            >
                              {similarBuilderArea.map((similarData) => (
                                <Link
                                  style={{ textDecoration: "none" }}
                                  href={"/project-details/[project]"}
                                  as={`/project-details/${similarData.project_name_keyword}`}
                                >
                                  <div className="hoverbox">
                                    <div className="position-relative">
                                      <img
                                        src={similarData.project_img}
                                        alt={similarData.project_img}
                                        style={{
                                          width: "250px",
                                          height: "200px",
                                          borderRadius: "10px",
                                        }}
                                      />
                                      <p className={style.price}>
                                        {
                                          similarData.project_highlights
                                            .Price_range
                                        }
                                      </p>
                                    </div>
                                    <h3 className={style.title}>
                                      {similarData.project_name}
                                    </h3>
                                    <p className={style.subtitle}>
                                      {similarData.Address}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </ElasticCarosuel>
                          )}
                        </Col>
                      ))}
                  </Row>
                ) : null}

                <Row>
                  <Col>
                    <h2 className="proj-details-head mt-5">
                      Similar <span className={styles.demo2}>Projects</span>
                    </h2>
                    <ElasticCarosuel
                      breakPoints={relatedbreakPoints}
                      pagination={false}
                    >
                      {builderArea.map((data) => (
                        <Link
                          style={{ textDecoration: "none" }}
                          href={"/project-details/[project]"}
                          as={`/project-details/${data.project_name_keyword}`}
                        >
                          <div className="hoverbox">
                            <div className="position-relative">
                              <img
                                src={data.project_img}
                                alt={data.project_img}
                                style={{
                                  width: "250px",
                                  height: "200px",
                                  borderRadius: "10px",
                                }}
                              />
                              <p className={style.price}>
                                {data.project_highlights.Price_range}
                              </p>
                            </div>
                            <h3 className={style.title}>{data.project_name}</h3>
                            <p className={style.subtitle}>{data.Address}</p>
                          </div>
                        </Link>
                      ))}
                    </ElasticCarosuel>
                  </Col>
                </Row>
                <Row>
                  <Modal show={showModal1} onHide={handleUnitTypeCloseForm}>
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body>
                      <Formik
                        initialValues={{
                          name: "",
                          mobile_number: "",
                          email: "",
                          message: `Hello , I am Interested in ${unitTypeName} Project on ${showModal1 && projectDetails[0].project_name
                            }`,
                        }}
                        validationSchema={Yup.object({
                          name: Yup.string().required("Please enter your name"),
                          mobile_number: Yup.string().required(
                            "Please enter your mobile number"
                          ),
                          email: Yup.string()
                            .email("Invalid email address")
                            .required("please enter your email"),
                          message: Yup.string().required(
                            "Please enter your message"
                          ),
                        })}
                        onSubmit={async (inputs, { resetForm }) => {
                          await storeFormData(inputs);
                          resetForm({ inputs: "" });
                        }}
                      >
                        {(formik) => (
                          <form
                            className={styles.form}
                            onSubmit={formik.handleSubmit}
                          >
                            <h5 className="proj-details-head">
                              you want
                              <span className={styles.demo2}>                        {projectDetails[0].project_name}{" "}
                              </span>{" "}
                            </h5>
                            <div className={styles.input_group}>
                              <label
                                htmlFor="name"
                                className={styles.input_group1}
                              >
                                Your Name
                              </label>
                              <input
                                className={styles.formfill}
                                type="text"
                                id="name"
                                name="name"
                                {...formik.getFieldProps("name")}
                              ></input>
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
                                className={styles.formfill}
                                type="text"
                                id="mobile_number"
                                name="mobile_number"
                                {...formik.getFieldProps("mobile_number")}
                              ></input>
                              {formik.touched.mobile_number &&
                                formik.errors.mobile_number ? (
                                <div className={styles.errorcontent}>
                                  {formik.errors.mobile_number}
                                </div>
                              ) : null}
                              <label
                                htmlFor="email"
                                className={styles.input_group1}
                              >
                                Your Email
                              </label>
                              <input
                                className={styles.formfill}
                                type="email"
                                id="email"
                                name="email"
                                {...formik.getFieldProps("email")}
                              ></input>
                              {formik.touched.email && formik.errors.email ? (
                                <div className={styles.errorcontent}>
                                  {formik.errors.email}
                                </div>
                              ) : null}
                              <label
                                htmlFor="message"
                                className={styles.input_group1}
                              >
                                Interested
                              </label>
                              <input
                                className={styles.formfill}
                                type="text"
                                id="message"
                                name="message"
                                {...formik.getFieldProps("message")}
                              ></input>
                              {formik.touched.message && formik.errors.message ? (
                                <div className={styles.errorcontent}>
                                  {formik.errors.message}
                                </div>
                              ) : null}
                              <br></br>
                              <button className={styles.button} type="submit">
                                Submit
                              </button>
                            </div>
                          </form>
                        )}
                      </Formik>
                      {/* forms ends */}
                    </Modal.Body>
                  </Modal>
                </Row>
                <Row>
                  <Col md={12}>
                    <h2 className="proj-details-head mt-5">
                      Ratings <span style={{ color: "#033" }}>and Reviews</span>
                    </h2>
                    <h6 className="mt-4">Ratings</h6>
                    <div className="mt-3">
                      <Row>
                        <Col md={4} xs={4}>
                          <Rating
                            name="simple-controlled"
                            value={value}
                            onChange={(event, newValue) => {
                              setValue(newValue);
                            }}
                          />
                        </Col>
                        <Col md={4} xs={4}>
                          <h6>(0 Reviews)</h6>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={8}>
                    <Formik
                      initialValues={{ comments: "", name: "", email: "" }}
                      validationSchema={Yup.object({
                        comments: Yup.string().required("Please fill this field"),
                        name: Yup.string().required("Please fill this field"),
                        email: Yup.string()
                          .email("Invalid email")
                          .required("Required"),
                      })}
                      onSubmit={async (review, { resetForm }) => {
                        await storeReviewdata(review);
                        resetForm({ review: "" });
                        setValue({ value: 0 });
                      }}
                    >
                      {(formik) => (
                        <form onSubmit={formik.handleSubmit}>
                          <label htmlFor="comments">Comments</label>
                          <br></br>
                          <textarea
                            id="comments"
                            name="comments"
                            type="text"
                            style={{
                              width: "100%",
                              borderRadius: "10px",
                              height: "150px",
                            }}
                            {...formik.getFieldProps("comments")}
                          ></textarea>
                          {formik.touched.comments && formik.errors.comments ? (
                            <div className={styles.errorcontent}>
                              {formik.errors.comments}
                            </div>
                          ) : null}
                          <Row>
                            <Col md={6}>
                              <label htmlFor="name">Name</label>
                              <br></br>
                              <input
                                id="name"
                                name="name"
                                type="text"
                                style={{ width: "100%", borderRadius: "10px" }}
                                {...formik.getFieldProps("name")}
                              />
                              {formik.touched.name && formik.errors.name ? (
                                <div className={styles.errorcontent}>
                                  {formik.errors.name}
                                </div>
                              ) : null}
                            </Col>
                            <Col md={6}>
                              <label htmlFor="email">Email</label>
                              <br></br>
                              <input
                                id="email"
                                name="email"
                                type="email"
                                style={{ width: "100%", borderRadius: "10px" }}
                                {...formik.getFieldProps("email")}
                              />
                              {formik.touched.email && formik.errors.email ? (
                                <div className={styles.errorcontent}>
                                  {formik.errors.email}
                                </div>
                              ) : null}
                            </Col>
                          </Row>
                          <Row>
                            <Col md={8} className="mt-3 mb-5 ">
                              <button type="submit" className={styles.button}>
                                Submit
                              </button>
                            </Col>
                          </Row>
                        </form>
                      )}
                    </Formik>
                  </Col>
                </Row>
                {builderStarReview.length !== 0 ? (
                  <Row>
                    {projectDetails &&
                      projectDetails.map((bname) => (
                        <Col>
                          <h2 className="proj-details-head mt-5">
                            Reviews on{" "}
                            <span
                              className="text-capitalize"
                              style={{ color: "#033" }}
                            >
                              {bname.builder_details.builder_name}
                            </span>
                          </h2>
                          <ElasticCarosuel
                            pagination={false}
                            enableAutoPlay={true}
                          >
                            {builderStarReview.map((starreview) => (
                              <>
                                <div>
                                  <div className="review-content">
                                    <div className="review-block">
                                      <div className="row">
                                        <div className="col-md-12">
                                          <div className="d-flex">
                                            <div className="rating-box">
                                              <span
                                                style={{
                                                  color: "white",
                                                  fontSize: "13px",
                                                }}
                                              >
                                                {starreview.starCount}
                                              </span>
                                              <span
                                                id="st1"
                                                className="fa fa-star checked"
                                                style={{
                                                  padding: "7px",
                                                  fontSize: "12px",
                                                }}
                                              >
                                                <FontAwesomeIcon icon={faStar} />
                                              </span>
                                            </div>
                                            <div className="form-check form-check-inline">
                                              <span
                                                className="form-check-label"
                                                for="inlineCheckbox1"
                                                style={{
                                                  padding: "0px",
                                                  fontSize: "18px",
                                                }}
                                              >
                                                {starreview.name}
                                              </span>
                                            </div>
                                            <div className="form-check form-check-inline p-0">
                                              <span
                                                className="form-check-label"
                                                for="inlineCjheckbox2"
                                                style={{
                                                  color: "rgb(161, 161, 161",
                                                  fontSize: "18px",
                                                }}
                                              >{`<${starreview.email}>`}</span>
                                            </div>
                                          </div>
                                          <div className="review-block-description mt-3">
                                            {starreview.review}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ))}
                          </ElasticCarosuel>
                        </Col>
                      ))}
                  </Row>
                ) : null}
              </Row>
            </Col>
            <Col md={4} xs={12} className="form-container">
              <Row className="form-style">
                {projectDetails &&
                  projectDetails.map((value) => (
                    <Formik
                      initialValues={{
                        name: "",
                        mobile_number: "",
                        email: "",
                        message: `Hello, I am Interested in ${value.project_name}`,
                      }}
                      validationSchema={Yup.object({
                        name: Yup.string().required("Please enter your name"),
                        mobile_number: Yup.string().required(
                          "Please enter your mobile number"
                        ),
                        email: Yup.string()
                          .email("Invalid email address")
                          .required("please enter your email"),
                        message: Yup.string().required(
                          "Please enter your message"
                        ),
                      })}
                      onSubmit={async (values, { resetForm }) => {
                        await storeUsersData(values);
                        resetForm({ values: "" });
                      }}
                    >
                      {(formik) => (
                        <form onSubmit={formik.handleSubmit}>
                          <h5 className="proj-details-head">
                            Interested in{" "}
                            <span className={styles.demo2}>
                              {value.project_name}
                            </span>
                          </h5>
                          <div className={styles.input_group}>
                            <label htmlFor="name" className={styles.input_group}>
                              Your Name
                            </label>
                            <input
                              className={styles.formfill}
                              type="text"
                              id="name"
                              name="name"
                              {...formik.getFieldProps("name")}
                            ></input>
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
                              className={styles.formfill}
                              type="text"
                              id="mobile_number"
                              name="mobile_number"
                              {...formik.getFieldProps("mobile_number")}
                            ></input>
                            {formik.touched.mobile_number &&
                              formik.errors.mobile_number ? (
                              <div className={styles.errorcontent}>
                                {formik.errors.mobile_number}
                              </div>
                            ) : null}
                            <label
                              htmlFor="email"
                              className={styles.input_group1}
                            >
                              Your Email
                            </label>
                            <input
                              className={styles.formfill}
                              type="email"
                              id="email"
                              name="email"
                              {...formik.getFieldProps("email")}
                            ></input>
                            {formik.touched.email && formik.errors.email ? (
                              <div className={styles.errorcontent}>
                                {formik.errors.email}
                              </div>
                            ) : null}
                            <label
                              htmlFor="message"
                              className={styles.input_group1}
                            >
                              Interested
                            </label>
                            <input
                              className={styles.formfill}
                              type="text"
                              id="message"
                              name="message"
                              {...formik.getFieldProps("message")}
                            ></input>
                            {formik.touched.message && formik.errors.message ? (
                              <div className={styles.errorcontent}>
                                {formik.errors.message}
                              </div>
                            ) : null}
                            <br></br>
                            <button className={styles.button} type="submit">
                              Submit
                            </button>
                          </div>
                        </form>
                      )}
                    </Formik>
                  ))}
              </Row>
            </Col>
          </Row>
          <Modal show={showModal} onHide={handleCloseModal} size="md">
            <Modal.Header closeButton>
              <Modal.Title>
                <h2 className="proj-details-head">
                  {projectDetails[0] && projectDetails[0].project_name}{" "}
                  <span className={styles.demo2}>Floor Plans</span>
                </h2>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Gallery>
                <ElasticCarosuel
                  breakPoints={floorplanbreakPoints}
                  pagination={false}
                  enableMouseSwipe={false}
                >
                  {projectDetails[0] &&
                    projectDetails[0].Project_Images.map((floor) => (
                      <React.Fragment key={floor.id}>
                        <CardContent
                          style={{ width: "100%" }}
                          className="Pointer"
                        >
                          <div className="relative">
                            <Item
                              original={floor.img}
                              thumbnail={floor.img}
                              width="500"
                              height="500"
                            >
                              {({ ref, open }) => (
                                <div className="image-hover">
                                  <CardMedia
                                    component="img"
                                    className="cardListImg"
                                    image={floor.img}
                                    ref={ref}
                                  />
                                </div>
                              )}
                            </Item>
                          </div>
                        </CardContent>
                      </React.Fragment>
                    ))}
                </ElasticCarosuel>
              </Gallery>
            </Modal.Body>
          </Modal>
        </Container>
        <Container fluid>
          {projectDetails &&
            projectDetails[0] &&
            projectDetails[0].Faq &&
            projectDetails[0].Faq.length !== "" ? (
            <Container>
              <h1 className="text-center mt-5 mb-5" style={{ fontSize: "23px" }}>
                Frequently Asked Questions
              </h1>
              {projectDetails &&
                projectDetails.map(
                  (array) =>
                    array &&
                    array.Faq &&
                    Array.isArray(array.Faq) &&
                    array.Faq.map((question, index) => (
                      <div key={index}>
                        <Accordion>
                          <Accordion.Header>
                            {" "}
                            {question.questions}
                          </Accordion.Header>
                          <Accordion.Body>{question.answers}</Accordion.Body>
                        </Accordion>
                      </div>
                    ))
                )}
            </Container>
          ) : null}
        </Container>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Footer
          titlewhatsapp={
            projectDetails.length !== 0 && projectDetails[0].project_name
          }
        />
      </div>
    </>
  );
}
export default Detail;
