//Import Packages
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "../../styles/projects.module.css";
import Footer from "../components/footer";
import Header from "../components/header";
import { db } from "<cgch-ch>/config/firebaseConfig";
import Card from "react-bootstrap/Card";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../../pagination/Pagination";
import { useMemo } from "react";
import Link from "next/link";
import { Oval } from "react-loader-spinner";
import Image from "next/image";

// SetState Function
const Projects = () => {
  const [projectList, setProjectList] = useState([]);
  const [projectDetailsArray, setProjectDetailsArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sliceProjectListArray, setSliceProjectListArray] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const PageSize = 12;
  useEffect(() => {
    const fetchData = async () => {
      try {
          // First attempt with ordering
          try {
              const fireBase = await db
                  .collection("Project_Details")
                  .where("city", "==", "Chennai")
                  .orderBy("timestamp", "desc")
                  .get();
  
              const projectDetailsArray = fireBase.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
              }));
  
              setProjectList(projectDetailsArray);
              splitDataForPagination();
              setPageLoading(false);
          } catch (error) {
              // Handle missing index error
              if (error.code === 'failed-precondition' || error.message.includes('requires an index')) {
                  console.warn('Index not found, falling back to unordered query');
                  
                  // Fallback query without ordering
                  const fireBase = await db
                      .collection("Project_Details")
                      .where("city", "==", "Chennai")
                      .get();
  
                  // Sort the results in memory
                  const projectDetailsArray = fireBase.docs
                      .map((doc) => ({
                          id: doc.id,
                          ...doc.data(),
                          timestamp: doc.data().timestamp?.toDate() || new Date(0)
                      }))
                      .sort((a, b) => b.timestamp - a.timestamp);
  
                  setProjectList(projectDetailsArray);
                  splitDataForPagination();
                  setPageLoading(false);
              } else {
                  // If it's not an index error, rethrow
                  throw error;
              }
          }
      } catch (error) {
          console.error("Error fetching data:", error);
          setProjectList([]);
          setPageLoading(false);
          
          // Show user-friendly error message
          if (error.code === 'failed-precondition' || error.message.includes('requires an index')) {
              alert('Database configuration needed. Please contact the administrator.');
          } else {
              alert('An error occurred while fetching the data. Please try again later.');
          }
      }
  };    fetchData();
  }, []);
  const splitDataForPagination = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    setSliceProjectListArray(projectList.slice(firstPageIndex, lastPageIndex));
  };
  useMemo(() => {
    splitDataForPagination();
  }, [currentPage, projectList]);

  const handleSearchFunction = (selectSearchOption) => {
    console.log("SearchButtonFunction", selectSearchOption);
    if (selectSearchOption === ""){
      toast.warn("Please Select any Option!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }else{
    
        let searchInput = "";
        const projectcategoryPathseg = window.location.pathname.split("/");
        const projectcategoryLastpath = projectcategoryPathseg[projectcategoryPathseg.length -1];
        const capitalProjectcategoryLastpath = projectcategoryLastpath.charAt(0).toUpperCase() + projectcategoryLastpath.slice(1);

        // if (projectcategoryLastpath === "apartment")
        // {
        //   searchInput = "Apartment"
        // }else if (projectcategoryLastpath === "plot"){
        //   searchInput = "Plot"
        // }else{
        //   searchInput = "Villa"
        // }
        console.log("hello", searchInput);
        db.collection("Project_Details")
        .where("city", "==", "Chennai")
        .get()
        .then((querySnapshot) => {
          const ProjectType = querySnapshot.docs.map((doc) => 
          doc.data());
          console.log(ProjectType);
          let filteredBuilder = ProjectType.filter((item) => {
            return item.Address.toLowerCase().includes(selectSearchOption.toLowerCase()) || item.project_name.toLowerCase().includes(selectSearchOption.toLowerCase()) || item.builder_details.builder_name.toLowerCase().includes(selectSearchOption.toLowerCase());
        });
        console.log(filteredBuilder);
        setSliceProjectListArray(filteredBuilder);
        })
      
    }
  }
  return (
    <>
      <Header onChange={handleSearchFunction} />
      {/* // container fluid starts */}
      <Container fluid className={styles.container}>
        {/* container starts */}
        <Container>
          <Row className="mt-5 mb-5">
{sliceProjectListArray.map((project, index) => (
  <Col key={project.id} md={4} className="mb-3">
    <Link
      href={`/project-details/${project.project_name_keyword}`}
      style={{ textDecoration: "none" }}
    >
      <div className="hoverbox">
        <div className="position-relative">
          <img
            src={project.project_img}
            alt={project.project_img}
            className={styles.projectimg}
          />
          <p className={`${styles.pprice} ${index % 2 === 0 ? styles.evenPrice : styles.oddPrice}`}>
            {project.project_highlights.Price_range}
          </p>
        </div>
        <h3 className={styles.pheading}>{project.project_name}</h3>
        <p className={styles.ppara}>{project.Address}</p>
      </div>
    </Link>
  </Col>
))}          </Row>
          {sliceProjectListArray.length > 11 ? (
            <Pagination
              className={styles.paginationbar}
              currentPage={currentPage}
              totalCount={projectList.length}
              pageSize={PageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          ) : null}
          {pageLoading === true ? (
            <Row className="mt-5">
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
          {/* container fluid ends */}
        </Container>
        {/* container fluid ends */}
      </Container>
      {sliceProjectListArray.length === 0 ?
      <Container>
            <Row>
              <Image src="/no record found.svg" width={600} height={600} />
            </Row>
          </Container>
          :null}
      {/* import footer from component */}
      <Footer />
    </>
  );
};
export default Projects;
