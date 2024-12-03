import Head from "next/head";
import Header from "../components/header";
import Footer from "../components/footer";
import firebaseApp from "firebase/app";
import { db } from "<cgch-ch>/config/firebaseConfig";

import React, { useEffect, useState } from 'react'
import { Col, Container, Row, ToastContainer } from "react-bootstrap";

const PrivacyPolicy = () => {
  const [privacyState, setPrivacyState] = useState('')
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
      .doc('Privacy-policy-Privacy policy')
      .get()
      .then((docSnapshot) => {
        console.log("document ", docSnapshot);
        if (docSnapshot.exists) {
          setPrivacyState(docSnapshot.data())
          
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
         {privacyState && privacyState.seo &&(
           <Head>
        {/* General Meta Tags */}
        <title>{privacyState.seo.seo_title}</title>
        <meta name="description" content={privacyState.seo.seo_description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph Meta Tags (for Facebook, LinkedIn, etc.) */}
        <meta property="og:title" content={privacyState.seo.og_title} />
        <meta property="og:description" content={privacyState.seo.og_description} />
        <meta property="og:image" content="https://chennaigatedcommunity.in/home%20loan.svg" />
        <meta property="og:url" content={privacyState.seo.og_url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="chennai gated community" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:title" content="Projects - Your Website Name" />
        <meta name="twitter:description" content="cgc homes best property portal is the fastest growing real estate portal, you can buy flat, new flats, resale flats, duplex flats and sell residential property for best price" />
        <meta name="twitter:image" content="https://chennaigatedcommunity.in/home%20loan.svg" />
      </Head>
      )}
  <Header/>
  <Container>
    <Row className="mt-5 mb-5">
      <Col>
        <p>This Privacy policy is subject to the terms of the Site Policy (User agreement) of this website. In order to provide a personalised browsing experience, we may collect personal information from you. Additionally some of our websites may require you to complete a registration form or seek some information from you. When you let us have your preferences, we will be able to deliver or allow you to access the most relevant information that meets your end.</p>
        <p>To extend this personalized experience we may track the IP address of a user's computer and save certain information on your system in the form of cookies. A user has the option of accepting or declining the cookies of this website by changing the settings of your browser.</p>
        <p>The personal information provided by the users to us will not be provided to third parties without previous consent of the user concerned. Information of a general nature may however be revealed to external parties.</p>
        <p>Every effort will be made to keep the information provided by users in a safe manner, the information will be displayed on the website will be done so only after obtaining consent from the users. Any user browsing the site generally is not required to disclose his identity or provide any information about him/her, it is only at the time of registration you will be required to furnish the details in the registration form.</p>
        <p>A user always has the option of not providing the information which is not mandatory. You are solely responsible for maintaining confidentiality of the User password and user identification and all activities and transmission performed by the User through his user identification and shall be solely responsible for carrying out any online or off-line transaction involving credit cards / debit cards or such other forms of instruments or documents for making such transactions and IEIL assumes no responsibility or liability for their improper use of information relating to such usage of credit cards / debit cards used by the subscriber online / off-line.</p>
        <p>You agree that CGC Homes may use personal information about you to improve its marketing and promotional efforts, to analyze site usage, improve the Site's content and product offerings, and customise the Site's content, layout, and services. These uses improve the Site and better tailor it to meet your needs, so as to provide you with a smooth, efficient, safe and customised experience while using the Site.</p>
        <p>You agree that CGC Homes may use your personal information to contact you and deliver information to you that, in some cases, are targeted to your interests, such as targeted banner advertisements, administrative notices, product offerings, forum comments and reviews, your portfolio related updates, and communications relevant to your use of the Site. By accepting the User Agreement and Privacy Policy, you expressly agree to receive this information. If you do not wish to receive these communications, we encourage you to opt out of the receipt of certain communications in your profile. You may make changes to your profile at any time. It is the belief of Chennai Gated Community that privacy of a person can be best guaranteed by working in conjunction with the Law enforcement authorities.</p>
        <p>All CGC Homes websites including this website fully comply with all Indian Laws applicable. CGC Homes has always cooperated with all law enforcement inquires. Chennai Gated Community may disclose all or part of your personal details in response to a request from the law enforcement authorities or in a case of bonafide requirement to prevent an imminent breach of the law. CGC Homes has taken all reasonable steps to ensure that information on this site is authentic. Users are advised to research bonafides of advertisers independently. CGC Homes shall not have any responsibility in this regard. We also recommend that you visit link to User agreement/Disclaimer for more comprehensive information on this aspect.</p>
        <p>CGC Homes has implemented and uses Display Advertising. CGC Homes is using Remarketing with Google Analytics to advertise online. You can opt-out of Google Analytics for Display Advertising and customize Google Display Network ads using the Ads Preferences Manager. Third-party vendors, including Google, show our ads on sites across the Internet. We and third-party vendors, including Google, use first-party cookies (such as the Google Analytics cookies) and third-party cookies (such as the DoubleClick cookie) together to inform, optimize, and serve ads based on someone's past visits to our website.</p>
      </Col>
    </Row>
</Container>
  <Footer/>
  </div>
  )
}

export default PrivacyPolicy