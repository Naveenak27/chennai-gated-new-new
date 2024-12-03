// Import packages
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import React from "react";
import { db } from "../config/firebaseConfig";
import Carousel from "react-elastic-carousel";
import { useEffect, useState } from "react";
import Footer from "./components/footer";
import Header from "./components/header";
import { Oval } from "react-loader-spinner";
import Link from "next/link";
import firebaseApp from "firebase/app";

// const inter = Inter({ subsets: ["latin"] });

// Array Values for Carousel Breakpoint
const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2 },
  { width: 768, itemsToShow: 3 },
  { width: 1200, itemsToShow: 3 },
];
// Connect fireStore data in Main file
let grooupedValue = ""; //groupping firebase data in this array
export default function Home() {
  const [data, setData] = useState([]);
  const [apartmentProjImage, setApartmentProjImage] = useState([]);
  const [randomApartmentImage, setRandomApartmentImage] = useState("");
  const [plotProjImage, setPlotProjImage] = useState([]);
  const [randomPlotImage, setRandomPlotImage] = useState("");
  const [villaProjImage, setVillaProjImage] = useState([]);
  const [randomVillaImage, setRandomVillaImage] = useState("");
  const [luxuryProjImage, setLuxuryProjImage] = useState([]);
  const [randomLuxuryImage, setRandomLuxuryImage] = useState("");
  const [premiumProjImage, setPremiumProjImage] = useState([]);
  const [randomPremiumImage, setRandomPremiumImage] = useState("");
  const [moveProjImage, setMoveProjImage] = useState([]);
  const [randomMoveImage, setRandomMoveImage] = useState("");
  const [newProjImage, setNewProjImage] = useState([]);
  const [randomNewImage, setRandomNewImage] = useState("");
  const [ongoingProjImage, setOngoingProjImage] = useState([]);
  const [randomOngoingImage, setRandomOngoingImage] = useState("");
  const [buildProjImage, setBuildProjImage] = useState([]);
  const [randomBuildImage, setRandomBuildImage] = useState("");
  const [completedProjImage, setCompletedProjImage] = useState([]);
  const [randomCompletedImage, setRandomCompletedImage] = useState("");
  const [builderDetailsList, setBuilderDetailsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setshow] = useState(false);

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
  }, []);

  function removeDuplicateNames(objects) {
    const uniqueNames = {};
    const uniqueObjects = [];

    objects.forEach((obj) => {
      if (!uniqueNames[obj.builder_name]) {
        uniqueNames[obj.builder_name] = true;
        uniqueObjects.push(obj);
      }
    });

    return uniqueObjects;
  }

  // FetchData function used to get specific value in Project_Details

  const fetchData = async () => {
    const collectionRef = db.collection("Project_Details");
    const querySnapshot = await collectionRef
      .where("city", "==", "Chennai")
      .get();
    const apartmentFile = [];
    const plotFile = [];
    const villaFile = [];
    const luxuryFile = [];
    const premiumFile = [];
    const moveFile = [];
    const newFile = [];
    const ongoingFile = [];
    const buildFile = [];
    const completedFile = [];
    const builderDetailList = [];

    querySnapshot.forEach((doc) => {
      const builderDetails = doc.data().builder_details;
      console.log(builderDetails);
      builderDetailList.push(builderDetails);

      // console.log(doc.data().builder_details.builder_name);
      if (doc.data().house_type === "Apartment") {
        const apartmentData = doc.data();
        console.log(apartmentData,"builder_details")
        apartmentFile.push(apartmentData);
      }
      setIsLoading(false);

      if (doc.data().house_type === "Plot") {
        const plotData = doc.data();
        plotFile.push(plotData);
      }
      setIsLoading(false);

      if (doc.data().house_type === "Villa") {
        const villaData = doc.data();
        villaFile.push(villaData);
      }
      setIsLoading(false);

      if (doc.data().property_category === "Luxury") {
        const luxuryData = doc.data();
        luxuryFile.push(luxuryData);
      }
      setIsLoading(false);

      if (doc.data().property_category === "Premium") {
        const premiumData = doc.data();
        premiumFile.push(premiumData);
      }
      setIsLoading(false);

      if (doc.data().project_status === "Ready to move") {
        const moveData = doc.data();
        moveFile.push(moveData);
      }
      setIsLoading(false);

      if (doc.data().project_status === "New Launch") {
        const newData = doc.data();
        newFile.push(newData);
      }
      setIsLoading(false);

      if (doc.data().project_status === "Ongoing") {
        const ongoingData = doc.data();
        ongoingFile.push(ongoingData);
      }
      setIsLoading(false);

      if (doc.data().project_status === "Ready to Built") {
        const buildData = doc.data();
        buildFile.push(buildData);
      }
      setIsLoading(false);

      if (doc.data().project_status === "Completed") {
        const completedData = doc.data();
        completedFile.push(completedData);
      }
      setIsLoading(false);
    });

    const uniqueObjects = removeDuplicateNames(builderDetailList);
    console.log(uniqueObjects);
    setBuilderDetailsList(uniqueObjects);

    await setData(apartmentFile);
    // grooupedValue = groupByKey(apartmentFile, "project_img");
    console.log(apartmentFile);

    const apartmentProjectImage = apartmentFile.map(
      (apartment) => apartment.project_img
    );
    console.log(apartmentProjectImage);
    setApartmentProjImage(apartmentProjectImage);

    const randomApartmentIndex = Math.floor(
      Math.random() * apartmentProjectImage.length
    );
    const selectedApartmentImage = apartmentProjectImage[randomApartmentIndex];
    console.log(selectedApartmentImage);
    setRandomApartmentImage(selectedApartmentImage);

    const plotProjectImage = plotFile.map((plot) => plot.project_img);
    console.log(plotProjectImage);
    setPlotProjImage(plotProjectImage);

    const randomPlotIndex = Math.floor(Math.random() * plotProjectImage.length);
    const selectedPlotImage = plotProjectImage[randomPlotIndex];
    console.log(selectedPlotImage);
    setRandomPlotImage(selectedPlotImage);

    const villaProjectImage = villaFile.map((villa) => villa.project_img);
    console.log(villaProjectImage);
    setVillaProjImage(villaProjectImage);

    const randomVillaIndex = Math.floor(
      Math.random() * villaProjectImage.length
    );
    const selectedVillaImage = villaProjectImage[randomVillaIndex];
    console.log(selectedVillaImage);
    setRandomVillaImage(selectedVillaImage);

    const luxuryProjectImage = luxuryFile.map((luxury) => luxury.project_img);
    console.log(luxuryProjectImage);
    setLuxuryProjImage(luxuryProjectImage);

    const randomLuxuryIndex = Math.floor(
      Math.random() * luxuryProjectImage.length
    );
    const selectedLuxuryImage = luxuryProjectImage[randomLuxuryIndex];
    console.log(selectedLuxuryImage);
    setRandomLuxuryImage(selectedLuxuryImage);

    const premiumProjectImage = premiumFile.map(
      (premium) => premium.project_img
    );
    console.log(premiumProjectImage);
    setPremiumProjImage(premiumProjectImage);

    const randomPremiumIndex = Math.floor(
      Math.random() * premiumProjectImage.length
    );
    const selectedPremiumImage = premiumProjectImage[randomPremiumIndex];
    console.log(selectedPremiumImage);
    setRandomPremiumImage(selectedPremiumImage);

    const moveProjectImage = moveFile.map((move) => move.project_img);
    console.log(moveProjectImage);
    setMoveProjImage(moveProjectImage);

    const randomMoveIndex = Math.floor(Math.random() * moveProjectImage.length);
    const selectedMoveImage = moveProjectImage[randomMoveIndex];
    console.log(selectedMoveImage);
    setRandomMoveImage(selectedMoveImage);

    const newProjectImage = newFile.map((newValue) => newValue.project_img);
    console.log(newProjectImage);
    setNewProjImage(newProjectImage);

    const randomNewIndex = Math.floor(Math.random() * newProjectImage.length);
    const selectedNewImage = newProjectImage[randomNewIndex];
    console.log(selectedNewImage);
    setRandomNewImage(selectedNewImage);

    const ongoingProjectImage = ongoingFile.map(
      (ongoing) => ongoing.project_img
    );
    console.log(ongoingProjectImage);
    setOngoingProjImage(ongoingProjectImage);

    const randomOngoingIndex = Math.floor(
      Math.random() * ongoingProjectImage.length
    );
    const selectedOngoingImage = ongoingProjectImage[randomOngoingIndex];
    console.log(selectedOngoingImage);
    setRandomOngoingImage(selectedOngoingImage);

    const buildProjectImage = buildFile.map((build) => build.project_img);
    console.log(buildProjectImage);
    setBuildProjImage(buildProjectImage);

    const randomBuildIndex = Math.floor(
      Math.random() * buildProjectImage.length
    );
    const selectedBuildImage = buildProjectImage[randomBuildIndex];
    console.log(selectedBuildImage);
    setRandomBuildImage(selectedBuildImage);

    const completedProjectImage = completedFile.map(
      (completed) => completed.project_img
    );
    console.log(completedProjectImage);
    setCompletedProjImage(completedProjectImage);

    const randomCompletedIndex = Math.floor(
      Math.random() * completedProjectImage.length
    );
    const selectedCompletedImage = completedProjectImage[randomCompletedIndex];
    console.log(selectedCompletedImage);
    setRandomCompletedImage(selectedCompletedImage);
  };

  // Gropping all Carousel Array values

  function groupByKey(array, key) {
    return array.reduce((hash, obj) => {
      if (obj[key] === undefined) return hash;
      return Object.assign(hash, {
        [obj[key]]: (hash[obj[key]] || []).concat(obj),
      });
    }, {});
  }
  return (
    <>
      {/* Banner Container fluid Start */}
      <Header />
      {/* Banner Container fluid Close */}
      {/* Container icon Start */}
      <Container className="mt-2 ">
        <Row>
          <h1 className="mt-2  text-center" style={{ color: "#f47e21" }}>
            Explore Projects <span style={{ color: '#033' }}> by Project Types</span>
          </h1>
          <p className="mt-2  text-center">
            Explore the Different project types in the real estate industry
            offer various housing options to cater to the diverse needs and
            preferences of buyers.
          </p>
          <Carousel
            breakPoints={breakPoints}
            pagination={false}
            enableMouseSwipe={false}
          >
            <Col style={{ padding: '20px' }}>
              <Card
                style={{
                  textAlign: 'center',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Link
                  href="/projects/[projectCategory]"
                  as="/projects/apartment"
                  style={{ textDecoration: 'none' }}
                >
                  <Image
                    src={randomApartmentImage}
                    width={317}
                    height={199}
                    style={{ borderRadius: '8px' }}
                  />
                  <h5 style={{ color: '#033', fontSize: '1.25rem', marginTop: '1rem' }}>
                    Apartments
                  </h5>
                  <p style={{ color: 'black', fontSize: '1rem' }}>
                    Apartments, also known as flats or condominiums, are
                    multi-unit...
                  </p>
                  <p
                    style={{
                      color: '#f47c21',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textAlign: 'center',
                      marginTop: '1rem',
                      transition: 'color 0.3s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#d36d1c'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#f47c21'}
                  >
                    Read More
                  </p>
                </Link>
              </Card>
            </Col>
            <Col style={{ padding: '20px' }}>
              <Card
                style={{
                  textAlign: 'center',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Link
                  href="/projects/[projectCategory]"
                  as="/projects/plot"
                  style={{ textDecoration: 'none' }}
                >
                  <Image
                    src={randomPlotImage}
                    width={317}
                    height={199}
                    style={{ borderRadius: '8px' }}
                  />
                  <h5 style={{ color: '#033', fontSize: '1.25rem', marginTop: '1rem' }}>
                    Plots
                  </h5>
                  <p style={{ color: 'black', fontSize: '1rem' }}>
                    Plots refer to undeveloped land parcels that are available
                    for...
                  </p>
                  <p
                    style={{
                      color: '#f47c21',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textAlign: 'center',
                      marginTop: '1rem',
                      transition: 'color 0.3s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#d36d1c'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#f47c21'}
                  >
                    Read More
                  </p>
                </Link>
              </Card>
            </Col>
            <Col style={{ padding: '20px' }}>
              <Card
                style={{
                  textAlign: 'center',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Link
                  href="/projects/[projectCategory]"
                  as="/projects/villa"
                  style={{ textDecoration: 'none' }}
                >
                  <Image
                    src={randomVillaImage}
                    width={317}
                    height={199}
                    style={{ borderRadius: '8px' }}
                  />
                  <h5 style={{ color: '#033', fontSize: '1.25rem', marginTop: '1rem' }}>
                    Villas
                  </h5>
                  <p style={{ color: 'black', fontSize: '1rem' }}>
                    Villas are standalone residential units, typically larger in
                    size...
                  </p>
                  <p
                    style={{
                      color: '#f47c21',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textAlign: 'center',
                      marginTop: '1rem',
                      transition: 'color 0.3s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#d36d1c'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#f47c21'}
                  >
                    Read More
                  </p>
                </Link>
              </Card>
            </Col>
          </Carousel>
        </Row>
      </Container>
      <div className={styles.line}></div>
      {/* icon Container Close */}
      <Container className="mt-2 ">
        <Row>
          <h1 className="mt-2  text-center" style={{ color: "#f47e21" }}>

            Search by Category <span style={{ color: '#033' }}>of the Projects</span>
          </h1>
          <p className="mt-2  text-center">
            Project categories in the real estate industry are often used to define different levels of quality, amenities, and pricing for residential properties. Here's a brief overview of some common project categories
          </p>
          <Carousel breakPoints={breakPoints} pagination={false} enableMouseSwipe={false}>
            {/* Luxury Card */}
            <Col style={{ padding: '20px' }}>
              <Card style={{
                textAlign: 'center',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease-in-out',
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <Link href="/project-type/[type]" as="/project-type/luxury" style={{ textDecoration: 'none' }}>
                  <Image
                    src={randomLuxuryImage}
                    width={317}
                    height={199}
                    style={{ borderRadius: '8px' }}
                  />
                  <h5 style={{ color: '#033', fontSize: '1.25rem', marginTop: '1rem' }}>
                    Luxury
                  </h5>
                  <p style={{ color: 'black', fontSize: '1rem' }}>
                    Luxury projects are characterized by their high-end features...
                  </p>
                  <p style={{
                    color: '#f47c21',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textAlign: 'center',
                    marginTop: '1rem',
                    transition: 'color 0.3s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#d36d1c'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#f47c21'}>
                    Read More
                  </p>
                </Link>
              </Card>
            </Col>

            {/* Ultra Luxury Card */}
            <Col style={{ padding: '20px' }}>
              <Card style={{
                textAlign: 'center',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease-in-out',
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <Link href="/project-type/[type]" as="/project-type/ultra-luxury" style={{ textDecoration: 'none' }}>
                  <Image
                    src={randomPlotImage}
                    width={317}
                    height={199}
                    style={{ borderRadius: '8px' }}
                  />
                  <h5 style={{ color: '#033', fontSize: '1.25rem', marginTop: '1rem' }}>
                    Ultra Luxury
                  </h5>
                  <p style={{ color: 'black', fontSize: '1rem' }}>
                    Ultra luxury projects represent the epitome of luxury living...
                  </p>
                  <p style={{
                    color: '#f47c21',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textAlign: 'center',
                    marginTop: '1rem',
                    transition: 'color 0.3s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#d36d1c'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#f47c21'}>
                    Read More
                  </p>
                </Link>
              </Card>
            </Col>

            {/* Premium Card */}
            <Col style={{ padding: '20px' }}>
              <Card style={{
                textAlign: 'center',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease-in-out',
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <Link href="/project-type/[type]" as="/project-type/premium" style={{ textDecoration: 'none' }}>
                  <Image
                    src={randomPremiumImage}
                    width={317}
                    height={199}
                    style={{ borderRadius: '8px' }}
                  />
                  <h5 style={{ color: '#033', fontSize: '1.25rem', marginTop: '1rem' }}>
                    Premium
                  </h5>
                  <p style={{ color: 'black', fontSize: '1rem' }}>
                    Premium projects target a higher-income bracket and offer a...
                  </p>
                  <p style={{
                    color: '#f47c21',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textAlign: 'center',
                    marginTop: '1rem',
                    transition: 'color 0.3s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#d36d1c'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#f47c21'}>
                    Read More
                  </p>
                </Link>
              </Card>
            </Col>

            {/* Ultra Premium Card */}
            <Col style={{ padding: '20px' }}>
              <Card style={{
                textAlign: 'center',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease-in-out',
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <Link href="/project-type/[type]" as="/project-type/ultra-premium" style={{ textDecoration: 'none' }}>
                  <Image
                    src={randomVillaImage}
                    width={317}
                    height={199}
                    style={{ borderRadius: '8px' }}
                  />
                  <h5 style={{ color: '#033', fontSize: '1.25rem', marginTop: '1rem' }}>
                    Ultra Premium
                  </h5>
                  <p style={{ color: 'black', fontSize: '1rem' }}>
                    Ultra-premium projects take luxury to the next level. They offer...
                  </p>
                  <p style={{
                    color: '#f47c21',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textAlign: 'center',
                    marginTop: '1rem',
                    transition: 'color 0.3s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#d36d1c'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#f47c21'}>
                    Read More
                  </p>
                </Link>
              </Card>
            </Col>

            {/* Affordable Card */}
            <Col style={{ padding: '20px' }}>
              <Card style={{
                textAlign: 'center',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease-in-out',
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <Link href="/project-type/[type]" as="/project-type/affordable" style={{ textDecoration: 'none' }}>
                  <Image
                    src={randomApartmentImage}
                    width={317}
                    height={199}
                    style={{ borderRadius: '8px' }}
                  />
                  <h5 style={{ color: '#033', fontSize: '1.25rem', marginTop: '1rem' }}>
                    Affordable
                  </h5>
                  <p style={{ color: 'black', fontSize: '1rem' }}>
                    These projects are focused on providing housing solutions...
                  </p>
                  <p style={{
                    color: '#f47c21',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textAlign: 'center',
                    marginTop: '1rem',
                    transition: 'color 0.3s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#d36d1c'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#f47c21'}>
                    Read More
                  </p>
                </Link>
              </Card>
            </Col>
          </Carousel>
        </Row>
      </Container>
      <div className={styles.line}></div>
      <Container className="mt-2 ">
        <Row>
          <h1 className="mt-2  text-center" style={{ color: "#f47e21" }}>

            Search by the Status<span style={{ color: '#033' }}> of the Projects</span>
          </h1>
          <p className="mt-2  text-center">
            Project status indicates the stage of development and readiness of a real estate project. Here's a brief explanation of common project statuses
          </p>
          <Carousel breakPoints={breakPoints} pagination={false} enableMouseSwipe={false}>
            {/* Ready to Move Card */}
            <Col style={{ padding: '20px' }}>
              <Card style={{
                textAlign: 'center',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease-in-out',
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <Link href="/project-status/[status]" as="/project-status/ready-to-move" style={{ textDecoration: 'none' }}>
                  <Image
                    src={randomMoveImage}
                    width={317}
                    height={199}
                    style={{ borderRadius: '8px' }}
                  />
                  <h5 style={{ color: '#033', fontSize: '1.25rem', marginTop: '1rem' }}>
                    Ready to Move
                  </h5>
                  <p style={{ color: 'black', fontSize: '1rem' }}>
                    Ready to move in projects, as the name suggests, are...
                  </p>
                  <p style={{
                    color: '#f47c21',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textAlign: 'center',
                    marginTop: '1rem',
                    transition: 'color 0.3s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#d36d1c'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#f47c21'}>
                    Read More
                  </p>
                </Link>
              </Card>
            </Col>

            {/* New Launch Card */}
            <Col style={{ padding: '20px' }}>
              <Card style={{
                textAlign: 'center',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease-in-out',
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <Link href="/project-status/[status]" as="/project-status/new-launch" style={{ textDecoration: 'none' }}>
                  <Image
                    src={randomNewImage}
                    width={317}
                    height={199}
                    style={{ borderRadius: '8px' }}
                  />
                  <h5 style={{ color: '#033', fontSize: '1.25rem', marginTop: '1rem' }}>
                    New Launch
                  </h5>
                  <p style={{ color: 'black', fontSize: '1rem' }}>
                    New launch refers to a project that has recently been...
                  </p>
                  <p style={{
                    color: '#f47c21',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textAlign: 'center',
                    marginTop: '1rem',
                    transition: 'color 0.3s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#d36d1c'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#f47c21'}>
                    Read More
                  </p>
                </Link>
              </Card>
            </Col>

            {/* Ongoing Card */}
            <Col style={{ padding: '20px' }}>
              <Card style={{
                textAlign: 'center',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease-in-out',
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <Link href="/project-status/[status]" as="/project-status/ongoing" style={{ textDecoration: 'none' }}>
                  <Image
                    src={randomOngoingImage}
                    width={317}
                    height={199}
                    style={{ borderRadius: '8px' }}
                  />
                  <h5 style={{ color: '#033', fontSize: '1.25rem', marginTop: '1rem' }}>
                    Ongoing
                  </h5>
                  <p style={{ color: 'black', fontSize: '1rem' }}>
                    Ongoing projects are those that are currently under...
                  </p>
                  <p style={{
                    color: '#f47c21',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textAlign: 'center',
                    marginTop: '1rem',
                    transition: 'color 0.3s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#d36d1c'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#f47c21'}>
                    Read More
                  </p>
                </Link>
              </Card>
            </Col>

            {/* Ready to Built Card */}
            <Col style={{ padding: '20px' }}>
              <Card style={{
                textAlign: 'center',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease-in-out',
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <Link href="/project-status/[status]" as="/project-status/ready-to-built" style={{ textDecoration: 'none' }}>
                  <Image
                    src={randomBuildImage}
                    width={317}
                    height={199}
                    style={{ borderRadius: '8px' }}
                  />
                  <h5 style={{ color: '#033', fontSize: '1.25rem', marginTop: '1rem' }}>
                    Ready to Built
                  </h5>
                  <p style={{ color: 'black', fontSize: '1rem' }}>
                    Ready-to-construct projects typically refer to plots or...
                  </p>
                  <p style={{
                    color: '#f47c21',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textAlign: 'center',
                    marginTop: '1rem',
                    transition: 'color 0.3s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#d36d1c'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#f47c21'}>
                    Read More
                  </p>
                </Link>
              </Card>
            </Col>

            {/* Completed Card */}
            <Col style={{ padding: '20px' }}>
              <Card style={{
                textAlign: 'center',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease-in-out',
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <Link href="/project-status/[status]" as="/project-status/completed" style={{ textDecoration: 'none' }}>
                  <Image
                    src={randomCompletedImage}
                    width={317}
                    height={199}
                    style={{ borderRadius: '8px' }}
                  />
                  <h5 style={{ color: '#033', fontSize: '1.25rem', marginTop: '1rem' }}>
                    Completed
                  </h5>
                  <p style={{ color: 'black', fontSize: '1rem' }}>
                    These projects are focused on
                  </p>
                  <p style={{
                    color: '#f47c21',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textAlign: 'center',
                    marginTop: '1rem',
                    transition: 'color 0.3s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#d36d1c'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#f47c21'}>
                    Read More
                  </p>
                </Link>
              </Card>
            </Col>
          </Carousel>
        </Row>
      </Container>
      <div className={styles.line}></div>
      {/* <Container className="mt-2 ">
       
      {/* Image tag for line */}
      {/* Container Fluid Close */}
      {/* Container fluid for carousel Start */}
      <Container className="mt-2 ">
        <Row>
          <h1 className="mt-2  text-center" style={{ color: "#f47e21" }}>
            Browse Projects <span style={{ color: '#033' }}>  by Builders</span></h1>
          <Carousel breakPoints={breakPoints} pagination={false} enableMouseSwipe={false}>
            {builderDetailsList.map((builder, index) =>
              builder.builder_logo === "" ? null : (
                <Col key={index} style={{ padding: '20px' }}>
                  <Card style={{
                    textAlign: 'center',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease-in-out',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <Link
                      href={`/builder-project/${builder.builder_name.replace(" ", "-")}`}
                      as={`/builder-project/${builder.builder_name.replace(" ", "-")}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Image
                        src={builder.builder_logo}
                        alt={builder.builder_logo}
                        width={200}
                        height={200}
                        style={{ borderRadius: '8px', objectFit: 'contain',height: '100px' }}
                      />                <h5 style={{
                        color: '#033',
                        fontSize: '1.25rem',
                        marginTop: '1rem',
                        textTransform: 'capitalize'
                      }}>
                        {builder.builder_name}
                      </h5>
                    </Link>
                  </Card>
                </Col>
              )
            )}
          </Carousel>
        </Row>
      </Container>
      {show && (
        <>
          <Container fluid className="p-0" style={{ display: "none" }}>
            {Object.keys(grooupedValue).map((keys) => (
              <>
                <hr className={styles.cusHr}></hr>
                <Container className="mt-2">
                  <p className={styles.para1}>{keys} Projects </p>
                </Container>
                <Container className="mt-4 ">
                  <Carousel breakPoints={breakPoints} pagination={false}>
                    {grooupedValue[keys].map((data, Project_Details) => (
                      <Container>
                        <Link
                          style={{ textDecoration: "none" }}
                          href="/project-details/[project]"
                          as={`/project-details/${data.project_name_keyword}`}
                        >
                          <Row>
                            <Col className={styles.hoverpic}>
                              <div className="hoverbox">
                                <div className="position-relative">
                                  <img
                                    src={data.project_img}
                                    alt={data.project_img}
                                    className={styles.carouselImages}
                                  />
                                  <p className={styles.price}>
                                    {data.project_highlights.Price_range}
                                  </p>
                                </div>

                                <h3 className={styles.title}>
                                  {data.project_name}
                                </h3>
                                <p className={styles.subtitle}>
                                  {data.Address}
                                </p>
                              </div>
                            </Col>
                          </Row>
                        </Link>
                      </Container>
                    ))}
                  </Carousel>
                </Container>
              </>
            ))}
            {/* Same as */}
          </Container>
        </>
      )}
      <Container>
        {isLoading === true ? (
          <Row>
            <div className="centered-loader-container">
              <Oval
                height={80}
                width={80}
                color="gray"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="white"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </div>
          </Row>
        ) : null}
      </Container>
      <Footer />
      {/* Carousel Container fluid Close */}
    </>
  );
}
