import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Accordion, Container, Row } from "react-bootstrap";
import styles from "../../styles/projects.module.css";
import Footer from "../components/footer";
import Header from "../components/header";
import { db } from "<cgch-ch>/config/firebaseConfig";
import Link from "next/link";
import Pagination from "<cgch-ch>/pagination/Pagination";
import { ToastContainer, toast } from "react-toastify";
import Image from "next/image";

const ProjectsList = () => {
  const router = useRouter();
  const [projectDetail, setProjectDetail] = useState([]);
  const [faqQuestion, setFaqQuestion] = useState([]);
  const [categoryState, setCategotyState] = useState('');
  const PageSize = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [sliceProjectTypeArray, setSliceArray] = useState([]);

  useEffect(() => {
    fetchData();
    seoData();
  }, [router]);

  async function fetchData() {
    try {
      const pathSegments = window.location.pathname.split("/");
      const category = pathSegments[pathSegments.length - 1];
      const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
      
      const faqDocument = {
        apartment: "apartment-Chennai",
        plot: "plot-Chennai",
        villa: "villa-Chennai"
      }[category] || "villa-Chennai";
      
      try {
        const projectSnapshot = await db.collection("Project_Details")
          .where("city", "==", "Chennai")
          .where("house_type", "==", capitalizedCategory)
          .orderBy("timestamp", "desc")
          .get();
          
        if (!projectSnapshot.empty) {
          const projectData = projectSnapshot.docs.map(doc => doc.data());
          setProjectDetail(projectData);
          const firstPageData = projectData.slice(0, PageSize);
          setSliceArray(firstPageData);
          setCurrentPage(1);
        }
      } catch (error) {
        if (error.code === 'failed-precondition' || error.message.includes('requires an index')) {
          const fallbackSnapshot = await db.collection("Project_Details")
            .where("city", "==", "Chennai")
            .where("house_type", "==", capitalizedCategory)
            .get();
            
          if (!fallbackSnapshot.empty) {
            const projectData = fallbackSnapshot.docs
              .map(doc => ({
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date(0)
              }))
              .sort((a, b) => b.timestamp - a.timestamp);
            
            setProjectDetail(projectData);
            const firstPageData = projectData.slice(0, PageSize);
            setSliceArray(firstPageData);
            setCurrentPage(1);
          }
        }
      }

      const faqDoc = await db.collection("Faq_section")
        .doc(faqDocument)
        .get();
      
      if (faqDoc.exists) {
        const faqData = faqDoc.data().Faq;
        setFaqQuestion(faqData);
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
      setProjectDetail([]);
      setFaqQuestion([]);
    }
  }

  async function seoData() {
    try {
      const projectcategoryPathseg = window.location.pathname.split("/");
      const projectcategoryLastpath = projectcategoryPathseg[projectcategoryPathseg.length - 1];
        
      const docSnapshot = await db.collection("Seo_section")
        .doc(`${projectcategoryLastpath}-Chennai`)
        .get();
      
      if (docSnapshot.exists) {
        setCategotyState(docSnapshot.data());
      }
    } catch (error) {
      console.error('Error in seoData:', error);
    }
  }

  useEffect(() => {
    if (projectDetail.length > 0) {
      const firstPageIndex = (currentPage - 1) * PageSize;
      const lastPageIndex = firstPageIndex + PageSize;
      const paginatedData = projectDetail.slice(firstPageIndex, lastPageIndex);
      setSliceArray(paginatedData);
    }
  }, [currentPage, projectDetail, PageSize]);

  const handleSearchFunction = (selectSearchOption) => {
    if (!selectSearchOption) {
      toast.warn("Please Select any Option!");
      return;
    }

    const projectcategoryPathseg = window.location.pathname.split("/");
    const projectcategoryLastpath = projectcategoryPathseg[projectcategoryPathseg.length - 1];
    const capitalProjectcategoryLastpath = projectcategoryLastpath.charAt(0).toUpperCase() + projectcategoryLastpath.slice(1);
    
    db.collection("Project_Details")
      .where("city", "==", "Chennai")
      .where("house_type", "==", capitalProjectcategoryLastpath)
      .get()
      .then((querySnapshot) => {
        const ProjectType = querySnapshot.docs.map((doc) => doc.data());
        const filteredBuilder = ProjectType.filter((item) => {
          return item.Address.toLowerCase().includes(selectSearchOption.toLowerCase()) || 
                 item.project_name.toLowerCase().includes(selectSearchOption.toLowerCase()) || 
                 item.builder_details.builder_name.toLowerCase().includes(selectSearchOption.toLowerCase());
        });
        setProjectDetail(filteredBuilder);
        setSliceArray(filteredBuilder.slice(0, PageSize));
        setCurrentPage(1);
      });
  };

  return (
    <>
      {categoryState && categoryState.seo && (
        <Head>
          <title>{categoryState.seo.seo_title}</title>
          <meta name="description" content={categoryState.seo.seo_description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta property="og:title" content={categoryState.seo.og_title} />
          <meta property="og:description" content={categoryState.seo.og_description} />
          <meta property="og:image" content="https://chennaigatedcommunity.in/home%20loan.svg" />
          <meta property="og:url" content={categoryState.seo.og_url} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="chennai gated community" />
          <meta name="twitter:title" content="Projects - Your Website Name" />
          <meta name="twitter:description" content="cgc homes best property portal" />
          <meta name="twitter:image" content="https://chennaigatedcommunity.in/home%20loan.svg" />
        </Head>
      )}

      <Header onChange={handleSearchFunction} />

      <Container fluid className={styles.container}>
        <Container>
          <Row className="mt-5 mb-5">
            {sliceProjectTypeArray.map((item, index) => (
              <div className="col-md-4 mb-3" key={item.project_name_keyword}>
                <Link href={`/project-details/${item.project_name_keyword}`} style={{ textDecoration: "none" }}>
                  <div className="hoverbox">
                    <div className="position-relative">
                      <img src={item.project_img} alt={item.project_img} className={styles.projectimg} />
                      <p className={`${styles.pprice} ${index % 2 === 0 ? styles.evenPrice : styles.oddPrice}`}>
                        {item.project_highlights.Price_range}
                      </p>
                    </div>
                    <h3 className={styles.pheading}>{item.project_name}</h3>
                    <p className={styles.ppara}>{item.Address}</p>
                  </div>
                </Link>
              </div>
            ))}
          </Row>

          {projectDetail.length > 0 && (
            <Pagination
              className={styles.paginationbar}
              currentPage={currentPage}
              totalCount={projectDetail.length}
              pageSize={PageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </Container>
      </Container>

      {sliceProjectTypeArray.length === 0 && (
        <Container>
          <Row>
            <Image src="/no record found.svg" width={600} height={600} alt="No records found" />
          </Row>
        </Container>
      )}

      {faqQuestion.length > 0 && (
        <Container fluid>
          <Container>
            <h1 className="text-center mt-5 mb-5">Frequently Asked Questions</h1>
            {faqQuestion.map((question, index) => (
              <div key={index}>
                <Accordion>
                  <Accordion.Header>{question.questions}</Accordion.Header>
                  <Accordion.Body>{question.answers}</Accordion.Body>
                </Accordion>
              </div>
            ))}
          </Container>
        </Container>
      )}

      <Footer />
      <ToastContainer />
    </>
  );
};

export default ProjectsList;
