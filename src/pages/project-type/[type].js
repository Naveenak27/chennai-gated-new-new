//Import Pagkages
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import styles from "../../styles/projects.module.css";
import Footer from "../components/footer";
import Header from "../components/header";
import { db } from "<cgch-ch>/config/firebaseConfig";
import Link from "next/link";
import Pagination from "<cgch-ch>/pagination/Pagination";
import { useMemo } from "react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";


const ProjectsType = () => {
  const router = useRouter();
  // Getting Last path for Porject Type & Project Category
  const [currentPageProjectList, setProjectPage] = useState([]);
  const [projecttypeLastpath, setProjecttypeLatpath] = useState([]);
  const [projectType, setProjectType] = useState([]);
  const [projectDetail, setProjectDetail] = useState([]);
  const [categoryState, setCategotyState] = useState('')
  useEffect(() => {
    fetchData();
    seoData()

  }, [router]);
  async function fetchData() {
    try {
        // Get category from URL and capitalize it
        const projectcategoryPathseg = window.location.pathname.split("/");
        const projectcategoryLastpath = projectcategoryPathseg[projectcategoryPathseg.length - 1];
        const capitalProjectcategoryLastpath = 
            projectcategoryLastpath.charAt(0).toUpperCase() + 
            projectcategoryLastpath.slice(1);

        try {
            // First attempt with ordering
            const querySnapshot = await db.collection("Project_Details")
                .where("city", "==", "Chennai")
                .where("property_category", "==", capitalProjectcategoryLastpath)
                .orderBy("timestamp", "desc")
                .get();

            if (!querySnapshot.empty) {
                const ProjectCategory = querySnapshot.docs.map(doc => doc.data());
                console.log("Project data:", ProjectCategory);
                setProjectDetail(ProjectCategory);
            }
        } catch (error) {
            // Handle missing index error
            if (error.code === 'failed-precondition' || error.message.includes('requires an index')) {
                console.warn('Index not found, falling back to unordered query');
                
                // Fallback query without ordering
                const fallbackSnapshot = await db.collection("Project_Details")
                    .where("city", "==", "Chennai")
                    .where("property_category", "==", capitalProjectcategoryLastpath)
                    .get();

                if (!fallbackSnapshot.empty) {
                    // Sort the results in memory
                    const ProjectCategory = fallbackSnapshot.docs
                        .map(doc => ({
                            ...doc.data(),
                            timestamp: doc.data().timestamp?.toDate() || new Date(0)
                        }))
                        .sort((a, b) => b.timestamp - a.timestamp);

                    console.log("Project data (fallback):", ProjectCategory);
                    setProjectDetail(ProjectCategory);
                } else {
                    console.warn(`No projects found for category: ${capitalProjectcategoryLastpath}`);
                    setProjectDetail([]);
                }
            } else {
                // If it's not an index error, rethrow
                throw error;
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        setProjectDetail([]);
        
        // Show user-friendly error message
        if (error.code === 'failed-precondition' || error.message.includes('requires an index')) {
            alert('Database configuration needed. Please contact the administrator.');
        } else {
            alert('An error occurred while fetching the data. Please try again later.');
        }
    }
}  async function seoData() {
    try {
      const projectcategoryPathseg = window.location.pathname.split("/");
      const projectcategoryLastpath =
        projectcategoryPathseg[projectcategoryPathseg.length - 1];
      const capitalProjectcategoryLastpath =
        projectcategoryLastpath.charAt(0).toUpperCase() +
        projectcategoryLastpath.slice(1);
      db.collection("Seo_section")
        .doc(`property-category-${capitalProjectcategoryLastpath}`)
        .get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            setCategotyState(docSnapshot.data())
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.error('Error fetching document:', error);
        });
    } catch (error) {
      console.error('Error in try-catch:', error);
    }
  }
  
  let PageSize = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [sliceProjectsCategoryArray, setSliceProjectsCategoryArray] = useState([]);
  const [sliceArrayBool, setSliceArrayBool] = useState(false);
  const splitDataForPagination = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    setSliceProjectsCategoryArray(projectDetail.slice(firstPageIndex, lastPageIndex));
    setSliceArrayBool(true);
  };
  useMemo(() => {
    splitDataForPagination();
  }, [currentPage, projectDetail]);
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
        .where("property_category", "==", capitalProjectcategoryLastpath)
        .get()
        .then((querySnapshot) => {
          const ProjectType = querySnapshot.docs.map((doc) => 
          doc.data());
          console.log(ProjectType);
          let filteredBuilder = ProjectType.filter((item) => {
            return item.Address.toLowerCase().includes(selectSearchOption.toLowerCase()) || item.project_name.toLowerCase().includes(selectSearchOption.toLowerCase()) || item.builder_details.builder_name.toLowerCase().includes(selectSearchOption.toLowerCase());
        });
        console.log(filteredBuilder);
        setProjectDetail(filteredBuilder);
        })
      
    }
  }
  
  return (
    <>
          {categoryState && categoryState.seo &&(
           <Head>
        {/* General Meta Tags */}
        <title>{categoryState.seo.seo_title}</title>
        <meta name="description" content={categoryState.seo.seo_description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph Meta Tags (for Facebook, LinkedIn, etc.) */}
        <meta property="og:title" content={categoryState.seo.og_title} />
        <meta property="og:description" content={categoryState.seo.og_description} />
        <meta property="og:image" content="https://chennaigatedcommunity.in/home%20loan.svg" />
        <meta property="og:url" content={categoryState.seo.og_url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="chennai gated community" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:title" content="Projects - Your Website Name" />
        <meta name="twitter:description" content="cgc homes best property portal is the fastest growing real estate portal, you can buy flat, new flats, resale flats, duplex flats and sell residential property for best price" />
        <meta name="twitter:image" content="https://chennaigatedcommunity.in/home%20loan.svg" />
      </Head>
      )}
      <Header onChange={handleSearchFunction}/>
      {/* Container fluid starts */}
      <Container fluid className={styles.container}>
        {sliceProjectsCategoryArray.length > 0 ? (
          <Container>
            <Row className="mt-5 mb-5">
            {sliceProjectsCategoryArray.map((item, index) => (
  <div className="col-md-4 mb-3" key={item.project_name_keyword}>
    <Link
      href={`/project-details/${item.project_name_keyword}`}
      style={{ textDecoration: "none" }}
    >
      <div className="hoverbox">
        <div className="position-relative">
          <img
            src={item.project_img}
            alt={item.project_img}
            className={styles.projectimg}
          />
          <p className={`${styles.pprice} ${index % 2 === 0 ? styles.evenPrice : styles.oddPrice}`}>
            {item.project_highlights.Price_range}
          </p>
        </div>
        <h3 className={styles.pheading}>{item.project_name}</h3>
        <p className={styles.ppara}>{item.Address}</p>
      </div>
    </Link>
  </div>
))}            </Row>
            <Pagination
              className={styles.paginationbar}
              currentPage={currentPage}
              totalCount={projectDetail.length}
              pageSize={PageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </Container>
        ) : (
          <Container>
            <Row>
              <Image src="/no record found.svg" width={600} height={600} />
            </Row>
          </Container>
        )}
        {/* container fluid ends */}
      </Container>
      <Footer />
    </>
  );
};
export default ProjectsType;
