import Head from "next/head";
import Header from "../components/header";
import Footer from "../components/footer";
import { Col, Container, Row, ToastContainer } from "react-bootstrap";
import { doc, getDoc } from 'firebase/firestore';
import { db } from "<cgch-ch>/config/firebaseConfig";
import React, { useEffect, useState } from "react";
import firebaseApp from "firebase/app";

const Disclaimer = () => {
  const [disclaimerState, setDisclaimerState] = useState('')
    // Fetch data on component mount
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
    }, []); // Empty dependency array to run effect only on mount
  async function fetchData() {
    try {
      db.collection("Seo_section")
        .doc('Disclaimer-Disclaimer')
        .get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            setDisclaimerState(docSnapshot.data())
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
  return (
    <div>
      {disclaimerState && disclaimerState.seo &&(
           <Head>
        {/* General Meta Tags */}
        <title>{disclaimerState.seo.seo_title}</title>
        <meta name="description" content={disclaimerState.seo.seo_description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph Meta Tags (for Facebook, LinkedIn, etc.) */}
        <meta property="og:title" content={disclaimerState.seo.og_title} />
        <meta property="og:description" content={disclaimerState.seo.og_description} />
        <meta property="og:image" content="https://chennaigatedcommunity.in/home%20loan.svg" />
        <meta property="og:url" content={disclaimerState.seo.og_url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="chennai gated community" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:title" content="Projects - Your Website Name" />
        <meta name="twitter:description" content="cgc homes best property portal is the fastest growing real estate portal, you can buy flat, new flats, resale flats, duplex flats and sell residential property for best price" />
        <meta name="twitter:image" content="https://chennaigatedcommunity.in/home%20loan.svg" />
      </Head>
      )}
      <Header />
      <Container>
        <Row className="mt-5">
          <Col>
          <h4 className="mb-4">Disclaimer</h4>
          <p>
            The contents of this Disclaimer along with the terms of the Website
            User Agreement are applicable to all hyperlinks under
            www.chennaigatedcommunity.com. You hereby acknowledge of having read
            and accepted the same by use or access of this Website.
          </p>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
          <h4 className="mb-4">About CGC Homes</h4>
          <p>
            www.chennaigatedcommunity.com intends to connect the buyer of various
            properties with the seller of such properties through its Website. In
            providing unified interface to certain real estate projects, CGC Homes
            or any of its affiliates or group companies does not provide any
            service of any nature to the users either for commercial purposes or
            otherwise save and except for the limited purposes of providing access
            to a communication system over which information would be made
            available by third parties to you which shall be transmitted or
            temporarily stored or hosted. However, Chennai Gated Community.com
            does not:
          </p>
          <ul>
            <li>initiate any transmission.</li>
            <li>Select the receiver of the transmission</li>
            <li>
              Select or modify the information contained in the transmission.
            </li>
          </ul>
          <p>
            If you have any question regarding this Disclaimer you may please
            contact us and we will try to attend to your query.
          </p>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
          <h4 className="mb-4">Using This Website</h4>
          <p>
          Any use of this Website would expressly mean that you irrevocably
          accept all the terms of this Disclaimer and Website User Agreement
          specified at www.chennaigatedcommunity.com/disclaimer. You understand
          that are free to not accept the terms and conditions contained herein
          and the Website User Agreement and in such event you are advised to
          not use or access this Website in any manner. Your use or access of
          this Website in any manner shall constitute an irrevocable acceptance
          of this Disclaimer.
          </p>
          <p> Any person who is accessing or has accessed any information or data
          from this Website acknowledges and agrees that all proprietary rights,
          statutory or otherwise, in the information received by such person
          shall remain the exclusive property of CGC Homes. Any reproduction,
          redistribution or transmission, for consideration or otherwise, of any
          such information contained in this Website is strictly prohibited and
          would constitute a breach of the laws of India.</p>
          <p> This Website is not to be and should not be construed as purporting to
          offer or an invitation to offer. Further, this website is not to be
          and should not be construed as purporting to offer or inviting to
          offer any information or services to citizens of countries other than
          who are subject to the jurisdiction of and the laws of India. The User
          agrees that given the nature of the Internet, even though the Website
          is targeted to Indian residents only, it may be accessed in other
          parts of the world. If the User is not an Indian resident and yet uses
          the Website, he acknowledges, understands and agrees that he is doing
          so on his own initiative and at his own risk and that it is his
          responsibility (and not Chennai Gated Community's responsibility) to
          make sure that his use of the Website complies with all applicable
          local laws. If the User is not an Indian resident, by using this
          Website and/or submitting his personally identifiable information or
          any other information on the Website, he expressly consents to the
          transfer of such data to India, and to the processing of such data on
          Chennai Gated Community'S Indian servers, where his data will be
          governed by Indian laws that may provide a level of data protection
          different than his country.</p>
          <p>
          CGC Homes.com does not provide any advice in this regard and shall not
          be liable to any person who enters into any business relationship with
          the entity whose name appears on this Website and/ or any other party
          based on any information accessed from this Website or uses such
          information or is accessing any information for any investment,
          company affairs, legal, tax or accounting advice or advice regarding
          the suitability or profitability of a security or investment. Any
          information on this Website must not be construed as business/
          investment advice, and the user should exercise due caution and/or
          seek independent advice before the user enters into any business
          relationship with any entity or enters into any investment or
          financial obligation based on any information provided on this
          Website.</p>
          </Col>
        </Row>
        <Row className="mt-4 mb-5">
          <Col>
          <h4 className="mb-4">Third Party Links</h4>
          <p>This website may contain links to other Websites or videos that may
            be belong to and/or hosted and/or operated by parties other than CGC
            Homes, for e.g. videos hosted by our third party service provider's
            server or any other similar activity. CGC Homes is not responsible
            for the contents of any nature (including any related advertisements
            or videos) or information offered by any such linked Website or any
            link contained in a linked Website, or any changes or updates to
            such Websites, irrespective of whether these Websites are operated
            by affiliates of CGC Homes or other third parties. Inclusion of such
            a link on this Website does not imply any degree of endorsement of
            any nature by Chennai Gated Community, regarding the quality of
            information provided or the nature of content by such a linked
            Website.</p>
            <p> This Website may contain information sourced from third parties. CGC
            Homes is not responsible for the contents of or information offered
            by such third parties on this Website. Inclusion of such information
            on this Website does not imply any degree of endorsement by CGC
            Homes, regarding the quality of information provided or the nature
            of content provided by the third party. By agreeing to post a
            property listing or requirement at CGC Homes.com or responding to
            and advertising on CGC Homes.com or by using the services of CGC
            Homes.com, the user hereby acknowledges and allows CGC Homes.com,
            its partners and other users of the site to get in touch with
            him/her from time to time for intimating the users on events,
            potential buyers, tenants or properties they might be interested in.
            This could include offers to upgrade to premium services,
            information, as well as promotions.</p>
            <p>CGC Homes.com can use the user's email address and/or contact
            numbers for this purpose irrespective of the user's registration
            with the "National Do Not Call Registry" and will override any such
            DND registrations.</p>
          </Col>
        </Row>
        
      </Container>
      <Footer />
    </div>
  );
};

export default Disclaimer;
